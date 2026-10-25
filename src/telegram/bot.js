/*
 * Project Nahan - Telegram Bot Handler & Interactive Menus
 */

import { state, fetchT, usageTotalBytes, limitReqToBytes } from "../config.js";
import { d1Get, d1Put, cachedD1Put, logActivity } from "../db.js";
import { botI18n } from "./i18n.js";

export function getPanelsList() {
    const panels = [];
    panels.push({
        name: state.sysConfig.name || "Main Panel",
        host: null,
        apiRoute: state.sysConfig.apiRoute,
        apiKey: null,
        isLocal: true,
    });
    if (state.sysConfig.linkedPanels && Array.isArray(state.sysConfig.linkedPanels)) {
        state.sysConfig.linkedPanels.forEach((p) => {
            if (p && p.host) {
                panels.push({
                    name: p.name || p.host,
                    host: p.host,
                    apiRoute: p.apiRoute || state.sysConfig.apiRoute,
                    apiKey: p.apiKey || p.masterKey || null,
                    isLocal: false,
                });
            }
        });
    }
    return panels;
}

export async function remotePanelFetch(panel, method, path, body = null) {
    try {
        const url = `https://${panel.host}/${encodeURI(panel.apiRoute)}${path}`;
        const options = {
            method,
            headers: { "Content-Type": "application/json" },
        };
        if (body) options.body = JSON.stringify(body);
        const res = await fetchT(url, { ...options, signal: AbortSignal.timeout(8000) });
        return await res.json();
    } catch (e) {
        return { success: false, error: e.message };
    }
}

export async function fetchRemotePanelUsers(panel) {
    return await remotePanelFetch(panel, "GET", `/api/users?key=${encodeURIComponent(panel.apiKey)}`);
}

export async function fetchRemotePanelStats(panel) {
    return await remotePanelFetch(panel, "GET", `/api/stats?key=${encodeURIComponent(panel.apiKey)}`);
}

export async function remotePanelWriteAction(panel, method, userId, body = null) {
    let path = "/api/users";
    if (userId) path += `?id=${encodeURIComponent(userId)}&key=${encodeURIComponent(panel.apiKey)}`;
    else path += `?key=${encodeURIComponent(panel.apiKey)}`;
    return await remotePanelFetch(panel, method, path, body || { key: panel.apiKey });
}

export async function fetchCloudflareUsage(accountId, apiToken) {
    if (!accountId || !apiToken) return null;
    try {
        const d = new Date();
        const currentDate = d.toISOString().split("T")[0] + "T00:00:00Z";
        const query = `query GetDailyUsage($accountId: String!, $start: ISO8601DateTime!) { viewer { accounts(filter: {accountTag: $accountId}) { workersInvocationsAdaptive(limit: 1, filter: { datetime_geq: $start }) { sum { requests } } } } }`;
        const variables = { accountId: accountId, start: currentDate };
        const res = await fetchT("https://api.cloudflare.com/client/v4/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables }),
        });
        const json = await res.json();
        const reqs = json?.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive?.[0]?.sum?.requests;
        return typeof reqs === "number" ? reqs : null;
    } catch (e) {
        return null;
    }
}

export async function sendTelegramMessage(request, type, hostName) {
    if (!state.sysConfig.tgToken || !(state.sysConfig.tgAdminId || state.sysConfig.tgChatId)) return;
    const escMd = (s) => String(s).replace(/[_*()[`[]/g, "\\$&");
    let usageStr = "Unknown (0.00%)";
    if (state.sysConfig.cfAccountId && state.sysConfig.cfApiToken) {
        const reqs = await fetchCloudflareUsage(state.sysConfig.cfAccountId, state.sysConfig.cfApiToken);
        if (reqs !== null) {
            const limit = 100000;
            const pct = ((reqs / limit) * 100).toFixed(2);
            usageStr = `${reqs}/${limit} ${pct}%`;
        }
    }

    const ip = request.headers.get("cf-connecting-ip") || "Unknown";
    const cf = request.cf || {};
    const country = cf.country || "Unknown";
    const city = cf.city || "Unknown";
    const asn = cf.asn || "Unknown";
    const asOrg = cf.asOrganization || "Unknown";
    const domain = request.headers.get("Host") || new URL(request.url).hostname;
    const path = new URL(request.url).pathname;
    const ua = request.headers.get("User-Agent") || "Unknown UA";

    const d = new Date();
    const timeStr = d.toISOString();
    const text =
        `📌 Type: ${escMd(type)}\n` +
        `🌐 IP: ${escMd(ip)}\n` +
        `📍 Location: ${escMd(country)} ${escMd(city)}\n` +
        `🏢 ASN: AS${escMd(asn)} ${escMd(asOrg)}\n` +
        `🔗 Domain: ${escMd(domain)}\n` +
        `🔍 Path: ${escMd(path)}\n` +
        `🤖 UA: ${escMd(ua)}\n` +
        `📅 Time: ${escMd(timeStr)}\n` +
        `📊 Usage: ${usageStr}`;

    const h = hostName || domain;
    const langCode = state.sysConfig.tgBotLang || "fa";
    const locT = (key) => botI18n[langCode]?.[key] || botI18n["en"]?.[key] || key;
    const isPaused = state.sysConfig.isPaused || false;
    const panelUrl = `https://${h}/${encodeURI(state.sysConfig.apiRoute)}/dash`;

    const inline_keyboard = [
        [
            { text: `📊 ${locT("dashboard")}`, callback_data: "sys_dashboard" },
            { text: `📈 ${locT("statistics")}`, callback_data: "sys_stats" },
        ],
        [
            { text: `🌐 ${langCode === "fa" ? "English 🇺🇸" : "فارسی 🇮🇷"}`, callback_data: "sys_lang" },
            { text: isPaused ? `▶️ ${locT("btn_resume")}` : `⏸️ ${locT("btn_pause")}`, callback_data: "sys_toggle_status" },
        ],
        [{ text: `🔑 ${locT("dash")}`, web_app: { url: panelUrl } }],
    ];

    const tgUrl = `https://api.telegram.org/bot${state.sysConfig.tgToken}/sendMessage`;
    const notifyChatId = state.sysConfig.tgAdminId || state.sysConfig.tgChatId;
    try {
        await fetchT(tgUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: notifyChatId, text, parse_mode: "Markdown", reply_markup: { inline_keyboard } }),
        });
    } catch (e) {}
}

export async function handleTelegramWebhook(request, env, hostName, ctx) {
    try {
        const update = await request.json();
        const tgApi = `https://api.telegram.org/bot${state.sysConfig.tgToken}`;
        const langCode = state.sysConfig.tgBotLang || "fa";
        const t = (key) => botI18n[langCode]?.[key] || botI18n["en"]?.[key] || key;

        const callerId = update.callback_query?.from?.id?.toString() || update.message?.from?.id?.toString();
        const adminId = state.sysConfig.tgAdminId || state.sysConfig.tgChatId;
        const isAuthorized = adminId && callerId === adminId.toString();

        let tgState = {};
        try {
            const rawState = await d1Get(env, "tg_bot_state");
            if (rawState) tgState = JSON.parse(rawState);
        } catch (e) {}

        const sendOrEdit = async (chatId, text, kb = null, messageId = null) => {
            const body = { chat_id: chatId, text, parse_mode: "HTML" };
            if (kb) body.reply_markup = kb;
            const endpoint = messageId ? `${tgApi}/editMessageText` : `${tgApi}/sendMessage`;
            if (messageId) body.message_id = messageId;
            return await fetchT(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
        };

        const getMainMenu = () => {
            const text = `⚙️ <b>${t("main_menu_title")}</b>\n\n📌 <b>Node:</b> <code>${state.sysConfig.name || hostName}</code>\n🔋 <b>Status:</b> ${state.sysConfig.isPaused ? "⏸️ " + t("status_paused") : "▶️ " + t("status_running")}`;
            const kb = {
                inline_keyboard: [
                    [
                        { text: `👥 ${t("sub_management")}`, callback_data: "subs_list:0" },
                        { text: `➕ ${t("sub_add")}`, callback_data: "sub_add_init" },
                    ],
                    [
                        { text: `📊 ${t("dashboard")}`, callback_data: "sys_dashboard" },
                        { text: `📈 ${t("statistics")}`, callback_data: "sys_stats" },
                    ],
                    [
                        { text: `🌐 ${langCode === "fa" ? "English 🇺🇸" : "فارسی 🇮🇷"}`, callback_data: "sys_lang" },
                        { text: state.sysConfig.isPaused ? `▶️ ${t("btn_resume")}` : `⏸️ ${t("btn_pause")}`, callback_data: "sys_toggle_status" },
                    ],
                    [{ text: `🚨 ${t("panic_button")}`, callback_data: "sys_panic_init" }],
                ],
            };
            return { text, kb };
        };

        const getSubDetail = (uuid, userList = null) => {
            const users = userList || state.sysConfig.users || [];
            const u = users.find((usr) => usr.id === uuid);
            if (!u) return { text: t("lbl_user_not_found"), kb: { inline_keyboard: [[{ text: t("btn_back_to_list"), callback_data: "subs_list:0" }]] } };

            const idClean = u.id.replace(/-/g, "").toLowerCase();
            const sysU = state.sysUsageCache?.users?.[idClean] || { reqs: 0 };
            const usedBytes = usageTotalBytes(sysU);
            const limitBytes = limitReqToBytes(u.limitTotalReq);
            const totalGb = (usedBytes / 1073741824).toFixed(2);
            const limitGb = u.limitTotalReq ? (limitBytes / 1073741824).toFixed(2) : "Unlimited";
            const isExpired = u.expiryMs && Date.now() > u.expiryMs;
            let statusStr = "🟢 " + t("status_active");
            if (u.isPaused) statusStr = "🔴 " + t("status_disabled");
            else if (isExpired) statusStr = "⏰ " + t("status_expired");

            const subUrl = `https://${hostName}/${state.sysConfig.apiRoute}?sub=${encodeURIComponent(u.name)}`;
            const text = `👤 <b>${u.name}</b>\n\n🆔 <code>${u.id}</code>\n📊 <b>${t("sub_usage")}:</b> ${totalGb} / ${limitGb} GB\n📅 <b>${t("sub_expiry")}:</b> ${u.expiryMs ? new Date(u.expiryMs).toLocaleDateString() : t("lbl_none")}\n🔋 <b>${t("sub_status")}:</b> ${statusStr}\n🔗 <b>${t("lbl_subscription")}:</b>\n<code>${subUrl}</code>`;

            const kb = {
                inline_keyboard: [
                    [
                        { text: u.isPaused ? `▶️ ${t("btn_resume")}` : `⏸️ ${t("btn_pause")}`, callback_data: `sub_toggle:${u.id}` },
                        { text: `🗑️ ${t("btn_del")}`, callback_data: `sub_del_init:${u.id}` },
                    ],
                    [
                        { text: `🔄 ${t("reset_traffic")}`, callback_data: `sub_reset_traffic:${u.id}` },
                        { text: `📅 ${t("extend_expiry")}`, callback_data: `sub_extend_init:${u.id}` },
                    ],
                    [{ text: t("btn_back_to_list"), callback_data: "subs_list:0" }],
                ],
            };
            return { text, kb };
        };

        if (update.callback_query) {
            const cb = update.callback_query;
            const chatId = cb.message?.chat?.id;
            const messageId = cb.message?.message_id;
            const data = cb.data;

            if (chatId) {
                if (!isAuthorized) {
                    await fetchT(`${tgApi}/answerCallbackQuery`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ callback_query_id: cb.id, text: t("access_denied"), show_alert: true }),
                    });
                    return new Response("OK", { status: 200 });
                }

                tgState[chatId] = null;
                ctx?.waitUntil(d1Put(env, "tg_bot_state", JSON.stringify(tgState)).catch(() => {}));

                if (data === "main_menu") {
                    const menu = getMainMenu();
                    await sendOrEdit(chatId, menu.text, menu.kb, messageId);
                } else if (data === "sys_lang") {
                    state.sysConfig.tgBotLang = langCode === "fa" ? "en" : "fa";
                    await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
                    const menu = getMainMenu();
                    await sendOrEdit(chatId, menu.text, menu.kb, messageId);
                } else if (data === "sys_toggle_status") {
                    state.sysConfig.isPaused = !state.sysConfig.isPaused;
                    await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
                    const menu = getMainMenu();
                    await sendOrEdit(chatId, menu.text, menu.kb, messageId);
                } else if (data.startsWith("subs_list:")) {
                    const page = parseInt(data.replace("subs_list:", "")) || 0;
                    const users = state.sysConfig.users || [];
                    const pageSize = 5;
                    const totalPages = Math.ceil(users.length / pageSize) || 1;
                    const curUsers = users.slice(page * pageSize, (page + 1) * pageSize);

                    const rows = curUsers.map((u) => [
                        { text: `${u.isPaused ? "🔴" : "🟢"} ${u.name}`, callback_data: `sub_detail:${u.id}` },
                    ]);
                    const nav = [];
                    if (page > 0) nav.push({ text: "◀️ Prev", callback_data: `subs_list:${page - 1}` });
                    nav.push({ text: `${page + 1}/${totalPages}`, callback_data: "noop" });
                    if (page + 1 < totalPages) nav.push({ text: "Next ▶️", callback_data: `subs_list:${page + 1}` });
                    rows.push(nav);
                    rows.push([{ text: `➕ ${t("sub_add")}`, callback_data: "sub_add_init" }, { text: t("btn_main_menu"), callback_data: "main_menu" }]);

                    await sendOrEdit(chatId, `👥 <b>${t("subs_list")}</b> (${users.length})`, { inline_keyboard: rows }, messageId);
                } else if (data.startsWith("sub_detail:")) {
                    const uuid = data.replace("sub_detail:", "");
                    const detail = getSubDetail(uuid);
                    await sendOrEdit(chatId, detail.text, detail.kb, messageId);
                } else if (data.startsWith("sub_toggle:")) {
                    const uuid = data.replace("sub_toggle:", "");
                    const u = (state.sysConfig.users || []).find((usr) => usr.id === uuid);
                    if (u) {
                        u.isPaused = !u.isPaused;
                        if (!u.isPaused) { u.disabledReason = null; u.disabledAt = null; }
                        await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
                    }
                    const detail = getSubDetail(uuid);
                    await sendOrEdit(chatId, detail.text, detail.kb, messageId);
                } else if (data.startsWith("sub_reset_traffic:")) {
                    const uuid = data.replace("sub_reset_traffic:", "");
                    const uId = uuid.replace(/-/g, "").toLowerCase();
                    if (state.sysUsageCache.users?.[uId]) {
                        state.sysUsageCache.users[uId].reqs = 0;
                        state.sysUsageCache.users[uId].dReqs = 0;
                        await cachedD1Put(env, "sys_usage", JSON.stringify(state.sysUsageCache));
                    }
                    const detail = getSubDetail(uuid);
                    await sendOrEdit(chatId, `✅ ${t("msg_traffic_reset")}\n\n${detail.text}`, detail.kb, messageId);
                } else if (data.startsWith("sub_del_init:")) {
                    const uuid = data.replace("sub_del_init:", "");
                    const u = (state.sysConfig.users || []).find((usr) => usr.id === uuid);
                    const name = u ? u.name : "";
                    const text = `${t("msg_confirm_del")}\n\n👤 <b>${name}</b>`;
                    const kb = {
                        inline_keyboard: [
                            [
                                { text: `✅ ${t("btn_confirm")}`, callback_data: `sub_del_confirm:${uuid}` },
                                { text: `❌ ${t("btn_cancel")}`, callback_data: `sub_detail:${uuid}` },
                            ],
                        ],
                    };
                    await sendOrEdit(chatId, text, kb, messageId);
                } else if (data.startsWith("sub_del_confirm:")) {
                    const uuid = data.replace("sub_del_confirm:", "");
                    state.sysConfig.users = (state.sysConfig.users || []).filter((usr) => usr.id !== uuid);
                    await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
                    await sendOrEdit(chatId, `✅ ${t("msg_deleted")}`, {
                        inline_keyboard: [[{ text: t("btn_back_to_list"), callback_data: "subs_list:0" }]],
                    }, messageId);
                } else if (data === "sub_add_init") {
                    tgState[chatId] = { step: "sub_add_name" };
                    ctx?.waitUntil(d1Put(env, "tg_bot_state", JSON.stringify(tgState)).catch(() => {}));
                    await sendOrEdit(chatId, `➕ ${t("msg_enter_name")}`, {
                        inline_keyboard: [[{ text: `❌ ${t("btn_cancel")}`, callback_data: "subs_list:0" }]],
                    }, messageId);
                } else if (data === "sys_panic_init") {
                    await sendOrEdit(chatId, `${t("msg_confirm_panic")}`, {
                        inline_keyboard: [
                            [
                                { text: `🚨 YES PANIC 🚨`, callback_data: "sys_panic_confirm" },
                                { text: `❌ Cancel`, callback_data: "main_menu" },
                            ],
                        ],
                    }, messageId);
                } else if (data === "sys_panic_confirm") {
                    state.sysConfig.apiRoute = Array.from(crypto.getRandomValues(new Uint8Array(8)))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                    state.sysConfig.isPaused = true;
                    await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
                    await sendOrEdit(chatId, `${t("msg_panic")}\n\n🔑 New Secret Path: <code>${state.sysConfig.apiRoute}</code>`, {
                        inline_keyboard: [[{ text: t("btn_main_menu"), callback_data: "main_menu" }]],
                    }, messageId);
                } else if (data === "sys_dashboard" || data === "sys_stats") {
                    const users = state.sysConfig.users || [];
                    const activeCount = users.filter((u) => !u.isPaused && (!u.expiryMs || Date.now() <= u.expiryMs)).length;
                    const pausedCount = users.filter((u) => u.isPaused).length;
                    const text = `📊 <b>${t("dashboard")}</b>\n\n👥 <b>Total Users:</b> ${users.length}\n🟢 <b>Active:</b> ${activeCount}\n⏸️ <b>Paused:</b> ${pausedCount}\n🔌 <b>Conns:</b> ${state.activeConnections}\n📦 <b>Version:</b> ${state.sysConfig.version || "3.0.4"}`;
                    await sendOrEdit(chatId, text, { inline_keyboard: [[{ text: t("btn_main_menu"), callback_data: "main_menu" }]] }, messageId);
                }
            }
        } else if (update.message) {
            const msg = update.message;
            const chatId = msg.chat?.id;
            const text = (msg.text || "").trim();

            if (chatId && isAuthorized) {
                const stateObj = tgState[chatId];
                if (stateObj && stateObj.step === "sub_add_name") {
                    const newUuid = crypto.randomUUID();
                    if (!state.sysConfig.users) state.sysConfig.users = [];
                    state.sysConfig.users.push({
                        id: newUuid,
                        name: text,
                        limitTotalReq: null,
                        limitDailyReq: null,
                        expiryMs: null,
                        createdAt: Date.now(),
                    });
                    await cachedD1Put(env, "sys_config", JSON.stringify(state.sysConfig));
                    tgState[chatId] = null;
                    ctx?.waitUntil(d1Put(env, "tg_bot_state", JSON.stringify(tgState)).catch(() => {}));
                    const detail = getSubDetail(newUuid);
                    await sendOrEdit(chatId, `✅ ${t("msg_added")}\n\n${detail.text}`, detail.kb);
                    return new Response("OK", { status: 200 });
                }

                if (text === "/start" || text === "/menu") {
                    const menu = getMainMenu();
                    await sendOrEdit(chatId, menu.text, menu.kb);
                    return new Response("OK", { status: 200 });
                }

                const menu = getMainMenu();
                await sendOrEdit(chatId, menu.text, menu.kb);
            } else if (chatId) {
                // Non-admin sending user id lookup
                const lookupId = text.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();
                const matchedUser = (state.sysConfig.users || []).find(
                    (u) => u.id === lookupId || u.name.toLowerCase() === lookupId.toLowerCase(),
                );
                if (matchedUser) {
                    const detail = getSubDetail(matchedUser.id);
                    await sendOrEdit(chatId, detail.text, detail.kb);
                } else {
                    await sendOrEdit(chatId, langCode === "fa" ? "کاربری با این شناسه یافت نشد." : "No user found with this ID.");
                }
            }
        }
        return new Response("OK", { status: 200 });
    } catch (e) {
        return new Response("OK", { status: 200 });
    }
}

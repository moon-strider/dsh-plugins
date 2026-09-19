window.__ModuleLoader__.load({
	id: "dsh-plugin-subagent-menu",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		let sharedAlerts;
		try {
			sharedAlerts = require("dsh-plugin-thread-bus")?.alerts;
		} catch (error) {
			sharedAlerts = undefined;
		}
		const SELF_ID = "dsh-plugin-subagent-menu";
		const TAB_KIND = "subagents";
		const NS = "subagentMenu";
		const css = ".dshmRoot{box-sizing:border-box;height:100%;min-height:0;color:var(--dsw-alias-label-primary);font-size:var(--dsh-content-font-size-secondary,13px);flex-direction:column;flex:auto;line-height:1.5;display:flex}.dshmHeader{box-sizing:border-box;border-bottom:.5px solid var(--dsw-alias-border-l3);flex:none;align-items:center;gap:4px;padding:8px 6px 8px 8px;display:flex}.dshmTool{width:26px;height:26px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:13px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.dshmTool:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshmChips{align-items:center;gap:6px;flex-wrap:wrap;flex:auto;min-width:0;padding-left:4px;display:flex}.dshmChip{box-sizing:border-box;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-module-platform);border-radius:8px;align-items:center;gap:4px;padding:1px 8px;font-size:11px;line-height:18px;display:inline-flex}.dshmChipAccent{color:var(--dsw-alias-state-business-primary)}.dshmFlag{box-sizing:border-box;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:var(--dsw-alias-bg-module-platform);border:0;border-radius:8px;flex:none;align-items:center;gap:4px;padding:1px 8px;font-size:11px;line-height:18px;display:inline-flex}.dshmFlag:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}.dshmFlag[data-on]{color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-tertiary)}.dshmFlagBox{width:12px;height:12px;border:.5px solid var(--dsw-alias-border-l4);border-radius:3px;flex:none;justify-content:center;align-items:center;display:inline-flex}.dshmFlag[data-on] .dshmFlagBox{border-color:var(--dsw-alias-state-business-primary)}.dshmAlert{box-sizing:border-box;color:var(--dsw-alias-state-error-primary);background:var(--dsw-alias-interactive-bg-hover-danger);border:.5px solid var(--dsw-alias-state-error-primary);flex-direction:column;gap:4px;margin:8px 10px 0;padding:8px 10px;border-radius:10px;display:flex}.dshmAlertHead{align-items:center;gap:6px;display:flex;font-weight:600;font-size:12px}.dshmAlertToggle{color:inherit;cursor:pointer;background:0 0;border:0;margin-left:auto;font:inherit;text-decoration:underline}.dshmAlertHint{font-size:11px;line-height:16px;opacity:.85}.dshmAlertList{flex-direction:column;gap:2px;margin:2px 0 0;padding-left:16px;font-size:11px;line-height:16px;display:flex}.dshmBody{scrollbar-gutter:stable;flex:auto;min-height:0;margin-right:2px;padding:8px 4px 8px 8px;overflow-y:auto}.dshmLevel{margin:0;padding:0;list-style:none}.dshmItem{margin:0;padding:0}.dshmRow{width:100%;min-width:0;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:10px;align-items:flex-start;gap:7px;padding:5px 10px;display:flex;position:relative}.dshmRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshmRow:focus-visible{outline:1.5px solid var(--dsw-alias-state-business-primary);outline-offset:-1.5px}.dshmRow[data-current]{background:var(--dsw-alias-interactive-bg-active)}.dshmRow[data-current]:after{content:\"\";border-radius:2px;background:var(--dsw-alias-state-business-primary);position:absolute;left:2px;top:7px;bottom:7px;width:2.5px}.dshmRow[data-current] .dshmLabel{font-weight:550}.dshmRow[data-diagnostic]{cursor:default;color:var(--dsw-alias-label-tertiary)}.dshmText{flex-direction:column;gap:1px;min-width:0;flex:auto;display:flex}.dshmLabelLine{align-items:center;gap:6px;min-width:0;display:flex}.dshmLabel{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.dshmModel{box-sizing:border-box;max-width:170px;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-module-platform);border-radius:6px;padding:0 6px;font-size:11px;line-height:16px;white-space:nowrap;text-overflow:ellipsis;flex:none;overflow:hidden}.dshmSecondary{color:var(--dsw-alias-label-caption);white-space:nowrap;text-overflow:ellipsis;overflow:hidden;font-size:12px}.dshmMetrics{color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none;font-size:12px;line-height:20px;display:flex;gap:8px}.dshmDot{flex:none;width:10px;height:20px;justify-content:center;align-items:center;display:inline-flex}.dshmEmpty{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;align-items:flex-start;padding:4px 12px 14px;display:flex}.dshmEmptyTitle{color:var(--dsw-alias-label-primary);font-weight:500}.dshmNote{color:var(--dsw-alias-label-secondary);margin:2px 10px;padding:8px 2px;font-size:12px}.dshmTitleIcon{color:var(--dsw-alias-label-tertiary);flex:none}.dshmTitleWarn{color:var(--dsw-alias-state-error-primary);flex:none}.dshmToasts{box-sizing:border-box;position:fixed;right:16px;bottom:16px;z-index:30;display:flex;flex-direction:column;gap:8px;max-width:min(420px,calc(100vw - 32px));pointer-events:auto}.dshmTitleCount{color:var(--dsw-alias-label-secondary);flex:none;font-size:11px;line-height:20px}.dshmDense .dshmSecondary{display:none}.dshmDense .dshmRow{padding:3px 10px}";
		const tagId = "dsh-plugin-subagent-menu/Subagents.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-plugin-subagent-menu";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		const styles = {
			root: "dshmRoot",
			header: "dshmHeader",
			tool: "dshmTool",
			chips: "dshmChips",
			chip: "dshmChip",
			chipAccent: "dshmChipAccent",
			flag: "dshmFlag",
			flagOn: "dshmFlagOn",
			flagBox: "dshmFlagBox",
			alert: "dshmAlert",
			alertHead: "dshmAlertHead",
			alertToggle: "dshmAlertToggle",
			alertHint: "dshmAlertHint",
			alertList: "dshmAlertList",
			toasts: "dshmToasts",
			titleWarn: "dshmTitleWarn",
			body: "dshmBody",
			level: "dshmLevel",
			item: "dshmItem",
			row: "dshmRow",
			text: "dshmText",
			labelLine: "dshmLabelLine",
			label: "dshmLabel",
			model: "dshmModel",
			secondary: "dshmSecondary",
			metrics: "dshmMetrics",
			dot: "dshmDot",
			empty: "dshmEmpty",
			emptyTitle: "dshmEmptyTitle",
			note: "dshmNote",
			titleIcon: "dshmTitleIcon",
			titleCount: "dshmTitleCount",
			dense: "dshmDense"
		};
		const DIAG_PREFIX = "[dsh-plugin-subagent-menu]";
		const diagnostics = new Map();
		const diagListeners = new Set();
		let diagSnapshot = [];
		let diagPublishQueued = false;
		const publishDiagnostics = () => {
			diagSnapshot = [...diagnostics.values()];
			if (diagPublishQueued) return;
			diagPublishQueued = true;
			const flush = () => {
				diagPublishQueued = false;
				for (const listener of [...diagListeners]) {
					try {
						listener();
					} catch (error) {}
				}
			};
			if (typeof queueMicrotask === "function") queueMicrotask(flush);
			else setTimeout(flush, 0);
		};
		const diagnose = (key, level, scope, message, detail) => {
			sharedAlerts?.push({
				code: `subagent-menu:${key}`,
				level,
				scope,
				message,
				expected: "",
				observed: "",
				hint: detail === undefined ? "" : String(detail),
				logs: ["browser console: filter " + DIAG_PREFIX, "host terminal of the running `dsh web`"]
			});
			const existing = diagnostics.get(key);
			if (existing !== undefined) {
				existing.count += 1;
				existing.at = Date.now();
				publishDiagnostics();
				return;
			}
			diagnostics.set(key, {
				key,
				level,
				scope,
				message,
				detail,
				count: 1,
				at: Date.now()
			});
			const line = `${DIAG_PREFIX} ${level.toUpperCase()} ${scope}: ${message}${detail === undefined ? "" : ` — ${detail}`}`;
			const hint = "this usually means dsh internals changed; update the plugin (dsh_plugins/subagent-menu) or its patch";
			if (typeof console !== "undefined") {
				if (level === "error") console.error(line, hint);
				else console.warn(line, hint);
			}
			publishDiagnostics();
		};
		const resolveDiagnostic = (key) => {
			sharedAlerts?.resolve(`subagent-menu:${key}`);
			if (diagnostics.delete(key)) publishDiagnostics();
		};
		const checkContract = (key, level, scope, value, message, detail) => {
			if (typeof value === "function") {
				resolveDiagnostic(key);
				return true;
			}
			diagnose(key, level, scope, message, detail);
			return false;
		};
		const FallbackToasts = ({ t }) => {
			const issues = useDiagnostics();
			if (issues.length === 0) return null;
			return (0, react_jsx_runtime.jsx)("div", {
				className: styles.toasts,
				"data-dshm-toasts": true,
				children: issues.slice(0, 4).map((issue) => (0, react_jsx_runtime.jsxs)("div", {
					className: styles.alert,
					role: issue.level === "error" ? "alert" : "status",
					children: [(0, react_jsx_runtime.jsxs)("div", {
						className: styles.alertHead,
						children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {}), t("diag.title", { count: issues.length })]
					}), (0, react_jsx_runtime.jsx)("div", { className: styles.alertHint, children: t("diag.hint") }), (0, react_jsx_runtime.jsxs)("ul", {
						className: styles.alertList,
						children: [issue.level === "error" ? "error" : "warn", " · ", issue.scope, " — ", issue.message, issue.count > 1 ? ` (\u00d7${String(issue.count)})` : "", issue.detail === undefined ? "" : ` [${issue.detail}]`]
					})]
				}, issue.key))
			});
		};
		function useDiagnostics() {
			const [, bump] = (0, react.useState)(0);
			(0, react.useEffect)(() => {
				const listener = () => bump((value) => value + 1);
				diagListeners.add(listener);
				return () => {
					diagListeners.delete(listener);
				};
			}, []);
			return diagSnapshot;
		}
		const zh = {
			"type.label": "子代理",
			"guide.title": "子代理",
			"guide.description": "查看此会话的子代理及其运行状态",
			"empty.title": "还没有子代理",
			"empty.active": "没有正在运行的子代理",
			"empty.body": "从此会话启动的子代理会实时出现在这里。",
			loading: "正在加载会话…",
			"noSession": "当前没有打开的会话。",
			"total.count": "{count} 个子代理",
			"running.count": "{count} 个运行中",
			"tokens.total": "Σ {value} tok",
			"tokens.thousand": "{value}K",
			"tokens.million": "{value}M",
			"mode.oneShot": "一次性",
			"mode.continuable": "可继续",
			"mainAgent": "主代理",
			"activity.running": "正在运行",
			"activity.inactive": "空闲",
			"duration.seconds": "{seconds}秒",
			"duration.minutes": "{minutes}分{seconds}秒",
			"duration.hours": "{hours}小时{minutes}分{seconds}秒",
			"diagnostic.corrupt": "会话记录损坏",
			"diagnostic.unsupported": "不支持的记录版本",
			"diagnostic.unavailable": "记录暂不可用",
			refresh: "刷新",
			"refresh.aria": "刷新会话列表",
			"flag.active": "仅活跃",
			"flag.activeAria": "只显示正在运行的子代理",
			"diag.title": "插件错误：{count}",
			"diag.hint": "内部接口 dsh 变了：看浏览器控制台的 [dsh-plugin-subagent-menu] 日志并更新插件",
			"diag.show": "详情",
			"diag.hide": "收起",
			"open.current": "当前打开的聊天",
			"open.parent": "打开父级聊天"
		};
		const en = {
			"type.label": "Subagents",
			"guide.title": "Subagents",
			"guide.description": "Watch this session's subagents and their activity",
			"empty.title": "No subagents yet",
			"empty.active": "No active subagents",
			"empty.body": "Subagents started from this chat appear here live.",
			loading: "Loading sessions…",
			"noSession": "No active session.",
			"total.count": "{count} subagents",
			"running.count": "{count} running",
			"tokens.total": "Σ {value} tok",
			"tokens.thousand": "{value}K",
			"tokens.million": "{value}M",
			"mode.oneShot": "one-shot",
			"mode.continuable": "continuable",
			"mainAgent": "Main agent",
			"activity.running": "running",
			"activity.inactive": "idle",
			"duration.seconds": "{seconds}s",
			"duration.minutes": "{minutes}m {seconds}s",
			"duration.hours": "{hours}h {minutes}m {seconds}s",
			"diagnostic.corrupt": "corrupted session record",
			"diagnostic.unsupported": "unsupported record version",
			"diagnostic.unavailable": "record temporarily unavailable",
			refresh: "Refresh",
			"refresh.aria": "Refresh the session list",
			"flag.active": "Active",
			"flag.activeAria": "Show only running subagents",
			"diag.title": "Plugin error: {count}",
			"diag.hint": "dsh internals changed: open the browser console, read the [dsh-plugin-subagent-menu] lines and update the plugin",
			"diag.show": "details",
			"diag.hide": "hide",
			"open.current": "Open chat",
			"open.parent": "Open parent chat"
		};
		const ru = {
			"type.label": "Субагенты",
			"guide.title": "Субагенты",
			"guide.description": "Смотреть субагентов этого чата и их активность",
			"empty.title": "Субагентов пока нет",
			"empty.active": "Нет активных субагентов",
			"empty.body": "Субагенты, запущенные из этого чата, появятся здесь в реальном времени.",
			loading: "Загрузка сессий…",
			"noSession": "Нет открытого чата.",
			"total.count": "Субагентов: {count}",
			"running.count": "Запущено: {count}",
			"tokens.total": "Σ {value} tok",
			"tokens.thousand": "{value}K",
			"tokens.million": "{value}M",
			"mode.oneShot": "разовый",
			"mode.continuable": "продолжаемый",
			"mainAgent": "Главный агент",
			"activity.running": "работает",
			"activity.inactive": "простаивает",
			"duration.seconds": "{seconds}с",
			"duration.minutes": "{minutes}м {seconds}с",
			"duration.hours": "{hours}ч {minutes}м {seconds}с",
			"diagnostic.corrupt": "запись сессии повреждена",
			"diagnostic.unsupported": "неподдерживаемая версия записи",
			"diagnostic.unavailable": "запись временно недоступна",
			refresh: "Обновить",
			"refresh.aria": "Обновить список сессий",
			"flag.active": "Активные",
			"flag.activeAria": "Показывать только работающих субагентов",
			"diag.title": "Ошибка плагина: {count}",
			"diag.hint": "внутренности dsh изменились: открой консоль браузера, посмотри строки [dsh-plugin-subagent-menu] и обнови плагин",
			"diag.show": "детали",
			"diag.hide": "скрыть",
			"open.current": "Открытый чат",
			"open.parent": "Открыть родительский чат"
		};
		function tokenTotal(usage) {
			return usage === undefined ? undefined : usage.uncachedInputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens;
		}
		function formatTokens(value, t) {
			const scaled = (next) => next >= 100 ? String(Math.round(next)) : String(Math.round(next * 10) / 10);
			if (value < 1000) return String(value);
			if (value < 1e6) return t("tokens.thousand", { value: scaled(value / 1e3) });
			return t("tokens.million", { value: scaled(value / 1e6) });
		}
		function splitDuration(ms) {
			const totalSeconds = Math.floor(Math.max(0, ms) / 1e3);
			const totalMinutes = Math.floor(totalSeconds / 60);
			const totalHours = Math.floor(totalMinutes / 60);
			return {
				seconds: totalSeconds % 60,
				minutes: totalMinutes % 60,
				totalMinutes,
				totalHours
			};
		}
		function formatDuration(ms, t) {
			const { seconds, minutes, totalMinutes, totalHours } = splitDuration(ms);
			if (totalHours > 0) return t("duration.hours", { hours: totalHours, minutes: String(minutes).padStart(2, "0"), seconds: String(seconds).padStart(2, "0") });
			if (totalMinutes > 0) return t("duration.minutes", { minutes: totalMinutes, seconds: String(seconds).padStart(2, "0") });
			return t("duration.seconds", { seconds });
		}
		function rowDuration(summary, now) {
			const timing = summary?.projectionValues?.subagentTiming;
			if (timing === undefined) return undefined;
			if (timing.active === undefined) return timing.settledMs;
			return timing.settledMs + Math.max(0, (summary.running === true ? now : timing.active.through) - timing.active.since);
		}
		function rowModel(summary) {
			const selection = summary?.projectionValues?.modelSelection;
			return selection?.next?.model ?? selection?.lastUsed?.model ?? undefined;
		}
		function findRootId(byId, startId) {
			if (startId === undefined) return undefined;
			const seen = new Set([startId]);
			let current = startId;
			while (true) {
				const parent = byId[current]?.parentId;
				if (parent === undefined || seen.has(parent)) return current;
				seen.add(parent);
				current = parent;
			}
		}
		function BranchGlyph(props) {
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconBranchOutline16, props);
		}
		function definition(t) {
			return {
				id: SELF_ID,
				kind: TAB_KIND,
				title: () => t("type.label"),
				guide: [{
					order: 20,
					title: () => t("guide.title"),
					description: () => t("guide.description"),
					icon: BranchGlyph
				}]
			};
		}
		function reachesRoot(byId, rootId, parentId) {
			const seen = new Set([parentId]);
			let current = parentId;
			while (current !== rootId) {
				const parent = byId[current]?.parentId;
				if (parent === undefined || seen.has(parent)) return false;
				seen.add(parent);
				current = parent;
			}
			return true;
		}
		function buildTree(state, rootId, now) {
			const byId = state.byId;
			const root = rootId === undefined ? undefined : byId[rootId];
			if (root === undefined) return { root: undefined, rowsByParent: new Map(), counts: { total: 0, running: 0, tokens: 0 } };
			const byParent = new Map();
			for (const summary of Object.values(byId)) {
				if (summary.origin !== "subagent" || summary.parentId === undefined) continue;
				if (!reachesRoot(byId, rootId, summary.parentId)) continue;
				let list = byParent.get(summary.parentId);
				if (list === undefined) {
					list = [];
					byParent.set(summary.parentId, list);
				}
				list.push({
					kind: "child",
					id: summary.id,
					parentId: summary.parentId,
					label: summary.title ?? summary.displayTitle ?? summary.id,
					title: summary.title,
					running: summary.running === true,
					mode: summary.projectionValues?.subagent?.mode,
					model: rowModel(summary),
					tokens: tokenTotal(summary.projectionValues?.tokenUsage),
					durationMs: rowDuration(summary, now),
					updatedAt: summary.updatedAt
				});
			}
			const queue = [...byParent.keys()];
			while (queue.length > 0) {
				const parent = queue.shift();
				const catalog = state.subagentsByParent[parent];
				if (catalog === undefined) continue;
				for (const entry of catalog.entries) {
					if (entry.kind === "diagnostic") {
						let list = byParent.get(parent);
						if (list === undefined) {
							list = [];
							byParent.set(parent, list);
						}
						if (!list.some((row) => row.id === entry.id)) list.push({
							kind: "diagnostic",
							id: entry.id,
							parentId: parent,
							label: entry.id,
							reason: entry.reason
						});
						continue;
					}
					let list = byParent.get(parent);
					if (list === undefined) {
						list = [];
						byParent.set(parent, list);
					}
					const existing = list.find((row) => row.id === entry.id);
					if (existing === undefined) {
						list.push({
							kind: "child",
							id: entry.id,
							parentId: parent,
							label: entry.label ?? entry.id,
							mode: entry.mode,
							running: entry.activity === "running",
							hasChildren: entry.hasChildren === true,
							createdAt: entry.createdAt
						});
						queue.push(entry.id);
					} else {
						existing.mode = existing.mode ?? entry.mode;
						existing.label = entry.label ?? existing.label;
						existing.running = entry.activity === "running" || existing.running;
						if (entry.hasChildren) existing.hasChildren = true;
						if (!queue.includes(entry.id)) queue.push(entry.id);
					}
				}
			}
			const byName = new Intl.Collator(undefined, {
				numeric: true,
				sensitivity: "base"
			});
			const rowsByParent = new Map();
			for (const [parent, list] of byParent) {
				list.sort((left, right) => {
					if (left.kind !== right.kind) return left.kind === "child" ? -1 : 1;
					if (left.running !== right.running) return left.running ? -1 : 1;
					const leftTime = left.createdAt ?? left.updatedAt ?? 0;
					const rightTime = right.createdAt ?? right.updatedAt ?? 0;
					if (leftTime !== rightTime) return leftTime - rightTime;
					return byName.compare(left.label, right.label);
				});
				rowsByParent.set(parent, list);
			}
			const counts = {
				total: 0,
				running: 0,
				tokens: 0
			};
			for (const list of rowsByParent.values()) for (const row of list) {
				if (row.kind !== "child") continue;
				counts.total += 1;
				if (row.running) counts.running += 1;
				if (row.tokens !== undefined) counts.tokens += row.tokens;
				if (row.hasChildren === undefined) row.hasChildren = (rowsByParent.get(row.id)?.length ?? 0) > 0;
			}
			return { root, rowsByParent, counts };
		}
		function flattenRows(tree, rootId) {
			const rows = [];
			const walk = (parent, depth) => {
				for (const row of tree.rowsByParent.get(parent) ?? []) {
					rows.push({ ...row, depth });
					walk(row.id, depth + 1);
				}
			};
			walk(rootId, 0);
			return rows;
		}
		function secondaryLine(row, t) {
			const parts = [];
			if (row.title !== undefined && row.title !== row.label) parts.push(row.title);
			if (row.mode !== undefined) parts.push(row.mode === "one-shot" ? t("mode.oneShot") : t("mode.continuable"));
			parts.push(row.running ? t("activity.running") : t("activity.inactive"));
			return parts.join(" · ");
		}
		function SubagentRow({ row, depth, current, dense, openRow, t }) {
			const isDiagnostic = row.kind === "diagnostic";
			const reason = isDiagnostic ? t(`diagnostic.${row.reason}`) : undefined;
			const secondary = isDiagnostic ? reason : secondaryLine(row, t);
			const tokenMetric = row.tokens === undefined ? undefined : t("tokens.total", { value: formatTokens(row.tokens, t) });
			const durationMetric = row.durationMs === undefined ? undefined : formatDuration(row.durationMs, t);
			const metrics = [tokenMetric, durationMetric].filter((value) => value !== undefined);
			return (0, react_jsx_runtime.jsx)("li", {
				className: styles.item,
				"data-dshm-row": row.id,
				children: (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: styles.row,
					style: { paddingLeft: 10 + depth * 14 },
					"data-current": current || undefined,
					"data-diagnostic": isDiagnostic || undefined,
					"aria-current": current ? "true" : undefined,
					"aria-disabled": isDiagnostic || undefined,
					title: reason,
					onClick: () => {
						if (!isDiagnostic) openRow(row);
					},
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: styles.dot,
							children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: isDiagnostic ? "error" : row.running ? "ongoing" : "done" })
						}),
						(0, react_jsx_runtime.jsx)("span", {
							className: styles.text,
							children: (0, react_jsx_runtime.jsx)("span", {
								className: styles.labelLine,
								children: [
									(0, react_jsx_runtime.jsx)("span", { className: styles.label, children: row.label }),
									dense ? null : (0, react_jsx_runtime.jsx)("span", { className: styles.secondary, children: secondary })
								]
							})
						}),
						row.model !== undefined && (0, react_jsx_runtime.jsx)("span", {
							className: styles.model,
							title: row.model,
							children: row.model
						}),
						metrics.length > 0 && (0, react_jsx_runtime.jsx)("span", {
							className: styles.metrics,
							children: metrics.map((value, index) => (0, react_jsx_runtime.jsx)("span", { children: value }, index))
						})
					]
				})
			}, row.id);
		}
		function MainAgentRow({ root, current, openRoot, t }) {
			const model = rowModel(root);
			const tokens = tokenTotal(root.projectionValues?.tokenUsage);
			return (0, react_jsx_runtime.jsx)("li", {
				className: styles.item,
				"data-dshm-row": root.id,
				children: (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: styles.row,
					style: { paddingLeft: 10 },
					"data-current": current || undefined,
					"aria-current": current ? "true" : undefined,
					title: t("open.parent"),
					onClick: () => {
						openRoot(root.id);
					},
					children: [
						(0, react_jsx_runtime.jsx)("span", {
							className: styles.dot,
							children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: root.running === true ? "ongoing" : "done" })
						}),
						(0, react_jsx_runtime.jsxs)("span", {
							className: styles.text,
							children: (0, react_jsx_runtime.jsx)("span", {
								className: styles.labelLine,
								children: (0, react_jsx_runtime.jsx)("span", {
									className: styles.label,
									style: { fontWeight: 550 },
									children: t("mainAgent")
								})
							})
						}),
						model !== undefined && (0, react_jsx_runtime.jsx)("span", {
							className: styles.model,
							title: model,
							children: model
						}),
						tokens !== undefined && (0, react_jsx_runtime.jsx)("span", {
							className: styles.metrics,
							children: (0, react_jsx_runtime.jsx)("span", { children: t("tokens.total", { value: formatTokens(tokens, t) }) })
						})
					]
				})
			}, root.id);
		}
		function SubagentsBody({ sessionId, useSessions, openRow, openRoot, refreshAll, watchTree, unwatchTree, setFlag, t }) {
			const [now, setNow] = (0, react.useState)(() => Date.now());
			const [activeOnly, setActiveOnly] = (0, react.useState)(false);
			const [showIssues, setShowIssues] = (0, react.useState)(false);
			const issues = useDiagnostics();
			const rawState = useSessions((value) => value);
			const state = rawState ?? {};
			const current = state.current;
			const byId = state.byId ?? {};
			const rootId = (0, react.useMemo)(() => findRootId(byId, current ?? sessionId), [byId, current, sessionId]);
			const tree = (0, react.useMemo)(() => {
				try {
					return buildTree(state, rootId, now);
				} catch (error) {
					diagnose("tree-build", "error", "tree", "building the subagent tree failed", String(error));
					return { root: undefined, rowsByParent: new Map(), counts: { total: 0, running: 0, tokens: 0 } };
				}
			}, [state, rootId, now]);
			const snapshotBroken = rawState === undefined || rawState.byId === undefined || rawState.subagentsByParent === undefined;
			if (snapshotBroken) diagnose("snapshot-shape", "error", "sessions", "the sessions snapshot lost its shape", "expected byId/subagentsByParent/current from dsh-api-session-controller");
			(0, react.useEffect)(() => {
				watchTree();
				return () => {
					unwatchTree();
				};
			}, [watchTree, unwatchTree]);
			(0, react.useEffect)(() => {
				setFlag(activeOnly);
			}, [activeOnly, setFlag]);
			(0, react.useEffect)(() => {
				if (tree.counts.running === 0) return undefined;
				const timer = setInterval(() => {
					setNow(Date.now());
				}, 1e3);
				return () => {
					clearInterval(timer);
				};
			}, [tree.counts.running]);
			const alertNode = null;
			if (state.phase === "pending") return (0, react_jsx_runtime.jsx)("div", {
				className: styles.root,
				"data-dshm-state": "loading",
				children: [alertNode, (0, react_jsx_runtime.jsx)("p", { className: styles.note, children: t("loading") })]
			});
			if (tree.root === undefined) return (0, react_jsx_runtime.jsx)("div", {
				className: styles.root,
				"data-dshm-state": "no-session",
				children: [alertNode, (0, react_jsx_runtime.jsx)("p", { className: styles.note, children: t("noSession") })]
			});
			const rows = flattenRows(tree, rootId);
			const visibleRows = activeOnly ? rows.filter((row) => row.running === true) : rows;
			const dense = visibleRows.length > 6;
			return (0, react_jsx_runtime.jsxs)("div", {
				className: `${styles.root} ${dense ? styles.dense : ""}`,
				"data-dshm-state": visibleRows.length === 0 ? "empty" : "tree",
				children: [
					alertNode,
					(0, react_jsx_runtime.jsxs)("div", {
						className: styles.header,
						children: [
							(0, react_jsx_runtime.jsxs)("div", {
								className: styles.chips,
								children: [
									(0, react_jsx_runtime.jsx)("span", { className: styles.chip, children: t("total.count", { count: tree.counts.total }) }),
									tree.counts.running > 0 && (0, react_jsx_runtime.jsxs)("span", {
										className: `${styles.chip} ${styles.chipAccent}`,
										children: [
											(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: "ongoing" }),
											t("running.count", { count: tree.counts.running })
										]
									}),
									tree.counts.tokens > 0 && (0, react_jsx_runtime.jsx)("span", {
										className: styles.chip,
										children: t("tokens.total", { value: formatTokens(tree.counts.tokens, t) })
									})
								]
							}),
							(0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: styles.flag,
								"data-on": activeOnly || undefined,
								"aria-pressed": activeOnly,
								"aria-label": t("flag.activeAria"),
								title: t("flag.activeAria"),
								onClick: () => {
									setActiveOnly(!activeOnly);
								},
								children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: styles.flagBox,
										children: activeOnly && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconCheckOutline14, {})
									}),
									t("flag.active")
								]
							}),
							(0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: styles.tool,
								"aria-label": t("refresh.aria"),
								title: t("refresh.aria"),
								onClick: () => {
									refreshAll();
								},
								children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, {})
							})
						]
					}),
					(0, react_jsx_runtime.jsx)("div", {
						className: styles.body,
						children: (0, react_jsx_runtime.jsxs)("ul", {
							className: styles.level,
							children: [
								(0, react_jsx_runtime.jsx)(MainAgentRow, { root: tree.root, current: current === rootId, openRoot, t }),
								visibleRows.map((row) => (0, react_jsx_runtime.jsx)(SubagentRow, {
									row: { ...row, depth: row.depth + 1 },
									depth: row.depth + 1,
									current: row.id === current,
									dense,
									openRow,
									t
								}, row.id))
							]
						})
					}),
					visibleRows.length === 0 && (0, react_jsx_runtime.jsxs)("div", {
						className: styles.empty,
						children: [
							(0, react_jsx_runtime.jsx)("span", { className: styles.emptyTitle, children: activeOnly ? t("empty.active") : t("empty.title") }),
							!activeOnly && (0, react_jsx_runtime.jsx)("span", { children: t("empty.body") })
						]
					})
				]
			});
		}
		function SubagentsTitle({ useTabInfo, useSessions, t }) {
			const { tab } = useTabInfo();
			const issues = useDiagnostics();
			const running = useSessions(countLineageRunning);
			return (0, react_jsx_runtime.jsxs)(react.Fragment, { children: [
				(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconBranchOutline16, { className: styles.titleIcon }),
				tab.title,
				running > 0 && (0, react_jsx_runtime.jsx)("span", { className: styles.titleCount, children: running }),
				issues.length > 0 && (0, react_jsx_runtime.jsx)("span", {
					className: styles.titleWarn,
					title: t("diag.hint"),
					children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconWarningOutline16, {})
				})
			] });
		}
		function countLineageRunning(state) {
			const rootId = findRootId(state.byId, state.current);
			if (rootId === undefined) return 0;
			let running = 0;
			for (const summary of Object.values(state.byId)) if (summary.origin === "subagent" && summary.running === true && reachesRoot(state.byId, rootId, summary.id)) running += 1;
			return running;
		}
		function FollowSeat({ seedFollow }) {
			(0, react.useLayoutEffect)(() => {
				seedFollow();
			});
			return null;
		}
		const PREFETCH_LIMIT = 12;
		const PREFETCH_GAP_MS = 120;
		const treeWatches = new Set();
		const openIn = new Set();
		const inject = ["sessions", "slots", "locale", "sidebarRightTabs", "sidebarRight"];
		function apply(ctx) {
			if (sharedAlerts === undefined && typeof ctx.slots?.register === "function" && typeof ctx.slots?.inject === "function") {
				const registerFallback = () => ctx.slots.register({ name: "shell.overlay", id: "subagent-menu-alerts", order: 110, locale: NS }, FallbackToasts);
				try {
					ctx.slots.inject("shell.overlay", registerFallback);
				} catch (error) {
					ctx.slots.register({ name: "shell.overlay", id: "subagent-menu-alerts", order: 110, locale: NS }, FallbackToasts);
				}
			}
			const sessions = ctx.sessions;
			const sidebarRight = ctx.sidebarRight;
			const t = ctx.locale.bind(NS);
			const health = {
				tabType: false,
				tabBody: false,
				carry: false
			};
			checkContract("slots", "error", "slots", ctx.slots?.inject, "the slot service is missing", "expected ctx.slots.inject/register from dsh-client-ui-renderer");
			checkContract("locale", "error", "locale", ctx.locale?.register, "the locale service is missing", "expected ctx.locale.register/bind from dsh-client-locale");
			checkContract("tabs", "error", "sidebarRightTabs", ctx.sidebarRightTabs?.register, "the right sidebar tab registry is missing", "expected ctx.sidebarRightTabs.register from dsh-client-ui-sidebar-right");
			checkContract("sessions", "error", "sessions", sessions?.list?.getSnapshot, "the sessions list store is missing", "expected ctx.sessions.list from dsh-api-session-controller");
			checkContract("carry", "warn", "carry", sidebarRight?.openTabIn, "cross-session tab opening is unavailable", "the sidebar will no longer follow navigation or keep its tree state");
			checkContract("prefetch", "warn", "prefetch", sessions?.binding, "subagent prefetch is unavailable", "chats open with the usual first-open delay");
			checkContract("navigate", "error", "navigate", sessions?.openSubagent, "clicking a subagent cannot navigate", "expected ctx.sessions.openSubagent from dsh-api-session-controller");
			const snapshotOf = () => {
				let state;
				try {
					state = sessions?.list?.getSnapshot?.();
				} catch (error) {
					state = undefined;
				}
				if (state === undefined || state.byId === undefined || state.subagentsByParent === undefined) {
					diagnose("snapshot-shape", "error", "sessions", "the sessions snapshot lost its shape", "expected byId/subagentsByParent/current from dsh-api-session-controller");
					return undefined;
				}
				resolveDiagnostic("snapshot-shape");
				return state;
			};
			let followTarget;
			let followTimer;
			let followLeft = 0;
			ctx.effect(() => () => {
				if (followTimer !== undefined) clearTimeout(followTimer);
			}, "subagent-menu: lifecycle");
			ctx.effect(() => ctx.locale.register(NS, { en, zh, ru }), "subagent-menu: dictionaries");
			ctx.effect(() => {
				const dispose = ctx.sidebarRightTabs.register(definition(t));
				health.tabType = true;
				resolveDiagnostic("tab-type");
				return dispose;
			}, "subagent-menu: tab type");
			const rootOf = (id) => {
				if (id === undefined) return undefined;
				const state = snapshotOf();
				return state === undefined ? undefined : findRootId(state.byId, id);
			};
			const placeInto = (id) => {
				if (!checkContract("carry", "warn", "carry", sidebarRight?.openTabIn, "cross-session tab opening is unavailable", "the sidebar will no longer follow navigation or keep its tree state")) return;
				try {
					sidebarRight.openTabIn(id, TAB_KIND);
				} catch (error) {}
			};
			const placeFollow = (id) => {
				if (followTarget !== id) return;
				placeInto(id);
			};
			const followAttempt = () => {
				followTimer = undefined;
				if (followTarget === undefined) return;
				const target = followTarget;
				const state = snapshotOf();
				if (state === undefined || state.current !== target || openIn.has(target)) {
					followTarget = undefined;
					return;
				}
				followLeft -= 1;
				if (followLeft <= 0) {
					followTarget = undefined;
					return;
				}
				placeInto(target);
				followTimer = setTimeout(followAttempt, 150);
			};
			const carry = (id) => {
				if (id === undefined) return;
				const root = rootOf(id);
				if (root === undefined || !treeWatches.has(root)) return;
				followTarget = id;
				followLeft = 8;
				if (followTimer !== undefined) clearTimeout(followTimer);
				placeInto(id);
				if (!openIn.has(id)) followTimer = setTimeout(followAttempt, 120);
			};
			const prefetchApi = {};
			const resolveAddress = (state, row) => {
				const catalog = state.subagentsByParent[row.parentId];
				if (catalog !== undefined && !Array.isArray(catalog.entries)) {
					diagnose("catalog-shape", "error", "sessions", "the subagent catalog lost its shape", "expected { entries } per parent from dsh-api-session-controller");
					return undefined;
				}
				const entry = catalog?.entries.find((candidate) => candidate.kind === "child" && candidate.id === row.id);
				return entry === undefined ? undefined : {
					parentSessionId: row.parentId,
					childSessionId: row.id,
					mode: entry.mode
				};
			};
			const face = (sessionId) => ({
				openRow(row) {
					const attempt = () => {
						const state = snapshotOf();
						if (state === undefined) return true;
						const address = resolveAddress(state, row);
						if (address === undefined) return false;
						carry(row.id);
						if (!checkContract("navigate", "error", "navigate", sessions?.openSubagent, "clicking a subagent cannot navigate", "expected ctx.sessions.openSubagent from dsh-api-session-controller")) return true;
						sessions.openSubagent(address);
						return true;
					};
					if (attempt()) return;
					sessions.refreshSubagents(row.parentId).then(() => {
						attempt();
					}, () => {});
				},
				openRoot(id) {
					carry(id);
					if (!checkContract("navigate-root", "error", "navigate", sessions?.open, "opening the parent chat is unavailable", "expected ctx.sessions.open from dsh-api-session-controller")) return;
					sessions.open(id);
				},
				refreshAll() {
					sessions.refresh().catch(() => {});
				},
				watchTree() {
					openIn.add(sessionId);
					const root = rootOf(sessionId);
					if (root !== undefined) treeWatches.add(root);
				},
				unwatchTree() {
					openIn.delete(sessionId);
					if (typeof prefetchApi.releaseIdle === "function") prefetchApi.releaseIdle(sessionId);
					const snapshot = snapshotOf();
					if (snapshot !== undefined && snapshot.current === sessionId) {
						const root = rootOf(sessionId);
						if (root !== undefined) treeWatches.delete(root);
					}
				},
				setFlag(activeOnly) {
					if (typeof prefetchApi.setFlag === "function") prefetchApi.setFlag(sessionId, activeOnly);
				},
				seedFollow() {
					placeFollow(sessionId);
				}
			});
			ctx.effect(() => ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: `${SELF_ID}/carry-header`,
				order: 50,
				inject: face
			}, FollowSeat)), "subagent-menu: carry seat (header)");
			ctx.effect(() => ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
				name: "conversation.input.dock",
				id: `${SELF_ID}/carry-dock`,
				order: 50,
				inject: face
			}, FollowSeat)), "subagent-menu: carry seat (input dock)");
			health.carry = true;
			ctx.effect(() => {
				const timer = setTimeout(() => {
					if (!health.tabType) diagnose("tab-type", "error", "sidebarRightTabs", "the tab type never registered", "the right sidebar will not offer the Subagents tab");
					if (!health.tabBody) diagnose("tab-body", "error", "slots", "the tab body slot never declared", "expected the sidebar.right.pane.tab declaration from dsh-client-ui-sidebar-right");
					if (!health.carry) diagnose("carry-seat", "warn", "slots", "the carry seats never registered", "the tree state will not follow navigation; expected conversation.session.header.utilities and conversation.input.dock");
				}, 5000);
				return () => {
					clearTimeout(timer);
				};
			}, "subagent-menu: health check");
			ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
				name: "sidebar.right.pane.tab",
				key: SELF_ID,
				locale: NS,
				inject: face
			}, SubagentsBody)), "subagent-menu: tab body");
			health.tabBody = true;
			ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
				name: "sidebar.right.pane.tab.title",
				key: SELF_ID,
				locale: NS
			}, SubagentsTitle)), "subagent-menu: tab title");
			let lastCurrent = snapshotOf()?.current;
			let prefetchTimer;
			let prefetchQueue = [];
			const prefetched = new Set();
			const prefetchedCount = new Map();
			const warmedIdle = new Map();
			const flagOff = new Set();
			const prefetchOne = (id) => {
				if (prefetched.has(id)) return;
				prefetched.add(id);
				let binding;
				try {
					binding = sessions.binding(id);
				} catch (error) {
					binding = undefined;
				}
				const target = binding?.session;
				if (target === undefined) {
					diagnose("prefetch-bind", "warn", "prefetch", "a subagent session could not be resolved for prefetch", `sessions.binding(${id}) returned nothing`);
					return;
				}
				if (!checkContract("prefetch-open", "warn", "prefetch", target.open, "the session window opener is missing", "prefetch is disabled; chats open with the usual first-open delay")) return;
				try {
					target.open();
				} catch (error) {
					diagnose("prefetch-open-error", "warn", "prefetch", "warming a subagent session failed", String(error));
				}
			};
			const pumpPrefetch = () => {
				prefetchTimer = undefined;
				if (prefetchQueue.length === 0) return;
				prefetchOne(prefetchQueue.shift());
				if (prefetchQueue.length > 0) prefetchTimer = setTimeout(pumpPrefetch, PREFETCH_GAP_MS);
			};
			const planPrefetch = (rootId, includeIdle) => {
				const state = snapshotOf();
				if (state === undefined) return;
				if (rootId === undefined || state.byId[rootId] === undefined) return;
				const used = prefetchedCount.get(rootId) ?? 0;
				if (used >= PREFETCH_LIMIT) return;
				const running = [];
				const idle = [];
				for (const summary of Object.values(state.byId)) {
					if (summary.origin !== "subagent" || summary.parentId === undefined) continue;
					if (!reachesRoot(state.byId, rootId, summary.parentId)) continue;
					if (prefetched.has(summary.id)) continue;
					if (summary.running === true) running.push(summary.id);
					else if (includeIdle) idle.push(summary.id);
				}
				const take = [...running, ...idle].slice(0, PREFETCH_LIMIT - used);
				if (take.length === 0) return;
				prefetchedCount.set(rootId, used + take.length);
				for (const id of take) {
					if (!prefetchQueue.includes(id)) prefetchQueue.push(id);
					if (running.includes(id)) continue;
					let set = warmedIdle.get(rootId);
					if (set === undefined) {
						set = new Set();
						warmedIdle.set(rootId, set);
					}
					set.add(id);
				}
				if (prefetchTimer === undefined) prefetchTimer = setTimeout(pumpPrefetch, 0);
			};
			const releaseWarm = (id) => {
				const snapshot = snapshotOf();
				if (snapshot === undefined || snapshot.current === id) return false;
				let binding;
				try {
					binding = sessions.binding(id);
				} catch (error) {
					return false;
				}
				const target = binding?.session;
				if (target === undefined) return false;
				if (target.openState === undefined || target.openGeneration === undefined) {
					diagnose("release-shape", "warn", "prefetch", "a warmed session cannot be released", "expected events/openState/openGeneration on the client session; idle streams will linger");
					return false;
				}
				const events = target.events;
				target.openState = "cold";
				target.openGeneration = (target.openGeneration ?? 0) + 1;
				target.events = undefined;
				if (events !== undefined && typeof events.dispose === "function") {
					try {
						const pending = events.dispose();
						if (pending !== undefined && typeof pending.catch === "function") pending.catch(() => {});
					} catch (error) {}
				}
				return true;
			};
			const dropIdle = (rootId) => {
				const set = warmedIdle.get(rootId);
				if (set === undefined) return;
				const state = snapshotOf();
				if (state === undefined) return;
				for (const id of [...set]) {
					set.delete(id);
					const summary = state.byId[id];
					if (summary !== undefined && summary.running === true) continue;
					if (!releaseWarm(id)) continue;
					prefetched.delete(id);
					prefetchedCount.set(rootId, Math.max(0, (prefetchedCount.get(rootId) ?? 1) - 1));
				}
				if (set.size === 0) warmedIdle.delete(rootId);
			};
			const treeHasFlagOff = (rootId) => {
				for (const id of flagOff) if (rootOf(id) === rootId) return true;
				return false;
			};
			const idleWarmAllowed = (sessionId) => flagOff.has(sessionId);
			ctx.effect(() => {
				const unsubscribe = sessions.list.subscribe(() => {
					const state = snapshotOf();
					if (state === undefined) return;
					const current = state.current;
					if (current !== undefined && state.byId[current] !== undefined && state.byId[current].origin !== "subagent") {
						planPrefetch(current, idleWarmAllowed(current));
					}
					if (current === lastCurrent) return;
					lastCurrent = current;
					if (current === undefined) return;
					carry(current);
				});
				return () => {
					if (followTimer !== undefined) clearTimeout(followTimer);
					if (prefetchTimer !== undefined) clearTimeout(prefetchTimer);
					unsubscribe();
				};
			}, "subagent-menu: tree carry and prefetch");
			const bootState = snapshotOf();
			if (bootState !== undefined && bootState.current !== undefined && bootState.byId[bootState.current]?.origin !== "subagent") {
				const bootRoot = bootState.current;
				prefetchTimer = setTimeout(() => {
					prefetchTimer = undefined;
					planPrefetch(bootRoot, false);
				}, 1e3);
			}
			prefetchApi.setFlag = (sessionId, activeOnly) => {
				if (activeOnly) {
					flagOff.delete(sessionId);
					const root = rootOf(sessionId);
					if (root !== undefined && !treeHasFlagOff(root)) dropIdle(root);
					return;
				}
				flagOff.add(sessionId);
				const root = rootOf(sessionId);
				if (root !== undefined) planPrefetch(root, true);
			};
			prefetchApi.releaseIdle = (sessionId) => {
				flagOff.delete(sessionId);
				const root = rootOf(sessionId);
				if (root === undefined || treeHasFlagOff(root)) return;
				dropIdle(root);
			};
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
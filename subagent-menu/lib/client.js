window.__ModuleLoader__.load({
	id: "dsh-plugin-subagent-menu",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		const SELF_ID = "dsh-plugin-subagent-menu";
		const TAB_KIND = "subagents";
		const NS = "subagentMenu";
		const css = ".dshmRoot{box-sizing:border-box;height:100%;min-height:0;color:var(--dsw-alias-label-primary);font-size:var(--dsh-content-font-size-secondary,13px);flex-direction:column;flex:auto;line-height:1.5;display:flex}.dshmHeader{box-sizing:border-box;border-bottom:.5px solid var(--dsw-alias-border-l3);flex:none;align-items:center;gap:4px;padding:8px 6px 8px 8px;display:flex}.dshmTool{width:26px;height:26px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:13px;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}.dshmTool:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dshmChips{align-items:center;gap:6px;flex-wrap:wrap;flex:auto;min-width:0;padding-left:4px;display:flex}.dshmChip{box-sizing:border-box;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-module-platform);border-radius:8px;align-items:center;gap:4px;padding:1px 8px;font-size:11px;line-height:18px;display:inline-flex}.dshmChipAccent{color:var(--dsw-alias-state-business-primary)}.dshmFlag{box-sizing:border-box;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:var(--dsw-alias-bg-module-platform);border:0;border-radius:8px;flex:none;align-items:center;gap:4px;padding:1px 8px;font-size:11px;line-height:18px;display:inline-flex}.dshmFlag:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary)}.dshmFlag[data-on]{color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-state-business-tertiary)}.dshmFlagBox{width:12px;height:12px;border:.5px solid var(--dsw-alias-border-l4);border-radius:3px;flex:none;justify-content:center;align-items:center;display:inline-flex}.dshmFlag[data-on] .dshmFlagBox{border-color:var(--dsw-alias-state-business-primary)}.dshmBody{scrollbar-gutter:stable;flex:auto;min-height:0;margin-right:2px;padding:8px 4px 8px 8px;overflow-y:auto}.dshmLevel{margin:0;padding:0;list-style:none}.dshmItem{margin:0;padding:0}.dshmRow{width:100%;min-width:0;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:10px;align-items:flex-start;gap:7px;padding:5px 10px;display:flex;position:relative}.dshmRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.dshmRow:focus-visible{outline:1.5px solid var(--dsw-alias-state-business-primary);outline-offset:-1.5px}.dshmRow[data-current]{background:var(--dsw-alias-interactive-bg-active)}.dshmRow[data-current]:after{content:\"\";border-radius:2px;background:var(--dsw-alias-state-business-primary);position:absolute;left:2px;top:7px;bottom:7px;width:2.5px}.dshmRow[data-current] .dshmLabel{font-weight:550}.dshmRow[data-diagnostic]{cursor:default;color:var(--dsw-alias-label-tertiary)}.dshmText{flex-direction:column;gap:1px;min-width:0;flex:auto;display:flex}.dshmLabelLine{align-items:center;gap:6px;min-width:0;display:flex}.dshmLabel{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.dshmModel{box-sizing:border-box;max-width:170px;color:var(--dsw-alias-label-tertiary);background:var(--dsw-alias-bg-module-platform);border-radius:6px;padding:0 6px;font-size:11px;line-height:16px;white-space:nowrap;text-overflow:ellipsis;flex:none;overflow:hidden}.dshmSecondary{color:var(--dsw-alias-label-caption);white-space:nowrap;text-overflow:ellipsis;overflow:hidden;font-size:12px}.dshmMetrics{color:var(--dsw-alias-label-tertiary);white-space:nowrap;flex:none;font-size:12px;line-height:20px;display:flex;gap:8px}.dshmDot{flex:none;width:10px;height:20px;justify-content:center;align-items:center;display:inline-flex}.dshmEmpty{color:var(--dsw-alias-label-secondary);flex-direction:column;gap:4px;align-items:flex-start;padding:4px 12px 14px;display:flex}.dshmEmptyTitle{color:var(--dsw-alias-label-primary);font-weight:500}.dshmNote{color:var(--dsw-alias-label-secondary);margin:2px 10px;padding:8px 2px;font-size:12px}.dshmTitleIcon{color:var(--dsw-alias-label-tertiary);flex:none}.dshmTitleCount{color:var(--dsw-alias-label-secondary);flex:none;font-size:11px;line-height:20px}.dshmDense .dshmSecondary{display:none}.dshmDense .dshmRow{padding:3px 10px}";
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
		function SubagentsBody({ sessionId, useSessions, openRow, openRoot, refreshAll, watchTree, unwatchTree, t }) {
			const [now, setNow] = (0, react.useState)(() => Date.now());
			const [activeOnly, setActiveOnly] = (0, react.useState)(false);
			const state = useSessions((value) => value);
			const current = state.current;
			const rootId = (0, react.useMemo)(() => findRootId(state.byId, current ?? sessionId), [state, current, sessionId]);
			const tree = (0, react.useMemo)(() => buildTree(state, rootId, now), [state, rootId, now]);
			(0, react.useEffect)(() => {
				watchTree();
				return () => {
					unwatchTree();
				};
			}, [watchTree, unwatchTree]);
			(0, react.useEffect)(() => {
				if (tree.counts.running === 0) return undefined;
				const timer = setInterval(() => {
					setNow(Date.now());
				}, 1e3);
				return () => {
					clearInterval(timer);
				};
			}, [tree.counts.running]);
			if (state.phase === "pending") return (0, react_jsx_runtime.jsx)("div", {
				className: styles.root,
				"data-dshm-state": "loading",
				children: (0, react_jsx_runtime.jsx)("p", { className: styles.note, children: t("loading") })
			});
			if (tree.root === undefined) return (0, react_jsx_runtime.jsx)("div", {
				className: styles.root,
				"data-dshm-state": "no-session",
				children: (0, react_jsx_runtime.jsx)("p", { className: styles.note, children: t("noSession") })
			});
			const rows = flattenRows(tree, rootId);
			const visibleRows = activeOnly ? rows.filter((row) => row.running === true) : rows;
			const dense = visibleRows.length > 6;
			return (0, react_jsx_runtime.jsxs)("div", {
				className: `${styles.root} ${dense ? styles.dense : ""}`,
				"data-dshm-state": visibleRows.length === 0 ? "empty" : "tree",
				children: [
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
			const running = useSessions(countLineageRunning);
			return (0, react_jsx_runtime.jsxs)(react.Fragment, { children: [
				(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconBranchOutline16, { className: styles.titleIcon }),
				tab.title,
				running > 0 && (0, react_jsx_runtime.jsx)("span", { className: styles.titleCount, children: running })
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
			const sessions = ctx.sessions;
			const sidebarRight = ctx.sidebarRight;
			const t = ctx.locale.bind(NS);
			let followTarget;
			let followTimer;
			let followLeft = 0;
			ctx.effect(() => () => {
				if (followTimer !== undefined) clearTimeout(followTimer);
			}, "subagent-menu: lifecycle");
			ctx.effect(() => ctx.locale.register(NS, { en, zh, ru }), "subagent-menu: dictionaries");
			ctx.effect(() => ctx.sidebarRightTabs.register(definition(t)), "subagent-menu: tab type");
			const rootOf = (id) => id === undefined ? undefined : findRootId(sessions.list.getSnapshot().byId, id);
			const placeInto = (id) => {
				if (typeof sidebarRight.openTabIn !== "function") return;
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
				if (sessions.list.getSnapshot().current !== target || openIn.has(target)) {
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
			const resolveAddress = (state, row) => {
				const entry = state.subagentsByParent[row.parentId]?.entries.find((candidate) => candidate.kind === "child" && candidate.id === row.id);
				return entry === undefined ? undefined : {
					parentSessionId: row.parentId,
					childSessionId: row.id,
					mode: entry.mode
				};
			};
			const face = (sessionId) => ({
				openRow(row) {
					const attempt = () => {
						const address = resolveAddress(sessions.list.getSnapshot(), row);
						if (address === undefined) return false;
						carry(row.id);
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
					if (sessions.list.getSnapshot().current === sessionId) {
						const root = rootOf(sessionId);
						if (root !== undefined) treeWatches.delete(root);
					}
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
			ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab", () => ctx.slots.register({
				name: "sidebar.right.pane.tab",
				key: SELF_ID,
				locale: NS,
				inject: face
			}, SubagentsBody)), "subagent-menu: tab body");
			ctx.effect(() => ctx.slots.inject("sidebar.right.pane.tab.title", () => ctx.slots.register({
				name: "sidebar.right.pane.tab.title",
				key: SELF_ID,
				locale: NS
			}, SubagentsTitle)), "subagent-menu: tab title");
			let lastCurrent = sessions.list.getSnapshot().current;
			let prefetchRoot;
			let prefetchTimer;
			let prefetchQueue = [];
			const prefetched = new Set();
			const prefetchedCount = new Map();
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
				if (target === undefined || typeof target.open !== "function") return;
				try {
					target.open();
				} catch (error) {}
			};
			const pumpPrefetch = () => {
				prefetchTimer = undefined;
				if (prefetchQueue.length === 0) return;
				prefetchOne(prefetchQueue.shift());
				if (prefetchQueue.length > 0) prefetchTimer = setTimeout(pumpPrefetch, PREFETCH_GAP_MS);
			};
			const planPrefetch = (rootId, includeIdle) => {
				const state = sessions.list.getSnapshot();
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
					else idle.push(summary.id);
				}
				const candidates = includeIdle ? [...running, ...idle] : running;
				const take = candidates.slice(0, PREFETCH_LIMIT - used);
				if (take.length === 0) return;
				prefetchedCount.set(rootId, used + take.length);
				for (const id of take) if (!prefetchQueue.includes(id)) prefetchQueue.push(id);
				if (prefetchTimer === undefined) prefetchTimer = setTimeout(pumpPrefetch, 0);
			};
			ctx.effect(() => {
				const unsubscribe = sessions.list.subscribe(() => {
					const state = sessions.list.getSnapshot();
					const current = state.current;
					if (current !== undefined && state.byId[current] !== undefined && state.byId[current].origin !== "subagent") {
						if (prefetchRoot !== current) {
							prefetchRoot = current;
							planPrefetch(current, true);
						} else {
							planPrefetch(current, false);
						}
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
			const bootState = sessions.list.getSnapshot();
			if (bootState.current !== undefined && bootState.byId[bootState.current]?.origin !== "subagent") {
				prefetchRoot = bootState.current;
				prefetchTimer = setTimeout(() => {
					prefetchTimer = undefined;
					planPrefetch(prefetchRoot, true);
				}, 1e3);
			}
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
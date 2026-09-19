import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const name = "diff-preview";

const PLUGIN = "diff-preview";
const PACKAGE = "dsh-plugin-diff-preview";
const BUNDLE_PATH = "/api/plugins/diff-preview/vendor/pierre-diffs.js";
const DIAG_PATH = "/api/plugins/diff-preview/diagnostics";
const BUNDLE_FILE = fileURLToPath(new URL("./vendor/pierre-diffs.js", import.meta.url));
const VERSION_FILE = fileURLToPath(new URL("./vendor/VERSION.json", import.meta.url));

function createJournal(ctx) {
	const entries = new Map();
	let revision = 0;
	const write = (entry) => {
		const line = `[${PACKAGE}] ${entry.level.toUpperCase()} ${entry.code} (${entry.scope}): ${entry.message}`
			+ ` | expected: ${entry.expected} | observed: ${entry.observed} | fix: ${entry.hint}`;
		try {
			const logger = ctx.logger;
			if (entry.level === "error" && typeof logger?.error === "function") logger.error(line);
			else if (typeof logger?.warn === "function") logger.warn(line);
		} catch {}
		if (typeof console !== "undefined") {
			if (entry.level === "error") console.error(line);
			else console.warn(line);
		}
	};
	return {
		put(code, level, scope, message, detail = {}) {
			const existing = entries.get(code);
			const entry = {
				code,
				level,
				scope,
				message,
				expected: detail.expected ?? "",
				observed: detail.observed ?? "",
				hint: detail.hint ?? "",
				count: (existing?.count ?? 0) + 1,
				at: Date.now()
			};
			entries.set(code, entry);
			revision += 1;
			if (existing === undefined || existing.level !== level) write(entry);
			return entry;
		},
		clear(code) {
			if (entries.delete(code)) revision += 1;
		},
		snapshot() {
			return { revision, entries: [...entries.values()] };
		}
	};
}

function readVersions() {
	try {
		return JSON.parse(readFileSync(VERSION_FILE, "utf8"));
	} catch (error) {
		return { error: String(error?.message ?? error) };
	}
}

function readBundle() {
	const stats = statSync(BUNDLE_FILE);
	const cached = readBundle.cache;
	if (cached !== undefined && cached.mtimeMs === stats.mtimeMs && cached.size === stats.size) return cached;
	const next = { text: readFileSync(BUNDLE_FILE, "utf8"), mtimeMs: stats.mtimeMs, size: stats.size };
	readBundle.cache = next;
	return next;
}

function bundleResponse(journal) {
	try {
		const bundle = readBundle();
		journal.clear("VENDOR-bundle");
		return new Response(bundle.text, {
			status: 200,
			headers: {
				"content-type": "text/javascript; charset=utf-8",
				"cache-control": "no-cache",
				"content-length": String(bundle.size)
			}
		});
	} catch (error) {
		journal.put("VENDOR-bundle", "error", "the diff renderer bundle could not be read", {
			expected: `a readable bundle at ${BUNDLE_FILE}`,
			observed: String(error?.message ?? error),
			hint: "run `node build.mjs` inside the plugin's vendor workspace to rebuild the pinned @pierre/diffs bundle"
		});
		return new Response("the diff renderer bundle is unavailable", { status: 500 });
	}
}

function registerRoutes(connectionCtx, journal) {
	const connection = connectionCtx.connection;
	if (connection?.fetch?.register === undefined) {
		journal.put("SVC-connection", "error", "the bundle channel is unavailable", {
			expected: "the dsh-client-connection fetch registry",
			observed: "undefined",
			hint: "@deepseek-ai/dsh-client-connection is not mounted; the chat keeps the built-in diff card"
		});
		return;
	}
	journal.clear("SVC-connection");
	const guard = (request) => {
		const rejection = connection.requestRejection?.(request);
		return rejection === undefined ? undefined : new Response(rejection === 401 ? "unauthorized" : "forbidden", { status: rejection });
	};
	try {
		connection.fetch.register({
			path: BUNDLE_PATH,
			methods: ["GET"],
			requestBody: "buffered",
			fetch: (request) => {
				const denied = guard(request);
				return denied === undefined ? bundleResponse(journal) : denied;
			}
		});
		journal.clear("ROUTE-bundle");
	} catch (error) {
		journal.put("ROUTE-bundle", "error", "the diff renderer bundle route could not be registered", {
			expected: `connection.fetch.register(${BUNDLE_PATH})`,
			observed: String(error),
			hint: "@deepseek-ai/dsh-client-connection assertFetchRoute: path under /api, non-empty unique methods"
		});
	}
	try {
		connection.fetch.register({
			path: DIAG_PATH,
			methods: ["GET"],
			requestBody: "buffered",
			fetch: (request) => {
				const denied = guard(request);
				if (denied !== undefined) return denied;
				const snapshot = journal.snapshot();
				return Response.json({
					plugin: PACKAGE,
					bundle: { path: BUNDLE_PATH, url: PLUGIN },
					vendor: readVersions(),
					revision: snapshot.revision,
					entries: snapshot.entries
				});
			}
		});
		journal.clear("ROUTE-diagnostics");
	} catch (error) {
		journal.put("ROUTE-diagnostics", "error", "the diagnostics route could not be registered", {
			expected: `connection.fetch.register(${DIAG_PATH})`,
			observed: String(error),
			hint: "@deepseek-ai/dsh-client-connection assertFetchRoute: path under /api, non-empty unique methods"
		});
	}
}

export function apply(ctx) {
	const journal = createJournal(ctx);
	const vendor = readVersions();
	if (typeof vendor.error === "string") {
		journal.put("VENDOR-version", "warn", "the pinned bundle version file is unreadable", {
			expected: `a JSON version file at ${VERSION_FILE}`,
			observed: vendor.error,
			hint: "run `node build.mjs` inside the plugin's vendor workspace to rebuild the bundle"
		});
	}
	ctx.inject(["connection"], (connectionCtx) => registerRoutes(connectionCtx, journal));
	ctx.logger?.info?.(`[${PACKAGE}] inline diff preview ready: @pierre/diffs ${vendor.pierreDiffs ?? "unknown"} on ${BUNDLE_PATH}`);
}

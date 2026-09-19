import { build } from "esbuild";
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const OUT_DIR = resolve(here, "..", "lib", "vendor");
const OUT_FILE = "pierre-diffs.js";
const GENERATED = join(here, "shims", "bundled-languages.js");

const languages = JSON.parse(readFileSync(join(here, "languages.json"), "utf8"));
const entries = languages.map(([grammar, aliases]) => {
	const loaders = aliases.map((alias) => `\t${JSON.stringify(alias)}: () => import("@shikijs/langs/${grammar}")`);
	return loaders.join(",\n");
});
writeFileSync(GENERATED, `export const bundledLanguages = {\n${entries.join(",\n")}\n};\n`);

const exactAlias = {
	shiki: require.resolve("./shims/shiki.js"),
	"shiki/wasm": require.resolve("./shims/wasm.js"),
	"@pierre/theming/themes": require.resolve("./shims/pierre-themes.js")
};

const exactAliasPlugin = {
	name: "diff-preview-exact-alias",
	setup(buildApi) {
		buildApi.onResolve({ filter: /.*/ }, (args) => {
			const target = exactAlias[args.path];
			return target === undefined ? undefined : { path: target };
		});
	}
};

const result = await build({
	entryPoints: [join(here, "entry.js")],
	absWorkingDir: here,
	bundle: true,
	format: "esm",
	target: "es2022",
	minify: true,
	splitting: false,
	outfile: join(OUT_DIR, OUT_FILE),
	metafile: true,
	logLevel: "warning",
	plugins: [exactAliasPlugin]
});

const outputs = Object.entries(result.metafile.outputs).map(([file, info]) => [info.bytes, file]);
outputs.sort((left, right) => right[0] - left[0]);
const total = outputs.reduce((sum, [bytes]) => sum + bytes, 0);

const vendorPackage = JSON.parse(readFileSync(join(here, "package.json"), "utf8"));
writeFileSync(join(OUT_DIR, "VERSION.json"), `${JSON.stringify({
	pierreDiffs: vendorPackage.dependencies["@pierre/diffs"],
	shiki: vendorPackage.dependencies.shiki,
	pierreTheme: vendorPackage.dependencies["@pierre/theme"],
	shikijsLangs: vendorPackage.dependencies["@shikijs/langs"],
	esbuild: vendorPackage.devDependencies.esbuild,
	bundle: OUT_FILE,
	languages: languages.map(([grammar]) => grammar),
	bytes: total
}, null, "\t")}\n`);

console.log(`diff-preview vendor: ${OUT_FILE} ${(total / 1048576).toFixed(2)} MiB`);

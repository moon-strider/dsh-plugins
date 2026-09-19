# dsh-plugin-diff-preview

Chat-only inline diff preview for file edits in the dsh web GUI. It replaces the built-in
`edit`/`write` diff card with one that shows the first ten diff rows immediately, keeps the
real added and removed counts visible, and expands on demand. Rows are rendered by a pinned
[`@pierre/diffs`](https://www.npmjs.com/package/@pierre/diffs) bundle, so the changed lines
carry Shiki syntax highlighting and the line diff is word-aware.

## What it changes

| Surface | Change |
| --- | --- |
| Chat tool card for `edit` | Replaced by this plugin's card |
| Chat tool card for `write` | Replaced by this plugin's card |
| Right sidebar, file preview, trajectory, every other tool card | Untouched |

The takeover uses the documented slot contract: `tool.call.toolview` is a keyed slot whose
key is the wire tool name, registering an existing key replaces the product's default card,
and an entry registered at a lower priority than the built-in one wins. This plugin registers
`edit` and `write` at `priority: -1`; the built-in registration stays untouched and resumes if
this plugin is removed.

## The card

- **Preview**: the first ten rendered diff rows, at the top, with no click required.
- **Counts**: `+added −removed` in the card header, using the lines that actually changed.
  The built-in card counts the hunk's context lines too, so a one-line edit reports `+7 −7`;
  here the same edit reports `+1 −1`.
- **Expand**: `… N more lines` reveals the whole diff, `Collapse` returns to the preview. A
  diff of ten rows or fewer has no expander.
- **Wrap**: long lines wrap instead of scrolling sideways, so the ten-row preview always fits
  the chat column.
- **Surface**: the card keeps the dsh code-block background and radius, and the added and
  removed rows are tinted with `--dsw-alias-state-success-primary` and
  `--dsw-alias-state-error-primary`. The tint is the theme token blended into the card
  surface at the theme's own ratio, so it stays subtle and readable in both themes.
- **States**: a running call previews the diff derived from its arguments, a failed call keeps
  its status and result text, a nested code-dispatch call renders its row without a diff, and
  an unparseable call falls back to the raw result text.
- **Fallback**: if the pinned bundle cannot be loaded, the card renders the same preview from
  its own plain line renderer and expands the same way. A diagnostic is logged to the browser
  console with the `[dsh-plugin-diff-preview]` prefix.

Line numbers are intentionally absent: the host sends hunks without their `@@` offsets, so no
absolute file line can be shown. Use the clickable file path for exact positions.

## Layout

```
lib/index.js                 host half: the pinned bundle route and the diagnostics route
lib/client.js                browser half: the tool-card takeover and the card itself
lib/vendor/pierre-diffs.js   built bundle, committed so the plugin needs no build step
lib/vendor/VERSION.json      the exact versions the bundle was built from
vendor/                      the pinned build workspace (entry, shims, language list, build script)
vendor/shims/                the aliases that keep the bundle small and offline
```

## Configuration

The plugin reads no config. `PREVIEW_ROWS` (10) and `FALLBACK_ROW_HEIGHT` (20) live at the top
of `lib/client.js`.

## Host routes

| Route | Purpose |
| --- | --- |
| `GET /api/plugins/diff-preview/vendor/pierre-diffs.js` | Serves the pinned `@pierre/diffs` bundle |
| `GET /api/plugins/diff-preview/diagnostics` | Pinned versions, the bundled language set, and the plugin journal |

## Pinned renderer

`@pierre/diffs` is used through its vanilla entry, so no React copy is bundled and the page's
own React instance is never touched. The bundle is built once and committed:

| Package | Version |
| --- | --- |
| `@pierre/diffs` | 1.4.3 |
| `shiki` | 4.4.3 |
| `@pierre/theme` | 2.0.0 |
| `@shikijs/langs` | 4.4.3 |
| `esbuild` (build only) | 0.28.2 |

Three build-time aliases keep the artifact small and self-contained:

1. `shiki` is replaced by `vendor/shims/shiki.js`, which re-exports Shiki's core, narrows the
   bundled language set to the list in `vendor/languages.json`, and supplies
   `createHighlighter` without the wasm engine.
2. `shiki/wasm` is replaced by a stub, dropping the Oniguruma wasm from the bundle.
3. `@pierre/theming/themes` is replaced by `vendor/shims/pierre-themes.js`, which keeps only
   the Pierre dark and light themes instead of the whole Shiki theme catalog.

The committed bundle is 2.8 MiB in one file, fetched lazily the first time a diff card renders.
To rebuild it after changing the language list or a pinned version:

```bash
cd vendor
pnpm install
node build.mjs
```

## Status

Host half, browser half, pinned bundle, diagnostics, and the takeover are implemented and
verified in a live dsh web instance: the card renders through `@pierre/diffs`, the preview
clips at exactly ten whole rows with no half-cut row, the expander hides and restores the same
counts, and the tint equals the theme token blended into the code surface.

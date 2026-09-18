---
description: "dsh right sidebar: a Subagents tab listing the current chat's subagents with activity, stats and click-through into a subagent chat"
kind: "project"
---

# dsh-plugin-subagent-menu

A dsh client plugin: it adds a "Subagents" tab to the right sidebar — a live monitor of the current chat's subagents.

## What it does

- On the sidebar's empty guide page (the one with the "Workspace files" button) a second capsule appears: "Subagents".
- The tab shows the chat tree: a "Main agent" row (the parent chat with its model and tokens) and the subagents (including nested ones — children of children). It adapts: header counters (how many in total, how many running, the subagents' token sum), a state dot, mode (one-shot/continuable), model, tokens and active duration; above six rows a dense mode kicks in.
- The chat currently open is highlighted (accent bar + `aria-current`), including "Main agent".
- Clicking a subagent row dives into that subagent's chat (`sessions.openSubagent`); clicking "Main agent" opens the parent chat.
- "The sidebar is open and showing Subagents" is a **state shared within a tree** (main → its subagents): navigating inside the tree (via the tab's rows or dsh's own lineage menu) carries the tab and the expanded panel into the target session, so the sidebar does not close. **The state is not carried between different trees**: every tree keeps its own state, and a tree where the subagents sidebar was never opened stays untouched (the panel behaves natively).
- A tree's state turns on while the tab is visible (sidebar expanded and the Subagents tab active) and turns off when the user, in the same session, collapses the panel, closes the tab or switches to another tab — after that the tree no longer carries the state.
- The tab title shows how many subagents of the current chat are running.
- An "Active" flag sits at the right of the header counters and filters **the tree only** down to running subagents, so idle ones drop out while the counters keep reporting the full picture (total, running, and the total token sum over every listed subagent).


## Architecture

- `package.json` — the `dsh.client` declaration (web platform plus the provider package list) and `dsh.bundle.patch` (the package adds itself to the profile's layers).
- `cordis.patch.yml` — the insert row that gives the plugin a Loader entry: `subagent-menu` → `dsh-plugin-subagent-menu`.
- `lib/index.js` — an empty host half (as in every purely client-side dsh plugin).
- `lib/client.js` — the browser bundle in `window.__ModuleLoader__.load({id, factory})` format, edited without a build step; the web profile's HMR reloads it live (~500 ms).

Data comes from the `sessions` service (`useSessions`): `byId` (the host list of every session, including subagent rows with `origin: 'subagent'`), `subagentsByParent` (direct-child catalogs) and `current`. Navigation goes through `sessions.open` / `sessions.openSubagent` (an address requires the parent's loaded catalog, so before a click the plugin calls `refreshSubagents(parent)`). A row's model comes from the `modelSelection.next.model` projection in the host list. Highlighting compares a row with `state.current`.

Carrying the state inside a tree: when the tab body mounts it marks the tree (its root, found by walking `parentId`) as "on"; when it unmounts in the same session (panel collapsed, tab closed) the mark is cleared, while an unmount caused by a session switch keeps it. On a change of `current`, if the target's tree is marked, the plugin opens its own tab in the target session through `sidebarRight.openTabIn(sessionId, kind)` (there is no public "open a tab in a specific session" method; `openTabIn` works through the session's adopted store and also expands the panel). To keep this free of flicker, an invisible `FollowSeat` is registered into the session-scoped slots `conversation.session.header.utilities` and `conversation.input.dock`: it mounts in the same React commit as the sidebar seat and seeds the tab from a `useLayoutEffect` (before the frame is painted), and clicking a row seeds the target up front (for sessions already visited). A fallback timer (~120 ms, up to 8 attempts) covers the case where neither anchor rendered.

## Installing

```sh
cd ~/Documents/Projects/dsh_plugins/subagent-menu
dsh plugin --profile web add link:"$(pwd)"
```

After the first install, reload the GUI page once (new boot-graph rows are picked up only on reload; changes to `lib/client.js` are picked up live).

## Local checks

```sh
node tmp/smoke.mjs    # registration, definition, face, dictionaries
node tmp/render.mjs   # tree, ordering, highlight, metrics, navigation
node tmp/carry.mjs    # shared state inside a tree, no carry between trees
```

`tmp/` is a scratch verification directory that never reaches git.
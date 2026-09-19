# dsh_plugins

A set of client-side plugins for [DeepSeek Harness (dsh)](https://github.com/deepseek-ai/deepseek-harness), the web GUI of the coding agent. Every subdirectory is a standalone plugin package installed into a `dsh` profile.

## Plugins

| Plugin | What it does |
|---|---|
| [`subagent-menu`](./subagent-menu) | A "Subagents" tab in the right sidebar: the current chat's subagents with their status, stats and click-through into each subagent chat |
| [`thread-trash`](./thread-trash) | Deletes root threads: moves the thread log, its subagent logs and its records to the system Trash, with an agent tool (and a panel on the way) |
| [`thread-bus`](./thread-bus) | Typed agent-to-agent messaging: cross-thread instructions between root threads, parent instructions to subagents, subagent status reports and questions, each labelled in chat with its origin and what it expects |

## Installing a plugin into the web profile

```sh
cd ~/Documents/Projects/dsh_plugins/<plugin>
dsh plugin --profile web add link:"$(pwd)"
```

The package declares `dsh.bundle.patch`, so it adds itself to the profile's layer list; its patch file inserts the Loader row, and the `dsh.client` declaration turns the package into a browser plugin. After the first install, reload the GUI page once (new boot-graph rows are picked up only on reload; changes to an already installed plugin are picked up live through HMR).

## Alerts

Plugin diagnostics are surfaced as toasts in the frame-wide overlay layer, never inside a sidebar panel: a closed sidebar must not hide a broken contract. `thread-bus` owns the stack; other plugins in this repository forward their own diagnostics into it and fall back to a local stack if it is absent.

## Development

Each plugin's browser half is `lib/client.js`, written in dsh's loader format (`window.__ModuleLoader__.load({id, factory})`, a CJS factory). It is edited directly, with no build step: the web profile's HMR polls the file roughly every 500 ms and hot-reloads the plugin in the browser. Changing the `dsh.client` declaration or the package name requires restarting `dsh web`.
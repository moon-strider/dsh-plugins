# dsh-plugin-thread-trash

Deletes root threads of the dsh web GUI. Deleting means **moving to the system Trash**, never erasing: the thread's log, the logs of all its subagents and its records leave the harness but stay recoverable.

## The agent tool

`delete_thread({ target })` — root threads only, same working directory as the caller.

- The caller must be a root thread; a subagent never deletes anything (the tool is denied on subagent scopes).
- The target must be a root thread and must **not be running**: stop it first with `stop_thread` from `thread-bus`, otherwise the call is refused with that instruction.
- A thread cannot delete itself.
- Deleting a root thread also trashes the logs of every subagent in its tree, including nested ones.

What moves to the Trash:

- every session directory of the deleted ids under `<sessionsRoot>/<cwd-slug>/` (both the `session-<id>` and the bare `<id>` directory naming are handled);
- the projection cache record `<storagesRoot>/session_projcache/sessions/<id>.json`;
- references to the deleted ids inside `<storagesRoot>/workspace.json` are removed in place.

The session list updates on the next refresh; the tool returns the deleted ids and every path that was trashed.
## What the panel hides

The Threads panel lists the root threads of the current workspace and hides two kinds of rows:

- **Subagents** — only root threads can be deleted or archived, so subagent sessions never appear.
- **Drafts** — a session where no prompt was ever sent. dsh marks these in the projection as
  `sessionListMetadata.blank` with `lastPromptAt: null`; a new chat creates such a session
  before anything is sent. The panel reads that row from the projection cache
  (`<storagesRoot>/session_projcache/sessions/<id>.json`) because the live session summary can
  report `blank: false` before its projections are prepared. A draft stops being a draft, and
  becomes visible, the moment its first prompt is sent.

## Deleting a live thread

Files are cheap to move; a session that the current process still holds in memory is not. Deleting
a thread that is live-but-idle trashes its files, but the host's own session list keeps listing it
until the process restarts, which made the panel row reappear after every refresh. The plugin now
keeps the ids it trashed for the lifetime of the process and filters them out of its own list, so
a deleted live thread stays gone from the panel. dsh's own session list may still show it until
`dsh web` restarts.

Any failure of an archive or delete action is rendered inside the panel, next to the list, in
addition to the console diagnostic and the shared toast: a click that cannot succeed must never
look like nothing happened.


## Configuration

The plugin reads its own config from the Loader row. All three keys are optional and only exist so the behaviour can be pointed at another root (tests, a migrated `DSH_HOME`):

```yaml
- id: thread-trash
  config:
    sessionsRoot: ~/.dsh/sessions
    storagesRoot: ~/.dsh/storages
    trashRoot: ~/.Trash
```

Unknown keys and empty paths fail loudly at load time.

## Diagnostics

Every host-side failure is logged with a stable code and the place to fix it, and surfaces in the browser through the shared toast stack of `thread-bus` once the panel ships:

| Code | Meaning |
|---|---|
| `TOOL-REGISTER` / `TOOL-VISIBLE` | the tool definition was rejected or is not registered | `@deepseek-ai/dsh-tools` `register()` |
| `SCOPE-<agent>` | the subagent tool restriction could not be applied | `@deepseek-ai/dsh-tools` `restrict()` |
| `REGISTRY` | `workspace.json` could not be cleaned after the files were trashed | remove the reference manually |
| `DELETE-empty-<thread>` | no session directory was found for a thread that was deleted | the configured `sessionsRoot` |
| `ROUTE` / `SVC-connection` | the panel routes could not be registered | `@deepseek-ai/dsh-client-connection` |

## Installing

```sh
dsh plugin --profile web add link:"$PWD"
```

The package declares `dsh.bundle.patch`, so its patch inserts the Loader row. A new package needs a `dsh web` restart and a page reload; adding the same insert row to the profile's own patch layer (which is watched) loads it into a running server instead.

## Status

The agent tool is complete. The sidebar panel with the thread list and a "move to Trash" button is the next step: the host half already serves `GET /api/plugins/thread-trash/threads` and `POST /api/plugins/thread-trash/delete` for it.

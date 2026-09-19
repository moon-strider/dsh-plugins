# dsh-plugin-thread-bus

Typed agent-to-agent messaging for the dsh web GUI. Agents can instruct another root thread, instruct their own subagents, report status to their parent or ask their parent a question — and every such message is labelled in chat with a pill that says where it came from and what it expects.

## Routes

| From | To | Class | Delivery |
|---|---|---|---|
| root thread A | root thread B, same working directory | imperative (`Instruction`, labelled `From another thread`) | `queue` (default) or `steer` |
| parent agent | its own direct subagent | imperative (`Instruction`) | `steer`, immediately |
| subagent | its own direct parent | informative (`Status report`, no answer expected) | `steer` |
| subagent | its own direct parent | inquisitive (`Question`, answer expected) | `steer` |

Forbidden by construction and by description: a root thread writing to another thread's subagent, any cross-thread message initiated by a subagent, a subagent writing to another tree, and cross-thread questions.

The rule is: a parent manages its subagents. Instructions go down, status reports and questions go up, and cross-thread messaging is root to root only.

## Tools

| Tool | Direction | Notes |
|---|---|---|
| `list_threads` | — | root threads of the same workspace: id, title, running state |
| `instruct_thread` | root → root of another thread | `queue` by default, `steer` interrupts that thread's current step |
| `instruct_subagent` | parent → its direct subagent | delivered as a steer, so it lands in the subagent's nearest step |
| `report_to_parent` | subagent → its direct parent | facts only, no answer expected |
| `ask_parent` | subagent → its direct parent | one clear question, an answer is expected |

Each description states when to call the tool, who the legal target is, which directions are forbidden, what the message class means, how to phrase the body and how the answer (if any) comes back. The generic dsh `send_message` stays available and unrestricted; these tools are the typed channels.

Visibility is enforced per agent, not only described: on creation a subagent is denied the cross-thread tools, and a root agent is denied the parent-report tools.

## What the human sees

- An incoming message renders as a user-style bubble with a pill above it: `From another thread — <title>`, `Instruction`, `Status report` or `Question`. The bubble is tinted per class.
- The model reads a machine frame (class, sender, how to answer) that the renderer strips from the bubble, so the provenance never appears twice.
- The sending thread gets a card instead of a bare line: target thread or agent with its title, class, delivery mode, status and time.

## Alerts

Diagnostics are never a sidebar banner: the sidebar may be closed. Alerts are toasts in the frame-wide `shell.overlay` layer, visible over every column, stackable, expandable (expected / observed / fix / log destinations) and copyable as a report.

`subagent-menu` routes its own diagnostics into the same stack, so both plugins speak one visual language.

## Configuration

The plugin reads its own config from the Loader row (the same place any dsh plugin is configured):

```yaml
- insert:
    - id: thread-bus
      name: 'dsh-plugin-thread-bus'
      config:
        coldStart: root        # root (default) resumes a closed target thread; refuse rejects it
        maxChars: 4000         # longest accepted message body
        maxSendsPerTurn: 20    # per agent, per turn
        maxSendsPerPair: 40    # per sender/target pair, per process
```

Unknown keys and invalid values fail loudly at load time instead of silently falling back.

## Diagnostics

Every assumption about dsh internals is a runtime check with a stable code, a level (`error` = the feature is dead, `warn` = degraded with a fallback), the expected and observed value, the package and symbol to fix, and self-clearing.

| Code | Meaning | Where to look |
|---|---|---|
| `SVC-<service>` | an optional host service is not mounted; the capability stays off until it appears | `dsh plugin` composition for this profile |
| `API-<method>` | a service method is missing or renamed | `@deepseek-ai/dsh-subagent` (`steerPrompt`), `@deepseek-ai/dsh-api-session-controller` (`resolveAgent`) |
| `TOOL-REGISTER-<tool>` / `TOOL-VISIBLE-<tool>` | the tool definition was rejected or is not registered | `@deepseek-ai/dsh-tools` `register()` |
| `INJECT-<agent>-<tool>` | the tool is not visible to a live agent, or its description differs from the registered one | `@deepseek-ai/dsh-tools` layers/`restrict`, or a preset/delegation `toolFilter` |
| `SCOPE-VISIBLE-<agent>-<tool>` | an agent sees a tool its role forbids | the `agent/created` role restriction |
| `HEADER-<agent>-<tool>` | the last logged request did not carry the tool schema, or carried a different description | `@deepseek-ai/dsh-tools` `wireSchemas`, `@deepseek-ai/dsh-system-prompt` |
| `DELIVER-<hop>` / `READBACK` / `WAKE` | delivery failed, the message never reached the target log, or the target inbox does not hold it | `@deepseek-ai/dsh-agent-loop` inbox splice, `@deepseek-ai/dsh-subagent` continuation |
| `POLICY-<code>` | an expected refusal (workspace mismatch, self-send, limits) | the tool arguments |
| `UI-EVENTS-*` / `UI-SLOT-*` | a conversation definition or a slot renderer was rejected | `@deepseek-ai/dsh-client-ui-conversation`, `@deepseek-ai/dsh-client-ui-chat` |
| `UI-CLASSIFY-<id>` | the stock chat no longer renders a delivered message as a user message | `@deepseek-ai/dsh-client-ui-chat` `messageDefinition` |
| `UI-DOM` | chat rows lost the stable `data-chat-flow-*` attributes used for the pill | `@deepseek-ai/dsh-client-ui-chat` flow item |
| `HOST-UNREACHABLE` | the browser half cannot reach the host half | the `dsh web` terminal, then the profile's loader rows |

Log destinations are part of every alert:

- the terminal of the running `dsh web` (the host half logs every code there with `[dsh-plugin-thread-bus]`);
- the browser console, filtered by `[dsh-plugin-thread-bus]`;
- the durable log of the affected thread: `~/.dsh/sessions/<cwd-slug>/session-<uuid>/session.v3.jsonl.zstd`, readable with `zstdcat <file> | jq -c 'select(.type=="user/message")'`;
- the host report endpoint `GET /api/plugins/thread-bus/diagnostics` (the browser half polls it and merges the entries into the same toast stack).

## Installing

```sh
dsh plugin --profile web add link:"$PWD"
```

The package declares `dsh.bundle.patch`, so its patch inserts the Loader row. A new package needs a `dsh web` restart and then a page reload: the browser boot graph is composed at boot. Later edits to `lib/client.js` hot-reload over HMR.

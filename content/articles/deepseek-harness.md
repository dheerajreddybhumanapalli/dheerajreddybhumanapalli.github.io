---
title: "Everything Is a Plugin: Building on DeepSeek Harness"
date: "2026-09-11"
summary: "A hands-on walkthrough of an agent harness where every capability — the model, the tools, even the agent loop — is a swappable plugin."
tags: [ai, agents, tools]
---

> **TL;DR** — DeepSeek Harness (`dsh`) is an open-source coding-agent harness built on one idea: everything is a plugin. The model adapter, tool registry, session log, and agent loop are all swappable Cordis plugins, not a locked-in core. I ran it with `qwen3.8:27b`, routed traffic through LiteLLM for observability, tried a custom browser plugin, and exercised all four presets (Standard, PTC, Minimal, Creative). Here's how it works and how to extend it.

---

## What is DeepSeek Harness?

At its core, DeepSeek Harness is a **coding agent you can rebuild from the inside**. It boots an agent, replays it over an append-only session log, and talks to a model through tools. Underneath, it runs on a plugin framework called **Cordis**.

What makes it different isn't "an agent with lots of tools." It's this:

> There is **no privileged core to patch.** The model adapter, tool registry, session log, and agent loop are all Cordis plugins mounted into one shared context. You extend the harness by mounting a *new* plugin alongside the others — and every registration is a **reversible effect** that unwinds cleanly on unload.

So a "harness" here isn't a fixed product with an SDK on the side. It's a **composition**: a tree of plugins assembled at boot. Each plugin registers a *service* on a shared context (`ctx.tools`, `ctx.llm`, `ctx.agents`, `ctx.sessions`, …), and other plugins discover that service by name instead of importing a concrete implementation.

That one design choice unlocks everything below.

## Getting it running

From `npm`:

```sh
npx @deepseek-ai/dsh web
```

This starts a local web UI at <http://127.0.0.1:3080> and opens it in your browser.

From source:

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

A running `dsh` boots a named **profile** — a saved plugin composition. The ones that ship are:

- `web` — the browser app (default)
- `headless` — one-shot runs, no server
- `sdk` — JSON-RPC
- `sdk-minimal` — stripped-down SDK
- `acp` — automation

You can inspect the exact tree your machine boots with:

```sh
dsh --profile web --dump-config
```

Every row it prints is a plugin you could, in principle, replace.

## Four presets, four different agents

A **preset** is a per-session agent composition: one file that names the tools, prompt sections, and skills a session gets. Because each session composes independently, **a single process can run several differently shaped agents at once.**

| Preset | What it actually is |
|---|---|
| **Standard** | The full coding agent: file editing, shell, file and web search, skills, plan mode, goals, subagents, and workflows. |
| **PTC** | Standard minus the general-purpose `workflow` tool. The model instead composes multi-step work as a *single TypeScript program* (`run_code`) over the tool registry — collapsing several round trips into one. |
| **Minimal** | A fixed-prompt, two-tool agent: persistent shell plus a string-replace editor. No skills, plan mode, subagents, or compaction. |
| **Creative** | Standard **plus** the self-referential Cordis toolset and a composition-authoring skill — the preset for *building other presets*. Treat a session on it as shell access. |

Three behaviors surprised me in a good way:

- The **default** preset is just a setting — override it per deployment or per user.
- A session can **switch presets only while it has produced nothing**. Once it has emitted messages or tool calls, the composition locks for that session's lifetime. Swapping tools mid-conversation would strand calls the new composition can't fulfill.
- **A preset is as privileged as the plugins it names.** Writing a custom preset is a trust decision, not a cosmetic one.

## My hands-on run

This is where it stopped being a README and became an "oh, it actually works" moment.

- **Model: `qwen3.8:27b`.** Coding tasks completed cleanly. The best part: after finishing an implementation, the agent ran tests, *found its own defects, and fixed them* — with no errors surfacing to me.
- **Observability via LiteLLM.** Because the model adapter sits behind the `ctx.llm` seam, I routed requests through a LiteLLM gateway for tracing without touching the agent loop. That seam is a real observability hook, not a hack.
- **A custom browser plugin.** I dropped in my own plugin and confirmed the extension path works beyond the shipped toolset.
- **All four presets exercised.** Standard, PTC, Minimal, and Creative each behaved as documented.

The takeaway: the harness is honest about what it is. When the model, the tools, and the loop are all the same kind of thing — a plugin — "extending it" stops being a special integration and becomes just *composition*.

## Adding your own capability

A plugin is a TypeScript module that contributes something to the shared context. Start with the function form:

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'my-plugin'          // optional label used in diagnostics

export function apply(ctx: Context) {
  // By the time this runs, everything you declared in `inject` is ready.
  console.log('[my-plugin] loaded')
}
```

List it in a `cordis.yml`. Each entry's `name` is a module specifier — an npm package or a path:

```yaml
- name: '/absolute/path/to/my-plugin/src/plugin.ts'
```

A conventional layout is `my-plugin/src/plugin.ts`.

### Declaring dependencies

If your plugin needs a capability — the tool registry, the LLM adapter, the agent registry — declare it with `inject`. Cordis holds your plugin *pending* until that service exists, so you never see half-initialized state, and **load order stops mattering** (dependencies decide order, not line position):

```ts
export const name = 'my-tool-plugin'
export const inject = ['tools']          // or ['tools', 'llm'], etc.
```

If you only *might* need a capability, probe instead of requiring it: `ctx.get('tools')`.

### Three shapes, one idea

1. **Function** — the `apply(ctx)` form above. Reach for this first.
2. **Object** — an object with a name, `inject`, and an `apply` method.
3. **Class / `Service`** — when you need to *expose* a service for other plugins to consume:

```ts
import { Service, type Context } from '@deepseek-ai/cordis'

declare module '@deepseek-ai/cordis' {
  interface Context { myService: MyService }   // compile-time typing
}

export class MyService extends Service {
  static inject = ['tools']

  constructor(ctx: Context) {
    super(ctx, 'myService')                    // register under 'myService'
    // Synchronous init here. From now on, ctx.myService works everywhere.
  }
}
```

The `declare module` block is TypeScript declaration merging: it adds `myService` to `Context` so `ctx.myService` type-checks. It emits no code — without it the service still works at runtime, you just lose type safety.

### Loading it without a rebuild

The fastest path is a one-off **patch overlay**:

```sh
pnpm dsh web --patch ./my-plugin/cordis.yml
```

A patch can **replace** an existing row (target it by `id`, swap its whole `config`) or **insert** new rows. Custom profiles reload these live, so you can iterate without restarting the whole app:

```yaml
# Insert a new plugin into the running composition
- insert:
    - id: my-plugin
      name: '/absolute/path/to/my-plugin/src/plugin.ts'

# Or replace the config of an existing row (by id)
- id: webserver
  config:
    host: 127.0.0.1
    port: 3081
```

### Cleanup is built in

Because registrations are **reversible effects**, Cordis unwinds what your plugin registered when it unloads. For resources you open yourself, register the teardown:

```ts
export function apply(ctx: Context) {
  const socket = openThing()
  ctx.effect(() => socket.close())   // runs when this plugin unloads
}
```

### One trust note

A plugin is **as privileged as the services it touches.** A row that publishes into the root realm is process-global; if only one agent should see it, it belongs in an isolated realm. Treat any plugin that can read or mount the live runtime the way you'd treat shell access — which is exactly how the harness itself treats the **Creative** preset.

## Why this model matters

Most agent platforms give you a strong, fixed agent plus an SDK for the seams. The "everything is a plugin" stance inverts that: the agent *is* the plugin composition, so there is no "the agent" to version against. Different model? Swap the adapter. Lean two-tool agent for a sandbox? Pick a preset. Missing capability? Write ~30 lines of TypeScript and mount it.

That's not a feature list — it's a different relationship with the tool. For anyone who has ever wanted to *understand and reshape* the thing doing their coding, that's the interesting part.

## Get started

- Run it: `npx @deepseek-ai/dsh web`
- Source: <https://github.com/deepseek-ai/deepseek-harness>
- In the repo: `docs/cordis-primer.md` (Cordis primer), `docs/cordis-tutorial/` (plugins, services, events, config), `docs/architecture.md` (profiles, bundles, patches)

*DeepSeek Harness is in developer preview and iterating rapidly — expect breaking changes.*

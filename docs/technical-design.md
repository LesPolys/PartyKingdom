# Party Kingdom — Technical Design v1.1

**August 11, 2026.** Aligned to Game Design Concept v0.4. Context: solo experienced dev, C#, Godot as eventual target, prototype-first — **and lightweight-first: no Godot work begins until the design is proven engine-free (§0).** One deliberately-open decision: transport for remote playtests (§6).

---

## 0. P-1 — engine-free design proof (current phase)

Correction recorded: Godot is the *target*, not the starting point. The design gets proven with lightweight artifacts first; all Godot milestones (§7) are gated on P-1's verdict.

- **Browser heartbeat prototype — built, in playtesting.** Single-file HTML/canvas game vs. 3 bots: roam/terrain, Gather POIs with season stock + personal cooldowns, herald post → horn → council bidding with side-lock + Leader, Tending stipend, Ravens, Market, shrine, a quest, 3 banners, open agendas, Coronation scoring + superlatives, live time controls (Standard/Quick/Blitz presets + sliders). Point-and-click movement (WASD also), scroll zoom, war-map overview toggle. Lives at `prototype/heartbeat.html`.
  *Answers: is roam → assemble → bid fun and legible? What's the right roam/council split?*
- **Headless economy sim — next, if numbers feel off.** The KingdomSim C# library (§2.1) built early and run with bot policies over thousands of games to tune stock, Power flow, and Ruin pacing. Everything written here ports directly into the Godot build later — zero throwaway.
- **Printable tabletop kit — optional.** Paper dilemma cards + map + tokens to test the politics (secret agendas, trading, tending) with the real friend group before any multiplayer code exists.

**Gate to P0:** the heartbeat loop is fun in the browser prototype across ~3 tuning iterations, and the roam/council timing question has a working answer. If it isn't fun, we rework design, not engine code.

### Design findings from the prototype so far
- Point-and-click movement is the primary control (more intuitive than WASD-only); keep both. Click a location = walk there and use it.
- The camera wants two modes: character view and a zoom-out **war-map overview** (scroll wheel / toggle). This softens the original "embodied only" call — embodied remains the play mode, but the board-game readability of the full map is part of the fantasy. Carried into the design doc decisions log.
- In-game dev tools (dilemma/location editors, content JSON export/import, skip-phase, time scale) proved immediately necessary for design iteration — carry an in-game dev console requirement into the Godot builds.

---

## 1. Stack

- **Engine (eventual):** Godot 4.x **.NET build** (latest stable at project start). 3D project.
- **Language:** C# throughout. GDScript only if a specific addon demands glue.
- **Version control:** git (github.com/LesPolys/PartyKingdom), standard Godot `.gitignore` when the engine project lands. LFS for any large art later.
- **Testing:** the simulation is a plain .NET class library, so tests are ordinary `dotnet test` (xUnit) — no in-engine test runner needed for game rules.

**Why this shape:** choosing C# makes the single most important architectural move cheap — the entire rules engine can live *outside* Godot as a pure .NET library. That buys unit-testable game rules, headless balance simulation, deterministic replays, and total insulation from engine churn, for free. It's also what makes the P-1 phase non-throwaway.

---

## 2. Architecture: sim-first, three layers

```
┌────────────────────────────────────────────────────────┐
│ KingdomSim  (pure C# class library, zero Godot refs)   │
│  phases/clock · banners · Ruin · economy · POI stock   │
│  & cooldowns · votes (side-lock, Leader) · Tending ·   │
│  agendas & dealer · Levies · story chains · scoring    │
│  IN: Commands        OUT: Events        RNG: seeded    │
└──────────────▲───────────────────┬─────────────────────┘
               │ commands          │ events (host-filtered)
┌──────────────┴───────────────────▼─────────────────────┐
│ Net layer  (Godot C#, host-authoritative)              │
│  host runs the sim · validates client commands ·       │
│  broadcasts events · secrets routed only to owners     │
└──────────────▲───────────────────┬─────────────────────┘
               │ RPCs              │ replicated state
┌──────────────┴───────────────────▼─────────────────────┐
│ Presentation  (Godot scenes)                           │
│  diorama map · totem controllers · council chamber ·   │
│  scales/banners/plinths UI · Herald audio · lobby      │
└────────────────────────────────────────────────────────┘
```

### 2.1 KingdomSim (the game, as a library)

A deterministic state machine advanced by a fixed tick (10 Hz is plenty — nothing in the rules needs more). Two interfaces:

- **Commands in** (from players via net layer): `CastVote{playerId, side, power}`, `Harvest{poiId}`, `ProposeTrade{...}`, `AcceptTrade{tradeId}`, `UseRaven{side, power}`, `ActivatePoi{poiId, payment}`, `PayLevy{resource, amount}`, `SwapAgenda{keptIndex}`, `Declare{}`. Every command is validated against current state (Is it Bidding? Is this POI in stock and off personal cooldown? Did their first deposit lock the other side?) and rejected with a reason code if illegal — the client UI simply can't be trusted to gate rules.
- **Events out**: `SeasonStarted`, `DilemmaPosted`, `HornSounded`, `PowerCommitted`, `GavelResolved{outcome, leaderId, sideEffects}`, `StockChanged`, `TradeCompleted`, `LevyPosted/Resolved`, `RuinChanged`, `AgendaDealt{playerId, agenda}` (private), `ReignEnded{scores, superlatives}`...

Everything downstream — networking, UI, the session log — is a consumer of this event stream.

**Determinism & replay:** seeded RNG + event-sourced design means a session log (seed + ordered commands) *is* a replay, and a bug report *is* a reproducible test case. Session logs are written as JSONL per game; post-playtest review reads them directly.

**Secrets discipline:** agendas are dealt and stored host-side; the `AgendaDealt` event is routed only to its owner. No secret ever exists in another client's memory — stream-sniping and memory-reading are structurally impossible, not policed.

### 2.2 Net layer

- **Host-authoritative client-server.** One player hosts; the host process runs the sim. (A headless dedicated host is a free byproduct of the sim being a library, if ever wanted.)
- Built on **Godot's high-level multiplayer** (`MultiplayerApi`, RPCs, `MultiplayerSynchronizer` for totem transforms) so the transport underneath is swappable — this is what keeps §6 a genuinely open decision rather than a rewrite.
- **Totem movement is client-authoritative** for the prototype: each client simulates its own totem and streams transforms (~15–20 Hz, interpolated on remotes). This is the single biggest netcode simplification available, it's fine for a friends-only game (cheating is a non-threat), and *nothing that matters is decided by position* — every consequential act (harvest, vote, trade) is a server-validated command. Proximity checks for trades/POIs are verified host-side with generous tolerances. If public matchmaking ever matters, this is the one layer to revisit.
- **Bandwidth reality check:** 8 players × ~20 Hz transforms is a few KB/s per client. There is no performance problem in this game; the constraint was never netcode, it's design.

### 2.3 Presentation

- **Controls (updated from P-1 findings):** point-and-click movement primary, WASD supported. Totem is a Godot `CharacterBody3D` with click-to-move navigation; terrain speed modifiers from surface metadata; no player-vs-player collision response (players pass through each other — matching the no-body-blocking rule with zero edge cases).
- **Camera (updated from P-1 findings):** two modes — embodied character view, and a zoom-out **war-map overview** (smooth scroll-wheel zoom plus a toggle), because reading the whole board is part of the tabletop fantasy.
- Diorama styling is a camera/lighting problem (tilt-shift DOF, table-scale props at the map edge) — cheap to fake in graybox, deferrable.
- Council chamber is just another map location: platforms are `Area3D`s; standing in one at bid time is what the client *requests*; the sim confirms.
- UI: banners, Ruin, dilemma card, plinth inspection, host time controls. The host console (adjust season/roam/council timers live, per the design doc) is a P0 requirement, not a dev tool.

---

## 3. Content pipeline

All game content is **JSON**, loaded by KingdomSim at session start, hot-reloadable in dev builds:

- `dilemmas/*.json` — cards grouped into **story chains** by category: `{id, category, chainId, chainStep, prerequisites: [outcomes], text, ayeStakes, nayStakes, hiddenEffects: [...], leaderConsequences: [...]}`. Chain branching = `prerequisites` referencing earlier gavel outcomes.
- `agendas/*.json` — `{archetypeId, mainConditions: [...], fallClause: {...}, personalQuestChain, championPower}` plus dealer metadata (poles served, doomsayer weight).
- `archetypes/*.json` — public identity: name, totem model ref, public leanings text.
- `pois/*.json` — `{type, region, produces, seasonStock: formula(playerCount), personalCooldown, interactSeconds, councilShuttered}`.
- `events/*.json` — event areas: region, traversal modifiers, duration, spawn triggers.

Schema validation runs in tests (every content file must parse and satisfy invariants — e.g., every chain has a step 1; every agenda's conditions reference real banners/resources). Content authoring needs no engine knowledge: playtest-night dilemma packs are a text file drop. The browser prototype's dev-tools export (`{singles, chain, pois}`) is deliberately the same shape.

---

## 4. What the sim library makes cheap (do these)

- **Rules unit tests:** side-lock enforcement, Leader tie-breaks (earliest-to-total), Tending stipend, stock refresh at gavel, Levy shortfall → Ruin, Fall triggering and Fall-clause scoring, dealer guarantees (opposed pair at 3–4, both poles covered at 5+, ≤1 heavy Doomsayer).
- **Headless balance runs:** script N thousand games with simple bot policies (greedy gatherer, single-issue voter, doomsayer) to sanity-check economy rates and Ruin pacing *before* burning friends' playtest goodwill. This is how "Fall reachable within a single Reign" gets tuned to a number.
- **Replay-driven debugging:** any playtest weirdness → rerun the JSONL log in a test.

---

## 5. Project structure (target)

```
party-kingdom/
├── PartyKingdom.sln
├── docs/                      # design + technical docs (this folder)
├── prototype/                 # P-1 browser prototype
├── sim/
│   ├── KingdomSim/            # pure C# — the rules
│   └── KingdomSim.Tests/      # xUnit; also content schema validation
├── game/                      # the Godot project (references KingdomSim)
│   ├── project.godot
│   ├── net/                   # session, transport adapters, command/event bridge
│   ├── scenes/                # map, totems, council, lobby, ui
│   └── content/               # the JSON content packs
└── tools/                     # smoke tests, headless balance runner, log inspector
```

---

## 6. Transport for remote playtests — options & tradeoffs (open decision)

Your testers are remote from build one, so NAT traversal is a P0 concern. Options, honestly costed:

**A. Direct connection over a VPN (Tailscale) — zero-integration**
ENet (Godot's default) with friends on a shared tailnet; host runs the game, others connect to a stable tailnet IP.
*Pros:* literally no networking code beyond Godot defaults; works the first night; nothing to rip out later since ENet remains the LAN/dev path regardless. *Cons:* every tester installs Tailscale and joins your tailnet (one-time, ~5 min friction); no lobby/invite UX (paste an IP); you're the IT department when someone's VPN misbehaves.

**B. Steam networking (relay + lobbies) — the shipping path, early**
Steam Datagram Relay and lobby/invite flow using Steam's free dev app ID (480) during development. In C#, two routes: **Facepunch.Steamworks** (a clean .NET library — a genuine advantage of having chosen C#) or **GodotSteam** (GDExtension, community `SteamMultiplayerPeer` gives drop-in Godot multiplayer integration).
*Pros:* friends click "Join" in Steam — zero setup friction per tester, scales to strangers later, and it's the launch infrastructure anyway; relay hides everyone's IP. *Cons:* the real cost is bridging Steam sockets into Godot's `MultiplayerPeer` — with GodotSteam it's mostly solved by the community peer; from C#/Facepunch it can mean writing a `MultiplayerPeerExtension` (a known, bounded chunk of work, but it's netcode plumbing during week one).

**C. Rented VPS relay / headless host**
A small cloud box either forwarding traffic or running the sim headless.
*Pros:* total control; a headless host is nearly free thanks to the sim-as-library design; no third-party SDK. *Cons:* monthly cost, ops burden (deploys, monitoring), and it solves nothing A or B doesn't — overkill until/unless there's a reason (persistent kingdoms living server-side, someday, maybe).

**Suggested sequencing (not a decision):** A for the first playable — it costs nothing and doesn't foreclose anything — then adopt B during P1 once the heartbeat is proven and netcode plumbing is a justified spend. C stays parked unless a concrete need appears. Flag this in the decisions log whenever you call it.

---

## 7. Milestones (gated on P-1; aligned to the design doc's MVP contract)

**P0 — The Heartbeat (Godot).** Graybox map (1 town, 3 outlying regions, roads + slow terrain), totem controller (click-to-move + WASD), war-map camera toggle, transform replication, Season clock with host time controls, Gather POIs with stock + personal cooldowns, Council platforms + Power bidding with side-lock + Leader, 3 banners, ~15 placeholder dilemmas (one small chain among them), Tending stipend, session JSONL logging. Transport per §6-A.
*Playtest question: does the proven browser heartbeat survive the jump to 3D multiplayer with real friends?*

**P1 — completes the MVP.** Market conversion, trading, Ravens + Rookery, open-mode agendas + Coronation scoring, lobby/join flow (likely §6-B lands here), first pass of superlatives.
*Playtest question: do resources and trading make votes negotiable — do deals actually happen?*

**P2 — The Politics & the Stakes (post-MVP).** Secret agendas + dealer + Declare + Masked Shrine, Ruin + Levies + Fall clauses + Crisis dilemmas, full story-category content structure, Queen tiebreak behavior, event areas.
*Playtest question: does hidden-agenda paranoia land, and is the Fall genuinely reachable within a Reign?*

**P3 — The Memory.** Chronicle save (JSON, host-side), Decrees, deck drift, persistent buildings/scars, lobby Chronicle book, First Reign teaching preset polish.
*Playtest question: does the group come back because it's* their *kingdom?*

Each phase ends with a real playtest night and a written findings note. Kill criteria matter: if the heartbeat isn't fun after ~3 tuning iterations at P-1, rework the design before any engine spend.

---

## 8. Risks

- **Custom Steam↔Godot plumbing (if/when §6-B):** bounded but fiddly; mitigated by community `SteamMultiplayerPeer` (GodotSteam) or by scheduling it in P1, never P0.
- **C# addon ecosystem gaps:** most Godot addons are GDScript-first; mitigated by needing very few addons (the sim is engine-free, and Facepunch.Steamworks is native .NET).
- **Solo scope creep:** the design doc's "explicitly out" list is the contract; the sim/content split means cut features leave no scar tissue in the codebase.
- **Client-auth movement becoming load-bearing:** keep every consequential rule position-independent (already true in the design); revisit only if the game ever leaves the friends-only context.
- **Prototype ≠ product trap:** the browser prototype is disposable by design — its *findings* port (timings, control feel, UI reads), its code does not. Only KingdomSim C# code is ever carried forward.

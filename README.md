# Party Kingdom

Multiplayer PC friendslop/party game — a war-room diorama kingdom where players
roam as totems, gather Queen's Dilemma-style resources, and vote on dilemmas
that reshape the realm.

## docs/
- `game-design-concept.md` — Game Design Concept v0.4 (pillars, season loop,
  economy, voting, Tending, Ruin/Fall, agendas, POI contention, decisions log)
- `technical-design.md` — Technical Design v1.1 (Godot/C# target, sim-first
  architecture, P-1 engine-free proof phase, milestones)

The docs are workshopped in the "Party Kingdom" Claude project and mirrored
here; the decisions log inside the design doc is the change history.

## prototype/
`heartbeat.html` — the P-1 browser prototype (v2). Single file, open in any
browser. One player + 3 bots, open agendas. Click to move/interact, M for
war-map, 🛠 for dev tools (dilemma/location editors, content JSON export/import,
skip-phase, time scale).

## tools/
Playwright smoke tests (`node tools/smoke3.js` runs a full accelerated Reign
headless and screenshots roam/council/coronation).

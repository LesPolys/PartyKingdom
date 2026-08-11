# Party Kingdom — Game Design Concept

**Version 0.4 — August 11, 2026**

## Decisions log

| Date | Decision |
|---|---|
| Aug 10 | Perspective: embodied totem (3rd person miniature on a diorama). |
| Aug 10 | Agendas: secret by default; open mode, Declare (reveal), and agenda-swap all first-class. |
| Aug 10 | Scope: prototype first. Player count: ideal 3–6, support 2 experimentally, no hard ceiling. |
| Aug 10 | Voting is fully public (standing on platforms). No hidden votes in core. |
| Aug 10 | Pass-equivalent defined: **Tending** — abstainers keep the map to themselves during Council + stipend. |
| Aug 10 | Collapse is in: **Ruin track** + Fall clauses on every agenda so collapse is winnable (John Company spirit). |
| Aug 10 | Proximity voice **cut**. MVP assumes the group is on Discord. Messenger/interception parked as a future module. |
| Aug 10 | Tone: semi-serious. Grounded fantasy drama; comedy comes from embodiment and situation, not joke writing. |
| Aug 10 | Time controls exposed: seasons count, roam length, council length, total-time presets. |
| Aug 10 | Totems are one modular entity system so NPC totem experiments are cheap. |
| Aug 10 | Engine direction: lightweight prototype, Godot as the eventual (and likely prototype) target. Full tech design deferred until design lock. |
| Aug 10 | **Player-vs-player physics cut.** The physical layer is *travel*: terrain, distance, event areas. Physicality experiments parked. |
| Aug 11 | **Resources = Queen's Dilemma's set, verbatim:** Power, Materials, Military, Provisions (4 types). |
| Aug 11 | **No encumbrance. No capacity caps.** Cut entirely. |
| Aug 11 | **Voting simplified: no body-vote.** You must be present to vote; your vote weighs exactly the Power you commit. |
| Aug 11 | **Side-switching defined:** your first Power deposit locks your side for that dilemma; all further deposits go there. Posturing is free until you pay. |
| Aug 11 | **Remote voting removed.** No Notice-Board half-votes. Raven-or-attend, full stop. |
| Aug 11 | **POI contention rules defined:** per-Season stock + personal cooldowns; denial-by-draining is legal, visible, and time-expensive; no body-blocking exists. |
| Aug 11 | Ruin pacing: the Fall must be reachable **within a single Reign** by a motivated Doomsayer. |
| Aug 11 | Dilemma content emulates Queen's Dilemma **story categories**: launch content = one small chain per category, with linked map quests. |
| Aug 11 | Roam-phase texture is trading, shared quests, and visiting locations — that's plenty; nothing more planned. |
| Aug 11 | Economy tuning (rates, stock numbers, Tending richness) explicitly deferred until after initial MVP. |
| Aug 11 | Prototype-first tightened: **prove the design engine-free** (browser heartbeat prototype) before any Godot work. See Technical Design §0. |
| Aug 11 | **Controls: point-and-click movement is primary** (WASD supported) — from heartbeat prototype feedback. |
| Aug 11 | **Camera: embodied view + zoom-out war-map overview** (scroll/toggle). Embodied stays the play mode; reading the whole board is part of the tabletop fantasy. |

---

## Pitch

A 3–6+ player online party game where you play as a living totem on a war-room diorama of a fantasy kingdom. Each Season you cross the map — gathering resources, advancing quests, cutting deals — then the horn sounds and the invested race to Council to vote on a dilemma that reshapes the realm, while the uninvested enjoy an emptied map. When the Reign ends (~60 minutes), the kingdom is in some state... and each player secretly wanted it in a different one.

**Touchstones:** The Queen's Dilemma (dilemma voting, resources, story chains, the pass action, no "good" outcomes), Peak / friendslop (a party game your whole group can pile into), Oath (the world remembers your playgroup), John Company (collapse as a live, winnable outcome — and public-goods bailouts).

## Design pillars

1. **The table is alive.** Board-game visual language everywhere: diorama map, miniature totems, giant dilemma cards, physical vote scales, hourglass timers. People already know how to read a board game — that's our onboarding superpower.
2. **Chaos feeds politics.** Everything you do on the map — resources gathered, position when the horn sounds, deals cut mid-roam — is leverage at Council. If a mechanic doesn't feed the politics or the economy, it doesn't ship.
3. **Everyone can play their first game.** Every system needs a teaching-mode configuration and a diegetic ritual that explains it by watching one round.
4. **The kingdom remembers.** Legacy Chronicle per friend group (post-MVP).
5. **Flexible party size.** Designed for 3–6, supports 2 experimentally, scales up without hard ceilings.

---

## The heartbeat: the Season loop

A session is one **Reign** of **Seasons** (default 6). Each Season:

1. **Roam Phase** (default 7 min). Free movement. Gather, quest, trade, position.
2. **The Herald Posts** (~3 min remaining). Next dilemma revealed publicly on notice boards — negotiation happens *while roaming*.
3. **The Horn** (last ~45 sec). Assembly. Invested players race to the Council Chamber.
4. **Council Phase** (default ~2.5 min). Dilemma read aloud, bidding, resolution, banners move. Meanwhile, abstainers keep the map (see Tending).

**Time controls (decided):** lobby settings expose seasons count (3–10), roam length (4–12 min), council length (90s–5 min), plus total-time presets ("Short Reign ~40min / Standard ~60 / Grand ~90+") that derive the splits. Host can adjust between seasons mid-game.

---

## The personal economy: Queen's Dilemma's resources, adopted verbatim

Four resource types, all stacked visibly on your totem's plinth — public information, like a board game. **No carry limits, no encumbrance** — wealth is constrained by the map's faucets and your time, not by inventory rules.

| Resource | Role | Primary sources |
|---|---|---|
| **Power** | Political capital — the *only* thing votes weigh. Also buys Ravens and fast travel. | Quest rewards, Tending stipend, Leader favors, dilemma payouts, Market conversion |
| **Provisions** | Food and the people's welfare — feeds Levies, prevents-unrest quests | Farmland POIs (mills, fields) |
| **Materials** | Timber, stone, ore — building and repair | Mountain/forest POIs (mines, lumber camps) |
| **Military** | Soldiers and arms — the war effort, escort and border quests | Fort/barracks POIs |

**Production is regional** — the Military you need is a mountain crossing away, and travel time *is* the cost.

**What resources are for:** quests consume them ("deliver 3 Military to the border fort"); agenda holdings score them ("end the Reign holding the most Provisions"); Shrine nudges cost them; **Levies** demand them; the **Market POI** converts the three material resources into Power (rates are a post-MVP tuning problem) — the bridge between material wealth and political weight.

**Trading:** any two totems near each other can open a trade — any combination of the four resources and Ravens. Deals are struck face to face on the map, mid-roam. This is the concrete medium for "vote my way and the Provisions are yours."

**Dilemma outcomes move resources too** (the Queen's Dilemma payoff pattern): side-effects can pay the winning side, compensate the losers, pay only the Leader, or *seize* from everyone. Sometimes the materially smart vote and the agenda-smart vote point in opposite directions — that's the design working.

**Levies (the John Company bailout):** some outcomes and Crisis dilemmas post a **Levy** at the Treasury — *the realm must deposit N of a named resource before the next gavel or take +1 Ruin.* Anyone may contribute, publicly credited; nobody has to. Watching who quietly doesn't pay is a core paranoia engine once Doomsayers exist.

---

## Voting: present and paying (simplified)

**The rule: you must be present to vote, and your vote weighs exactly the Power you commit.** No attendance bonus, no body-vote, no free weight. Attending with empty pockets means you can talk, posture, and watch — but the scale doesn't know you're there.

**Casting a vote, step by step:**

1. **Deliberation** (~60s): the Herald reads the dilemma aloud; stakes icons show which banners move on Aye vs Nay. Open talk.
2. **Bidding** (~75s): walk onto the **Aye** or **Nay** platform and deposit Power one token at a time, in full view. **Your first deposit locks your side for this dilemma** — every further token you spend goes to that side, and you cannot defect after paying. Before your first deposit you may wander freely between platforms; posturing is free until you pay. The open, one-at-a-time deposit creates auction drama — hold back, counter-bid, snipe at the gavel.
3. **The Gavel:** heavier side wins. Banners move. Side-effects resolve.

**The Leader:** most Power committed on the winning side (ties: earliest to that total). The Leader draws a **Favor** (small boon), gets their name on the outcome in the record — and any delayed consequences of that dilemma land on them. Credit and blame, Queen's Dilemma style.

**The Raven (the only remote vote):** spend a Raven to commit Power from anywhere on the map at full weight. Ravens are scarce and bought at the Rookery. There is no other remote option — it's Raven or attend.

**Nobody shows / all abstain:** the Queen resolves it alone per her visible lean — and the realm takes **+1 Ruin** for neglect. An ignored kingdom decays.

## Tending: the pass action

Any player not on a platform (and not Raven-voting) at the gavel is **Tending the realm**. Tending players:

- **Keep the map to themselves** during the entire Council Phase — gather uncontested, run quest legwork, position for next Season. The emptied kingdom *is* the reward.
- **Collect a Stipend** (+1 Power from the Crown, "for the dutiful") — the direct analogue of Queen's Dilemma pass-income, and the reason nobody is ever locked out of voting for long.
- **Hear the outcome** via the Herald's kingdom-wide announcement.

**Guardrail:** Shrines and Intrigue POIs are **shuttered during Council** — Tending is about economy and logistics, never about moving banners while the voters are locked in a room.

The intended dilemma every Season: *is this vote worth more to me than three uncontested minutes of map?* (Tuning the richness of the empty map is explicitly post-MVP.)

---

## The kingdom: three banners + the Ruin track

Three **tug-of-war axes** as giant banners over the Council Chamber. No pole is "good" — every position is just a state someone wants.

| Axis | One pole | Other pole |
|---|---|---|
| **The Crown** | Throne (royal authority) | Commons (people's power) |
| **The Way** | Old Ways (tradition, faith) | New Ways (progress, invention) |
| **The Land** | Wild (untamed, mystical) | Tamed (developed, prosperous) |

Each is a ~9-step track. Dilemmas move them 1–2 steps; some POIs nudge them (shuttered during Council).

### Ruin & the Fall

A fourth, one-directional track: **Ruin** (0–8, a fraying skull banner). Raised by neglected dilemmas, failed Levies, certain outcomes, and failed crisis quests; lowered by repair-type outcomes and costly POI work. High Ruin spawns **Crisis dilemmas** into the deck.

If Ruin maxes, **the kingdom Falls: the Reign ends immediately.**

**Pacing (decided): the Fall is reachable within a single Reign.** A motivated Doomsayer who works at it — withholding Levies, steering votes toward decay, failing crisis quests — can plausibly bring the Fall by the back half of a standard 6-Season game. Collapse is a live threat every session, not a cross-game curiosity.

**The John Company clause:** every agenda card carries **main conditions** and a small **Fall clause** (what you salvage if it all burns). For most agendas the Fall clause is meager — the table genuinely fears collapse. But Doomsayer-strain agendas have Fall clauses that outweigh their mains. Because collapse-scoring is printed on *every* card, the possibility that someone wants the Fall changes the politics even when nobody does. Dealer rule: at most one heavy-Doomsayer per game at 4+, never guaranteed.

---

## Dilemmas: story categories and chains

Structure emulates The Queen's Dilemma's storytelling (decided):

- **The deck is organized into story categories** — distinct types of stories the kingdom can live through (e.g., a war on the border, a succession intrigue, a strange faith spreading, a famine year, a discovery in the wild — exact category list is a content-design task).
- **Each category is a short chain** (3–5 linked dilemmas): later cards in a chain react to how earlier ones resolved, so the table feels a story *developing* across Seasons rather than disconnected events.
- **Chains spawn linked map quests.** A war chain puts "deliver Military to the border fort" quests on the map; a famine chain makes Provisions runs matter. The Council story and the roam economy pull on each other by construction.
- **Launch content target: one small chain per category.**
- **Presentation:** 2–3 sentence setups read aloud by the Herald; visible banner stakes as icons; hidden side-effects (resource payouts/seizures, Levies, POI spawns, Ruin ticks, delayed Leader consequences) reveal on resolution.
- **Tone: semi-serious.** Grounded low-fantasy political drama played straight, dry wit allowed, never parody. Comedy comes from embodiment and situation, not joke writing.

---

## Agendas: secret by default, fluid by design

- **Public Archetype, secret Agenda.** Your archetype (The Marshal, The Heretic, The Merchant Prince, The Wildkeeper, The Spymaster...) is visible with known leanings — instant table-reads for new players. The card behind it specifies exact scoring: banner targets, a personal quest chain, resource holdings — plus the universal **Fall clause**. Occasionally an agenda cuts against its archetype's public lean, so reads are never automatic.
- **Declare:** flip your agenda face-up permanently for +25% scoring and your archetype's Champion power — at the cost of everyone knowing exactly what to deny you.
- **Open mode:** lobby toggle, default in the teaching preset.
- **The Masked Shrine:** secretly swap your agenda (draw 2, keep 1).
- **The Coronation:** final ceremony — agendas reveal one at a time, points tally, winner crowned, and *everyone* gets a superlative title from what actually happened.

---

## The map, travel, and Points of Interest

**Fixed geography, variable content.** Landmass, regions, and roads persist game-to-game; POI cards slot into build sites at setup (6–10 active, scaling with player count).

### Travel & terrain (the physical layer)

The map's physicality is about **movement and distance, not physics.** No shoving, throwing, or player-collision play. Traversal is the resource:

- **Terrain speeds:** roads fast, fields moderate, forest/mountain/marsh slow; rivers need bridges or ferries. Route-planning is a skill returning players visibly improve at.
- **Event areas:** temporary regional conditions that reshape routes — a storm closing the pass, a festival fast-travel hub, a blight zone. These slot into the content system and can be dilemma side-effects: the vote *changes the map*.
- **Paid fast travel:** carts and ferries cost Power — a direct politics-vs-logistics tradeoff.

### Contention: spam and blocking (decided)

Two bounded rules keep location play fair without inventory limits:

1. **Season stock.** Each Gather POI holds a visible, finite stock of its resource per Season (scales with player count), refreshed at the gavel. The mill has, say, 4 Provisions bundles this Season and everyone can see how many remain from across the valley (the wheel stops turning when it's dry). No POI can be farmed infinitely.
2. **Personal cooldown.** After you harvest at a POI, that POI is on cooldown *for you* (~45–60s, shown as a small flag in your colors). You physically cannot stand at the mill and drain it alone in one visit — spam is structurally impossible, not just discouraged.

**How much blocking is allowed:** there is **no body-blocking** — no collision play means nobody can stand in a doorway. The only denial in the game is **economic denial**: racing to a POI's stock before a rival, or deliberately draining (over multiple visits, riding your own cooldowns) a resource you know they need. That's legal and intended — but it's *visible* (stock levels and your presence are public), it's *slow* (cooldowns force you to make repeat trips or rotate between POIs), and it costs the denier real time not spent on their own agenda. Denial is a strategy with a price tag, never a lockout one player can maintain alone. Shrines and Intrigue POIs use cost + global cooldowns instead of stock.

### POI categories

- **Gather** — regional resource faucets (mills/fields → Provisions, mines/camps → Materials, forts/barracks → Military), governed by stock + cooldown above.
- **Market** — convert material resources into Power; the economy's bridge.
- **Shrine** — nudge a banner for a resource cost, on cooldown; shuttered during Council.
- **Quest** — multi-step breadcrumb objectives, largely spawned by story chains; the new-player scaffold.
- **Intrigue** — Masked Shrine, Spymaster's Roost (peek one condition of a random agenda), Rookery (Ravens); shuttered during Council.
- **Treasury** — where Levies are paid, at the Council Chamber.

### Totems are modular

Everything on the map that isn't terrain is a **Totem** — one entity system with pluggable behaviors (movable, votes, follows, flees, schedules, trades). Players, the Queen, quest NPCs, threats, future messenger-runners — all one system, so every NPC-totem idea can be prototyped in days.

---

## Communication

**Proximity voice is cut.** MVP assumes **external global voice** (Discord) plus lightweight in-game signals: pings, a small emote set, the trade interaction, and the public information layer (plinths, banners, notice boards, POI stock).

**Roam-phase texture (decided):** trading, shared quests, and visiting locations is plenty. Nothing further planned.

**Parked module — the Runner:** recorded message carried by an interceptable messenger totem. Not MVP.

---

## Player counts

- **Ideal band: 3–6.** The dealer guarantees each banner has invested players in both directions at 5+, and at least one opposed pair at 3–4.
- **2-player: supported, experimental.** The Queen becomes an active third voter whose lean is visible each dilemma.
- **Above 6:** nothing hard-caps; council timers may need +30s per 3 players. Playtest 2, 3, 4, 6, and 8+ deliberately.

---

## Onboarding

- **Rules are rituals:** Herald reads aloud; horn → assembly → scale → gavel teaches the loop by repetition; voting is walking onto a platform and paying.
- **First Reign preset:** open agendas, 2 banners, no Ruin or Levies, 5 POIs, 4 seasons (~40 min).
- **Quest breadcrumbs** let a lost player matter immediately; the Tending stipend means they always have at least some Power to vote with.
- **Public archetypes** and one shared **icon language** across cards, banners, resources, and map.
- **Plinth-as-player-mat:** your resources visible on your totem's base.
- **Late-join as spectator ghosts**, joining at the next Season boundary.

---

## MVP scope (the prototype's contract)

**In:** Season loop with full time controls · totem movement over terrain (point-and-click primary, war-map zoom) · Gather POIs with regional resources, Season stock, and personal cooldowns · Market conversion · trading · Power-only voting with side-lock · Ravens · Tending (empty-map + stipend) · 3 banners · ~15 placeholder dilemmas including at least one story chain · basic agendas (open mode fine for first tests) · Coronation scoring · 2–8 lobby.

**Next after MVP (in rough order):** Ruin/Fall + Fall clauses + Levies · secret agendas + Declare + Masked Shrine · full story category set · full POI categories · event areas · Queen tiebreak behaviors · superlatives · all economy tuning (rates, stock numbers, Tending richness).

**Explicitly out until the heartbeat is proven:** legacy/Chronicle · Runner messaging · NPC totems beyond the Queen · any voice tech · any player-vs-player physics.

---

## Open questions (v0.4)

1. **Story category list:** which 4–6 story types define the kingdom's repertoire? (Content-design session — good candidate for next workshop.)
2. **2-player Queen behavior:** how much personality/predictability should her lean have?
3. **Cooldown & stock numbers:** deferred to post-MVP tuning, but the prototype needs starting guesses — take defaults above and adjust live via host controls.

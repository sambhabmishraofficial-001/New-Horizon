# New Horizon - Virtual Research Institute (VRI)

> The world's first Virtual Research Institute for life sciences.
> Human–AI co-science, positioned as an institute you enter - not a tool you open.

New Horizon is an OS-shell product that makes _the institute itself_ the primary interface. Researchers, labs, and organisations enrol; AI Investigators (AIDs) are enrolled the same way; and every claim, run, model, and invariant lives as a first-class, audited object.

## Why this feels different

Most life-sciences "copilots" treat AI as a chat box bolted onto a notebook. New Horizon starts from the opposite assumption:

- **Twins don't answer - they argue, cite, and propose falsifiers.**
- **Invariants are rails.** Every run is audited against a living registry before anything can be promoted.
- **The research graph is the document.** Hypotheses, experiments, datasets, models, and invariants are nodes; arguments are edges.
- **Everything is forkable and signed.** Twins have lineages. Datasets have signatures. Promotions are gated.

## The modules

| | | |
|--|--|--|
| **Lattice** | Institute home | Critical path, discovery feed, twins on duty, invariant watch |
| **Research Twins** | AI co-scientists | Directory, reasoning chains, instruments, invariants, lineage |
| **Canvas** | Neurosymbolic graph | Draggable nodes (hypothesis / experiment / dataset / model / invariant / anomaly) with typed edges (`argue`, `falsify`, `audit`, `feed`) |
| **Invariants & Anomalies** | Discovery lens | Registry of invariants across programs; anomaly triage with a cone of explanations and ranked decision value |
| **Environments** | In-silico RL | Versioned, deterministic environments; live rollouts; policy leaderboard ranked by invariant-survival |
| **Studio** | Training & fine-tuning | Every run tied to a hypothesis, audited before promotion |
| **Faculty** | People + compute | Labs, researchers, roles, audit feed, compute nodes |
| **Enrol** | Onboarding | Enrol a researcher, a lab, an institute, or an AID (4-step scoped charter) |
| **Library** | Memory of the institute | Papers, datasets, sequences, runs, models - all signed, all cited |

## OS shell

- **Top bar** - context switcher (org · program), global command bar, live institute vitals (active twins, open anomalies), identity
- **Left sidebar** - modules grouped by _Institute / Discovery / Systems / People_ + live compute + invariant health
- **Command palette** - `⌘K` or `Ctrl+K`. Routes to _Jump to_, _Ask the institute_, _Actions_.

## Run it

```bash
npm install
npm run dev
# open http://localhost:4000  (port 3000 is often taken - this project uses 4000 in dev)
```

**PowerShell (older versions):** use `;` not `&&` between `cd` and `npm run dev`.

**“Connection failed” in the browser**

- The dev app is **HTTP only**. `https://localhost:4000` will fail. Use `http://localhost:4000`.
- On Windows, this project binds to `localhost` because some browsers resolve `localhost` through IPv6 (`::1`). If you specifically need IPv4, run `npm run dev:ipv4` and open `http://127.0.0.1:4000`.
- Wait for **Ready** in the terminal, then try again (first page compile can take a while).
- If the port is busy, run `npm run dev:alt` and open **http://localhost:4001** instead.
- **WSL:** from Linux, `localhost` is not always your Windows host; use the Windows IP shown by `ip route` in WSL, or use Windows Edge/Chrome on the Windows side.
- A Windows **firewall** prompt for Node: allow on private networks, or the tab may not load.

Build:

```bash
npm run build && npm start
```

## Stack

- **Next.js 14** (App Router, static routes)
- **TypeScript**, **Tailwind CSS** (custom design tokens)
- **Framer Motion** (palette animations)
- **Lucide** (icons)
- Sans pairing: **Manrope** for UI and display text; mono: **JetBrains Mono**

## Design language

- Parchment-on-ink palette with a single beacon accent (blue) and four signal hues (emerald / amber / rose / violet) used only to carry epistemic meaning (passing / pending / breaking / neurosymbolic).
- Data is dense but breathable - tabular numerals, hairline dividers, micro-sparklines, quiet status pills.
- No pretend 3D. No AR/VR. Every motion is in service of the data.

## Positioning

New Horizon is sold on three tiers:

- **Researcher** - individual, free during private beta
- **Lab** - 5–25 seats, from $4 / researcher / day
- **Institute** - enterprise, dedicated compute plane, SOC2 / HIPAA / SAML / BYO-VPC, private twin lineages

## Keyboard

- `⌘K` command palette
- `⌘N` new hypothesis (sidebar)
- `⌘T` summon a twin
- `⌘I` propose invariant
- `⌘R` run subgraph / rollout
- `⌘L` ask the library
- `/` focus search on directories

---

© New Horizon · Lattice build 0.9.0. This is a reference UI; behaviour is deliberately fictive to showcase positioning, interaction model, and feel.

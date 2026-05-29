"use client";

import * as React from "react";
import Link from "next/link";
import {
  LATTICE_CAIRN_DATA,
  type DetailTab,
  type LatticeInboxItem,
  type LatticeSurface,
} from "@/lib/lattice-cairn-data";
import { LatticeCairnGraphView } from "./LatticeCairnGraphView";
import "@/app/lattice/lattice-cairn.css";

const CMDK_ACTIONS = [
  { label: "/replicate exp-0447", hint: "⏎" },
  { label: "/ablate noise schedule", hint: "" },
  { label: "/sweep learning_rate × batch_size", hint: "" },
  { label: "/contradict cid:bafy…6ee", hint: "" },
  { label: "/cite arxiv:2401.12345", hint: "" },
  { label: "/mint-doi via Zenodo", hint: "" },
];

function LatticeMark() {
  return (
    <svg className="brand-mark" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2 L22 8 L22 16 L12 22 L2 16 L2 8 Z"
        stroke="#2563eb"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="10" r="2.2" fill="#2563eb" />
      <path d="M12 12.5 L8 17 M12 12.5 L16 17" stroke="#2563eb" strokeWidth="1.5" />
    </svg>
  );
}

export function LatticeCairnStudio({ embedded = false }: { embedded?: boolean }) {
  const [surface, setSurface] = React.useState<LatticeSurface>("studio");
  const [activeInboxId, setActiveInboxId] = React.useState("exp-0447");
  const [detailTab, setDetailTab] = React.useState<DetailTab>("feed");
  const [cmdkOpen, setCmdkOpen] = React.useState(false);
  const [toast, setToast] = React.useState<string | null>(null);

  const activeItem =
    LATTICE_CAIRN_DATA.inbox.find((i) => i.id === activeInboxId) ??
    LATTICE_CAIRN_DATA.inbox[0];

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdkOpen((v) => !v);
      }
      if (mod && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setSurface((s) => (s === "studio" ? "graph" : "studio"));
      }
      if (e.key === "Escape") setCmdkOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function flipView() {
    setSurface((s) => (s === "studio" ? "graph" : "studio"));
  }

  function signRepro() {
    setToast("REPRO signed · cid:rep-new… against cid:bafy…2e1");
    setTimeout(() => setToast(null), 3000);
  }

  return (
    <div className={`lattice-cairn${embedded ? " lattice-cairn--embedded" : ""}`}>
      <header className="topbar">
        <div className="topbar-inner">
          <Link href={embedded ? "/products?lattice=1" : "/lattice"} className="brand">
            <LatticeMark />
            <span>lattice</span>
          </Link>
          <nav className="nav">
            {(
              [
                ["studio", "Studio"],
                ["graph", "Graph"],
                ["node", "Public Node"],
                ["profiles", "Profiles"],
                ["docs", "Docs"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={surface === id ? "active" : undefined}
                onClick={() => setSurface(id)}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="right">
            <button type="button" className="btn ghost sm" onClick={() => setCmdkOpen(true)}>
              <span className="kbd">⌘K</span>
            </button>
            <button type="button" className="btn ghost sm" onClick={flipView}>
              ⌘E flip to {surface === "studio" ? "Graph" : "Studio"}
            </button>
            <div style={{ width: 1, height: 18, background: "var(--bd-2)" }} />
            <div className="profile-ava" style={{ width: 28, height: 28, fontSize: 13, borderRadius: "50%" }}>
              {LATTICE_CAIRN_DATA.user.avatarLetter}
            </div>
          </div>
        </div>
      </header>

      {surface === "studio" && (
        <div className="app-shell">
          <LabsColumn />
          <InboxColumn
            activeId={activeInboxId}
            onSelect={setActiveInboxId}
          />
          <DetailColumn
            item={activeItem}
            tab={detailTab}
            onTabChange={setDetailTab}
            onSignRepro={signRepro}
          />
        </div>
      )}

      {surface === "graph" && (
        <LatticeCairnGraphView onOpenStudio={() => setSurface("studio")} />
      )}

      {(surface === "node" || surface === "profiles" || surface === "docs") && (
        <PlaceholderSurface surface={surface} onBack={() => setSurface("studio")} />
      )}

      {cmdkOpen && (
        <div
          className="lattice-cairn-cmdk"
          role="dialog"
          aria-label="Command palette"
          onClick={() => setCmdkOpen(false)}
        >
          <div className="lattice-cairn-cmdk-panel" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              placeholder="Search nodes, sign REPRO, /replicate, /ablate, @user…"
              className="lattice-cairn-cmdk-input"
            />
            <div style={{ padding: 10 }}>
              <div style={{ padding: "8px 12px", color: "var(--tx-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Quick actions
              </div>
              {CMDK_ACTIONS.map((action, i) => (
                <button
                  key={action.label}
                  type="button"
                  className="lattice-cairn-cmdk-item"
                  data-active={i === 0}
                  onClick={() => {
                    setCmdkOpen(false);
                    if (action.label.startsWith("/replicate")) signRepro();
                  }}
                >
                  <span>
                    <span className="mono" style={{ color: "var(--ac)" }}>
                      {action.label.split(" ")[0]}
                    </span>{" "}
                    {action.label.split(" ").slice(1).join(" ")}
                  </span>
                  {action.hint ? <span className="kbd">{action.hint}</span> : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="lattice-cairn-toast">{toast}</div>}
    </div>
  );
}

function LabsColumn() {
  return (
    <aside className="col-pane">
      <div className="col-head">
        <h3>Labs</h3>
        <button type="button" className="btn ghost sm" title="New lab">
          +
        </button>
      </div>
      <div className="col-body">
        <div className="lab-item active">
          <span className="swatch" />
          <span className="grow">vision-scaling</span>
          <span className="dim" style={{ fontSize: 11 }}>
            124
          </span>
        </div>
        <div className="lab-item subitem">
          + exp-0447{" "}
          <span className="chip running" style={{ marginLeft: "auto" }}>
            <span className="cdot" />
          </span>
        </div>
        <div className="lab-item subitem">+ exp-0446</div>
        <div className="lab-item subitem">+ exp-0445</div>

        {LATTICE_CAIRN_DATA.labs.slice(1).map((lab) => (
          <div key={lab.id} className="lab-item">
            <span className="swatch" style={{ background: lab.color }} />
            <span className="grow">{lab.name}</span>
            <span className="dim" style={{ fontSize: 11 }}>
              {lab.count}
            </span>
          </div>
        ))}

        <div className="section-label">Sandbox</div>
        <div className="lab-item scratch">
          <span className="swatch" />
          <span className="grow">/scratch</span>
          <span className="dim" style={{ fontSize: 11 }}>
            ephemeral
          </span>
        </div>

        <div className="section-label">Following</div>
        <div className="lab-item subitem">
          <span>@gladia</span>{" "}
          <span className="dim" style={{ fontSize: 10, marginLeft: "auto" }}>
            3 new
          </span>
        </div>
        <div className="lab-item subitem">
          <span>@rmehta</span>
        </div>
        <div className="lab-item subitem">
          <span>@allen-vision</span>{" "}
          <span className="dim" style={{ fontSize: 10, marginLeft: "auto" }}>
            1 new
          </span>
        </div>
        <div className="lab-item subitem">
          <span>@mit-csail/diffusion</span>
        </div>

        <div className="section-label">Federation</div>
        <div className="lab-item subitem">
          <span className="dot" style={{ background: "var(--ac)" }} />
          <span>184 labs online</span>
        </div>
      </div>
    </aside>
  );
}

function InboxColumn({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <aside className="col-pane">
      <div className="col-head">
        <h3>Inbox · {LATTICE_CAIRN_DATA.inbox.length}</h3>
        <div className="row" style={{ gap: 6 }}>
          <button type="button" className="btn ghost sm" title="Filter">
            ⏷
          </button>
          <button type="button" className="btn ghost sm" title="New experiment">
            +
          </button>
        </div>
      </div>
      <div className="col-body" style={{ padding: 0 }}>
        {LATTICE_CAIRN_DATA.inbox.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`inbox-item${activeId === item.id ? " active" : ""}`}
            style={{ position: "relative", width: "100%", border: 0, background: "transparent", textAlign: "left" }}
            onClick={() => onSelect(item.id)}
          >
            <div className="inbox-row">
              <span className="inbox-title">{item.title}</span>
              <span className={`chip ${item.status}`}>
                <span className="cdot" />
                {item.status}
              </span>
            </div>
            <div className="inbox-snippet">{item.snippet}</div>
            <div className="inbox-meta">
              <span className="mono">{item.id}</span>
              <span>·</span>
              <span>{item.time}</span>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

function DetailColumn({
  item,
  tab,
  onTabChange,
  onSignRepro,
}: {
  item: LatticeInboxItem;
  tab: DetailTab;
  onTabChange: (t: DetailTab) => void;
  onSignRepro: () => void;
}) {
  const tabs: { id: DetailTab; label: string }[] = [
    { id: "feed", label: "Artifacts" },
    { id: "run", label: "Run" },
    { id: "walkthrough", label: "Walkthrough" },
    { id: "reviews", label: "Reviews · 4" },
    { id: "repros", label: "REPROs · 8" },
    { id: "trust", label: "Trust" },
  ];

  return (
    <main className="detail">
      <div className="detail-head">
        <div>
          <div className="breadcrumb">
            <button type="button">vision-scaling</button> /{" "}
            <span className="hash">{item.id}</span>
          </div>
          <h2>{item.title}</h2>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <span className={`chip ${item.status}`}>
            <span className="cdot" />
            {item.status} · 38m
          </span>
          <button type="button" className="btn sm">
            Pause
          </button>
          <button type="button" className="btn sm">
            Branch
          </button>
          <button type="button" className="btn primary sm" onClick={onSignRepro}>
            Sign REPRO
          </button>
          <button type="button" className="btn ghost sm">
            ⋯
          </button>
        </div>
      </div>

      <div className="detail-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? "active" : undefined}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="detail-body">
        {tab === "feed" && <ArtifactsFeed onSignRepro={onSignRepro} />}
        {tab === "run" && <RunTab />}
        {tab === "walkthrough" && <WalkthroughTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "repros" && <ReprosTab />}
        {tab === "trust" && <TrustTab />}
      </div>
    </main>
  );
}

function ArtifactsFeed({ onSignRepro }: { onSignRepro: () => void }) {
  return (
    <div className="artifact-feed">
      <div className="artifact">
        <div className="artifact-head">
          <div>
            <span className="type">Hypothesis</span>{" "}
            <span className="hash" style={{ marginLeft: 10 }}>
              cid: bafy…2e1
            </span>
          </div>
          <div className="dim" style={{ fontSize: 11.5 }}>
            v3 · approved by @mkhatri 2h ago
          </div>
        </div>
        <div className="artifact-body">
          <h3>Depth dominates width at compute-optimal token-to-parameter ratios.</h3>
          <p>
            For diffusion losses at <code className="inline">N ≥ 1B</code>, we predict that model{" "}
            <em style={{ color: "var(--ac)", fontStyle: "normal" }}>depth</em> dominates width once
            depth ≥ 24 layers. Width returns diminish past d_model = 1024.
          </p>
          <div className="kvtable">
            <div className="k">Supersedes</div>
            <div className="v">cid: bafy…000 (Hoffmann &apos;22, width-pref regime)</div>
            <div className="k">Contradicts</div>
            <div className="v">cid: bafy…6ee (@allen-vision width-scaling)</div>
            <div className="k">Confidence</div>
            <div className="v">0.72 prior · 0.84 after first 4 runs</div>
            <div className="k">Prediction</div>
            <div className="v">loss(d=40) &lt; loss(d=24) by ≥ 0.05 nats</div>
          </div>
        </div>
      </div>

      <div className="artifact">
        <div className="artifact-head">
          <div>
            <span className="type">Protocol</span>{" "}
            <span className="hash" style={{ marginLeft: 10 }}>
              cid: bafy…91a
            </span>
          </div>
          <div className="dim" style={{ fontSize: 11.5 }}>
            env locked · A100×4 · seed 42
          </div>
        </div>
        <div className="artifact-body">
          <div className="kvtable">
            <div className="k">Repo</div>
            <div className="v">github.com/khatri-lab/diff-laws @ a3f2c1</div>
            <div className="k">Dataset</div>
            <div className="v">ds:laion-aesthetic-v6 · cid bafy…7ab</div>
            <div className="k">Env lockfile</div>
            <div className="v">cid: bafy…lock · python 3.11 · torch 2.4 · 47 deps pinned</div>
            <div className="k">Hardware</div>
            <div className="v">4× A100-80GB · NVLink · driver 555.42</div>
            <div className="k">Budget cap</div>
            <div className="v">$240 max · current $84.20 (35%)</div>
            <div className="k">Sweep dims</div>
            <div className="v">depth ∈ {"{24, 32, 40, 48}"} · width auto-derived</div>
          </div>
        </div>
      </div>

      <MetricsArtifact />
      <FigureArtifact />

      <div className="repro-band">
        <div>
          <div className="num">8</div>
          <div className="lbl">REPROs signed against parent claim · 3 contradicting</div>
        </div>
        <div className="repro-faces" style={{ marginLeft: "auto" }}>
          <div className="face">RM</div>
          <div className="face">GL</div>
          <div className="face">CO</div>
          <div className="face">MK</div>
          <div className="face">+4</div>
        </div>
        <button type="button" className="btn sm primary" onClick={onSignRepro}>
          Re-run as REPRO →
        </button>
      </div>

      <WalkthroughArtifact />
    </div>
  );
}

function MetricsArtifact() {
  return (
    <div className="artifact">
      <div className="artifact-head">
        <div>
          <span className="type">Live metrics · 4/12 runs</span>
        </div>
        <div className="dim" style={{ fontSize: 11.5 }}>
          refreshing every 10s
        </div>
      </div>
      <div className="artifact-body" style={{ paddingTop: 6 }}>
        <table className="metric-table">
          <thead>
            <tr>
              <th>config</th>
              <th>params</th>
              <th>depth</th>
              <th>width</th>
              <th>loss</th>
              <th>FID-50k</th>
              <th>Δ vs baseline</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>cfg-a</td>
              <td className="num">1.3B</td>
              <td className="num">24</td>
              <td className="num">1024</td>
              <td className="num">2.41</td>
              <td className="num">18.7</td>
              <td className="dim mono">baseline</td>
            </tr>
            <tr>
              <td>cfg-b</td>
              <td className="num">1.3B</td>
              <td className="num">32</td>
              <td className="num">896</td>
              <td className="num">2.34</td>
              <td className="num">17.2</td>
              <td className="delta-pos">−0.07 / −1.5</td>
            </tr>
            <tr>
              <td>cfg-c</td>
              <td className="num">1.3B</td>
              <td className="num">40</td>
              <td className="num">800</td>
              <td className="num">2.31</td>
              <td className="num">16.4</td>
              <td className="delta-pos">−0.10 / −2.3</td>
            </tr>
            <tr>
              <td>cfg-d</td>
              <td className="num">1.3B</td>
              <td className="num">48</td>
              <td className="num">736</td>
              <td className="num">2.33</td>
              <td className="num">16.9</td>
              <td className="delta-pos">−0.08 / −1.8</td>
            </tr>
            <tr>
              <td className="dim">cfg-e</td>
              <td className="dim mono">…queued</td>
              <td className="dim mono">56</td>
              <td className="dim mono">688</td>
              <td className="dim mono">—</td>
              <td className="dim mono">—</td>
              <td className="dim mono">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FigureArtifact() {
  return (
    <div className="artifact">
      <div className="artifact-head">
        <div>
          <span className="type">Figure · loss vs depth</span>
        </div>
        <div className="dim" style={{ fontSize: 11.5 }}>
          @mkhatri commented on region · 2 min
        </div>
      </div>
      <div className="artifact-body">
        <div className="figure-mock" style={{ height: 260 }}>
          <svg viewBox="0 0 540 220" style={{ width: "100%", height: "100%" }}>
            <defs>
              <linearGradient id="lattice-g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2563eb" stopOpacity="0.22" />
                <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="50" y1="180" x2="510" y2="180" stroke="#d1d5db" />
            <line x1="50" y1="20" x2="50" y2="180" stroke="#d1d5db" />
            <line x1="50" y1="60" x2="510" y2="60" stroke="#e5e7eb" strokeDasharray="2 4" />
            <line x1="50" y1="100" x2="510" y2="100" stroke="#e5e7eb" strokeDasharray="2 4" />
            <line x1="50" y1="140" x2="510" y2="140" stroke="#e5e7eb" strokeDasharray="2 4" />
            <path
              d="M 80 140 L 180 105 L 280 70 L 380 55 L 460 78 L 510 105 L 510 180 L 80 180 Z"
              fill="url(#lattice-g1)"
            />
            <polyline
              points="80,140 180,105 280,70 380,55 460,78 510,105"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <circle cx="380" cy="55" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            <line x1="380" y1="55" x2="380" y2="180" stroke="#2563eb" strokeDasharray="3 4" opacity="0.45" />
            <text x="384" y="200" fontFamily="JetBrains Mono" fontSize="10" fill="#2563eb">
              d=40
            </text>
            <text x="280" y="215" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#6b7280">
              depth (layers)
            </text>
            <text x="22" y="100" textAnchor="middle" fontFamily="Inter" fontSize="11" fill="#6b7280" transform="rotate(-90 22 100)">
              loss
            </text>
          </svg>
          <div className="fig-comment" style={{ top: 30, right: 24 }}>
            <div className="meta">@mkhatri · 2 min</div>
            The d=40 minimum looks robust. Worth a REPRO sweep at seed 17, 99 before we lock the claim.
            <div className="row" style={{ marginTop: 8, gap: 4 }}>
              <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: "3px 8px" }}>
                Reply
              </button>
              <button type="button" className="btn ghost sm" style={{ fontSize: 11, padding: "3px 8px" }}>
                Resolve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WalkthroughArtifact() {
  return (
    <div className="artifact">
      <div className="artifact-head">
        <div>
          <span className="type">Walkthrough · auto-draft</span>
        </div>
        <div className="dim" style={{ fontSize: 11.5 }}>
          finalizes when sweep completes
        </div>
      </div>
      <div className="artifact-body">
        <h3>To reproduce exp-0447 from a clean machine</h3>
        <pre className="code">{`# 1. install lattice
curl -fsSL https://lattice.science/install | sh

# 2. pull the locked node
lattice pull cid:bafy…2e1

# 3. provision compute (BYO)
lattice run --provider modal --gpu a100:4 --budget 240

# 4. when done, attest
lattice repro sign --target cid:bafy…2e1 --orcid 0000-0002-1234-5678`}</pre>
        <p className="dim" style={{ fontSize: 13 }}>
          All four lines are deterministic. The protocol hash, env hash, and dataset hash are all pinned in{" "}
          <code className="inline">cid:bafy…2e1</code>. Mismatch any of them and your REPRO will be flagged{" "}
          <em style={{ color: "var(--warn)", fontStyle: "normal" }}>partial</em>, not silently agree.
        </p>
      </div>
    </div>
  );
}

function RunTab() {
  return (
    <div className="panel padded" style={{ maxWidth: 820, margin: "0 auto" }}>
      <div className="eyebrow">Live terminal · cfg-c · A100×4</div>
      <pre className="code mono" style={{ background: "var(--bg-0)", marginTop: 14 }}>{`[38m22s] epoch 14/40 · step 14820 · loss 2.31 · grad_norm 0.42
[38m24s] epoch 14/40 · step 14840 · loss 2.30 · grad_norm 0.41
[38m26s] ckpt saved → cid:bafy…ckp7 (1.3B params, 5.2 GB)
[38m28s] epoch 14/40 · step 14860 · loss 2.31 · grad_norm 0.42
[38m30s] eval · FID-50k = 16.4 (Δ −2.3)
[38m31s] artifact pushed → fig-loss-vs-depth · cid:bafy…fig3
[38m32s] heartbeat ok · lease holds for 5m`}</pre>
    </div>
  );
}

function WalkthroughTab() {
  return (
    <div className="panel padded" style={{ maxWidth: 820, margin: "0 auto" }}>
      <div className="eyebrow">Walkthrough · finalizes on sweep end</div>
      <p className="dim" style={{ marginTop: 12 }}>
        A reproducibility walkthrough is auto-generated when all sweeps finalize. It will contain: the protocol hash, env lockfile hash, dataset hash, all run hashes, the metric table, the figure set, and the exact command sequence to reproduce — pinned to a single CID that other researchers can pull and re-run.
      </p>
    </div>
  );
}

function ReviewsTab() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="panel padded">
        <div className="row spread" style={{ marginBottom: 8 }}>
          <div className="row">
            <div className="profile-ava" style={{ width: 32, height: 32, fontSize: 14, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}>
              R
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>@rmehta · MIT-CSAIL</div>
              <div className="dim" style={{ fontSize: 11.5 }}>
                commented on metric table · row cfg-c · 1h ago
              </div>
            </div>
          </div>
          <button type="button" className="btn ghost sm">
            Reply
          </button>
        </div>
        <p style={{ fontSize: 14, margin: 0 }}>
          The d=40 advantage looks borderline. At seed=42 alone I&apos;d hesitate to claim ≥0.05 nats. Suggest a seed sweep {"{17, 42, 99}"} before the CLAIM is signed.
        </p>
      </div>
      <div className="panel padded">
        <div className="row spread" style={{ marginBottom: 8 }}>
          <div className="row">
            <div className="profile-ava" style={{ width: 32, height: 32, fontSize: 14, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#2563eb)" }}>
              G
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>@gladia · Sapienza</div>
              <div className="dim" style={{ fontSize: 11.5 }}>
                commented on protocol · env block · 3h ago
              </div>
            </div>
          </div>
          <button type="button" className="btn ghost sm">
            Reply
          </button>
        </div>
        <p style={{ fontSize: 14, margin: 0 }}>
          torch 2.4 has the SDPA regression we saw last month — locked deps differ from our REPRO env. Consider pinning 2.3.1 or attaching a fallback config.
        </p>
      </div>
    </div>
  );
}

function ReprosTab() {
  const cards = [
    { who: "@rmehta", badge: "agree", text: "Re-ran on 4× A100, seed 42 + 17. Loss curves overlap within ±0.012 nats.", delta: "Δ loss: −0.003 · Δ FID: −0.1" },
    { who: "@gladia", badge: "agree", text: "DiT backbone, seed 42. Minimum at d=40 confirmed.", delta: "Δ loss: +0.008 · Δ FID: +0.4" },
    { who: "@cohere", badge: "partial", text: "Trend confirmed but FID delta narrower (−0.9 vs −2.3).", delta: "Δ loss: −0.011 · Δ FID: +1.4" },
    { who: "@allen-vision/em", badge: "contradict", text: "Identical config, different dataset hash (laion-aesthetic-v5). No advantage observed.", delta: "Δ loss: +0.040 · Δ FID: +3.2" },
  ];
  return (
    <div style={{ maxWidth: 820, margin: "0 auto" }}>
      <div className="repro-card-grid" style={{ gridTemplateColumns: "repeat(2,1fr)", display: "grid", gap: 12 }}>
        {cards.map((c) => (
          <div key={c.who} className="repro-card">
            <div className="top">
              <span className="who">{c.who}</span>
              <span className={`agree-badge ${c.badge}`}>
                {c.badge === "agree" ? "Agrees" : c.badge === "partial" ? "Partial" : "Contradicts"}
              </span>
            </div>
            <div className="dim" style={{ fontSize: 12.5 }}>
              {c.text}
            </div>
            <div className="delta">{c.delta}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrustTab() {
  return (
    <div className="panel padded" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div className="eyebrow">Autonomy matrix</div>
      <h3 className="serif" style={{ fontSize: 22, fontWeight: 400, margin: "8px 0 18px" }}>
        What the agent on this node may do without asking.
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, fontSize: 12.5 }}>
        <div className="dim" style={{ padding: 8 }}>
          Axis
        </div>
        <div className="dim" style={{ padding: 8, textAlign: "center" }}>
          Always proceed
        </div>
        <div className="dim" style={{ padding: 8, textAlign: "center" }}>
          Agent decides
        </div>
        <div className="dim" style={{ padding: 8, textAlign: "center" }}>
          Request review
        </div>
        {[
          ["Compute spend", "○", "●", "○ (over $200)"],
          ["Data write", "○", "○", "●"],
          ["External API call", "○", "●", "○"],
          ["Publish to network", "○", "○", "●"],
        ].map(([axis, a, b, c]) => (
          <React.Fragment key={axis}>
            <div style={{ padding: 10, background: "var(--bg-1)", borderRadius: 6 }}>{axis}</div>
            <div style={{ padding: 10, background: "var(--bg-1)", borderRadius: 6, textAlign: "center" }}>{a}</div>
            <div style={{ padding: 10, background: "var(--bg-1)", borderRadius: 6, textAlign: "center", color: b === "●" ? "var(--ac)" : undefined }}>{b}</div>
            <div style={{ padding: 10, background: "var(--bg-1)", borderRadius: 6, textAlign: "center", color: c.includes("●") ? "var(--ac)" : undefined }}>{c}</div>
          </React.Fragment>
        ))}
      </div>
      <div className="callout" style={{ marginTop: 24 }}>
        <strong>Action ACLs.</strong> The agent on this node holds{" "}
        <code className="inline">gpu(spend&lt;$200)</code>, <code className="inline">api(arxiv.org)</code>,{" "}
        <code className="inline">dataset_write(/lab/scratch/*)</code>. Any other action surfaces an approval request in this thread.
      </div>
    </div>
  );
}

function PlaceholderSurface({
  surface,
  onBack,
}: {
  surface: LatticeSurface;
  onBack: () => void;
}) {
  const copy: Record<string, string> = {
    node: "Public node view — shareable CLAIM/RUN page with REPRO thread.",
    profiles: "Researcher profiles — REPRO given/received, signed claims, federation feed.",
    docs: "Lattice docs — install, CLI, federation protocol, object schemas.",
  };
  return (
    <div className="panel padded" style={{ margin: 40, maxWidth: 720 }}>
      <div className="eyebrow">{surface}</div>
      <h2 className="serif" style={{ fontSize: 28, fontWeight: 400, marginTop: 8 }}>
        Coming soon
      </h2>
      <p className="dim" style={{ marginTop: 12 }}>
        {copy[surface]}
      </p>
      <button type="button" className="btn sm" style={{ marginTop: 20 }} onClick={onBack}>
        Back to Studio
      </button>
    </div>
  );
}

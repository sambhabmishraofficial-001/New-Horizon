/* ============================================================
   ÆTHER — Seed data
   Realistic typed objects (15 kinds) + typed edges + investigations
   All hashes deterministic (æ-prefixed) for the demo
   ============================================================ */

const KIND_META = {
  question:    { color: 'var(--k-question)', label: 'Question',     glyph: 'Q',  desc: 'A research question — opens an investigation.' },
  hypothesis:  { color: 'var(--k-hypothesis)', label: 'Hypothesis',   glyph: 'H',  desc: 'Candidate explanation. Requires a falsifier.' },
  prereg:      { color: 'var(--k-prereg)', label: 'PreReg',       glyph: '🔒', desc: 'Signed time-stamped lock on a hypothesis + analysis plan.' },
  design:      { color: 'var(--k-design)', label: 'Design',       glyph: 'D',  desc: 'Experimental design — factors, controls, primary metric.' },
  protocol:    { color: 'var(--k-protocol)', label: 'Protocol',     glyph: 'P',  desc: 'Versioned executable recipe.' },
  sample:      { color: 'var(--k-sample)', label: 'Sample',       glyph: 'S',  desc: 'Biological/chemical material with lineage.' },
  run:         { color: 'var(--k-run)', label: 'Run',          glyph: 'R',  desc: 'One execution attempt of a protocol.' },
  measurement: { color: 'var(--k-measurement)', label: 'Measurement',  glyph: 'M',  desc: 'Atomic raw observation.' },
  analysis:    { color: 'var(--k-analysis)', label: 'Analysis',     glyph: 'A',  desc: 'Versioned analysis transformation (code + env).' },
  claim:       { color: 'var(--k-claim)', label: 'Claim',        glyph: 'C',  desc: 'An assertion. Requires falsifier, scope, posterior.' },
  null:        { color: 'var(--k-null)', label: 'Null',         glyph: '∅',  desc: 'First-class non-finding.' },
  refutation:  { color: 'var(--k-refutation)', label: 'Refutation',   glyph: '✗',  desc: 'Falsifies a target claim. Propagates retraction.' },
  replication: { color: 'var(--k-replication)', label: 'Replication',  glyph: '↻',  desc: 'Independent re-execution and re-claim.' },
  review:      { color: 'var(--k-review)', label: 'Review',       glyph: '✓',  desc: 'Signed verdict + inline annotations + COI.' },
  citation:    { color: 'var(--k-citation)', label: 'Citation',     glyph: '@',  desc: 'Pinned, typed reference between objects.' },
  retraction:  { color: 'var(--k-retraction)', label: 'Retraction',   glyph: '⊘',  desc: 'Repudiation. Triggers propagation hooks.' },
  meta:        { color: 'var(--k-meta)', label: 'MetaAnalysis', glyph: 'Σ',  desc: 'N-parent merge synthesizing multiple studies.' },
  publication: { color: 'var(--k-prereg)', label: 'Publication',  glyph: '📌', desc: 'Signed citable release with DOI.' },
};

const EDGE_META = {
  derived_from: { label: 'derived from', color: 'var(--fg-3)' },
  tests:        { label: 'tests',        color: 'var(--k-hypothesis)' },
  predicts:     { label: 'predicts',     color: 'var(--k-hypothesis)' },
  measured_by:  { label: 'measured by',  color: 'var(--k-measurement)' },
  analyzes:     { label: 'analyzes',     color: 'var(--k-analysis)' },
  supports:     { label: 'supports',     color: 'var(--green)' },
  weakens:      { label: 'weakens',      color: 'var(--amber)' },
  refutes:      { label: 'refutes',      color: 'var(--red)' },
  replicates:   { label: 'replicates',   color: 'var(--green)' },
  extends:      { label: 'extends',      color: 'var(--blue)' },
  corrects:     { label: 'corrects',     color: 'var(--amber)' },
  retracts:     { label: 'retracts',     color: 'var(--k-retraction)' },
  cites:        { label: 'cites',        color: 'var(--k-citation)' },
  reviewed_by:  { label: 'reviewed by',  color: 'var(--blue)' },
  contributed_by:{label: 'contributed by', color: 'var(--k-hypothesis)' },
};

/* hash helper — deterministic æ-prefixed pseudo-hashes for demo */
function hash(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) { h = (h * 31 + seed.charCodeAt(i)) | 0; }
  const hex = (Math.abs(h) >>> 0).toString(16).padStart(8, '0');
  return 'æ:' + hex + '…' + hex.slice(0, 3);
}

/* ============================================================
   INVESTIGATIONS
   ============================================================ */
const INVESTIGATIONS = [
  {
    id: 'crispr',
    title: 'CRISPR off-target rates',
    domain: 'biology',
    paradigm: 'Bayesian',
    hue: '#A78BFA',
    license: 'CC-BY-4.0',
    rootQuestion: 'crispr_q1',
    activeNode: 'crispr_c091',
  },
  {
    id: 'xsa',
    title: 'XSA reproduction (budget $10)',
    domain: 'ml',
    paradigm: 'Popperian',
    hue: '#F87171',
    license: 'CC-BY-4.0',
    rootQuestion: 'xsa_q1',
    activeNode: 'xsa_refu',
  },
  {
    id: 'rh',
    title: 'Riemann hypothesis — spectral approach',
    domain: 'math',
    paradigm: 'Lakatosian',
    hue: '#D4AF37',
    license: 'CC0',
    rootQuestion: 'rh_q1',
    activeNode: 'rh_i208',
  },
  {
    id: 'alz',
    title: 'Alzheimer plasma biomarker panel',
    domain: 'clinical',
    paradigm: 'Bayesian',
    hue: '#4ADE80',
    license: 'CC-BY-4.0',
    rootQuestion: 'alz_q1',
    activeNode: 'alz_d1',
  },
];

/* ============================================================
   OBJECTS — keyed by id; carry full draft + commit state
   ============================================================ */
const OBJECTS = {};

function obj(id, kind, fields, parents = [], state = 'committed', actor = '@viuqo', when = '2026-05-25') {
  OBJECTS[id] = {
    id,
    investigation: id.split('_')[0],
    hash: hash(id),
    kind,
    state,    // staged | committed | published | retracted
    actor,
    when,
    parents,
    children: [],
    fields,
  };
}

/* ---------- CRISPR investigation ---------- */
obj('crispr_q1', 'question', {
  title: 'Do PAM-distal mismatches reduce CRISPR off-target cleavage?',
  summary: 'Root question of the CRISPR off-target investigation.',
  scope: 'spCas9 in HEK293T; AAVS1, EMX1, HBB loci',
}, [], 'committed', '@viuqo', '2026-04-12 09:30');

obj('crispr_h019', 'hypothesis', {
  title: 'H-019: Mismatches at positions 17–20 reduce off-targets ≥40%',
  summary: 'PAM-distal mismatches induce thermodynamic destabilization that abrogates off-target cleavage without affecting on-target.',
  falsifier: 'η² < 0.15 OR p > 0.05 OR n < 20',
  auxiliary: 'assumes Gaussian residuals; assumes GUIDE-seq sensitivity ≥ 1 in 10⁶',
  scope: 'HEK293T (passage 10–20); AAVS1, EMX1, HBB; spCas9; positions 17–20',
}, ['crispr_q1'], 'committed', '@viuqo', '2026-04-13 11:02');

obj('crispr_h014', 'hypothesis', {
  title: 'H-014: gRNA secondary structure modulates off-targets',
  summary: 'Hairpin formation in seed region reduces off-target binding affinity.',
  falsifier: 'no monotonic relationship between MFE and off-target rate',
  scope: 'same as H-019',
}, ['crispr_q1'], 'committed', '@viuqo', '2026-04-13 11:14');

obj('crispr_h021', 'hypothesis', {
  title: 'H-021: HiFi-Cas9 variant supersedes mismatch tricks',
  summary: 'High-fidelity Cas9 variants make PAM-distal mismatches unnecessary.',
  falsifier: 'mismatch gRNAs still outperform HiFi in off-target reduction',
  scope: 'HEK293T, HiFi-Cas9 vs WT spCas9',
}, ['crispr_q1'], 'committed', '@viuqo', '2026-04-13 11:30');

obj('crispr_pr1', 'prereg', {
  title: 'PreReg æ:5c2f1e signed for H-019',
  summary: 'Analysis plan locked: Welch\'s t-test, n=28, α=0.01. 25-day lockout window.',
  signed_at: '2026-04-30T14:21:09Z',
  signing_key: 'ORCID-0000-0002-…-9d4e',
  hypothesis_ref: 'crispr_h019',
  plan: 'Primary: off-target reads (GUIDE-seq); comparator: matched gRNA; analysis: Welch\'s t at α=0.01.',
}, ['crispr_h019'], 'published', '@viuqo', '2026-04-30 14:21');

obj('crispr_d87', 'design', {
  title: 'Design D-87 (n=28, two-arm, paired)',
  summary: '28 gRNAs in matched pairs (14 mismatch / 14 control). n=3 biological replicates each.',
  factors: 'mismatch position (cat: pos-17,18,19,20)',
  controls: 'matched-sequence wild-type gRNA',
  primary_metric: 'off-target reads (GUIDE-seq)',
  power: '0.82 at α=0.01, effect 0.45',
  blinding: 'analyst-blinded',
  randomization_seed: '0xCAFEBABE',
}, ['crispr_pr1'], 'committed', '@viuqo', '2026-05-02 09:11');

obj('crispr_p21', 'protocol', {
  title: 'Protocol v2.1 — GUIDE-seq on HEK293T',
  summary: 'Standard GUIDE-seq with dsODN integration; 72h post-nucleofection; sequencing on iSeq-100.',
  steps: '1. Nucleofect 2×10⁵ cells with RNP + dsODN. 2. 72h recovery. 3. gDNA extract. 4. Tagment + amplify. 5. iSeq-100 paired-end 150.',
  hazards: 'BSL-2; sharps; reagent skin/eye',
  irb_ref: 'exempt — established cell line',
}, ['crispr_d87'], 'committed', '@viuqo', '2026-05-02 10:11');

obj('crispr_s1', 'sample', {
  title: '28 gRNA samples + HEK293T cells',
  summary: 'IDT lot #IDT-2026-0512 gRNAs; ATCC lot #ATCC-2026-04 HEK293T (passage 12-14).',
  origin: 'IDT (gRNA) + ATCC (cells)',
  storage: 'freezer-A shelf-3; gRNA at -80°C, cells in LN₂',
  expiry: '2026-11-01',
  hazard_class: 'BSL-2',
}, ['crispr_p21'], 'committed', '@v.tech', '2026-05-10 14:55');

obj('crispr_r247', 'run', {
  title: 'Run R-247: HEK293T n=48 (full design)',
  summary: 'Nebius A10G ×4h12m. Cost $4.20. Attested env hash æ:c2e9…81fa.',
  machine: 'nebius::a10g',
  duration_h: 4.2,
  cost_usd: 4.20,
  attestation: 'attested env hash æ:c2e9…81fa',
  started: '2026-05-25T11:30Z',
  ended: '2026-05-25T15:42Z',
  outcome: 'completed',
}, ['crispr_p21', 'crispr_s1'], 'committed', '@viuqo·agent', '2026-05-25 11:30');

obj('crispr_m3041', 'measurement', {
  title: '1,344 GUIDE-seq measurements',
  summary: 'Per-locus per-replicate per-gRNA read counts. Raw FASTQ via LFS.',
  count: 1344,
  instrument: 'iSeq-100 (cal cert ICR-2026-Q2)',
  schema: 'guide_seq_v3',
  raw_lfs: 'lfs://aether/crispr/r247/raw.fastq.gz',
}, ['crispr_r247'], 'committed', 'iSeq-100', '2026-05-25 15:42');

obj('crispr_a14', 'analysis', {
  title: 'Welch\'s t analysis of off-target reads',
  summary: 'Pre-registered analysis. t=7.84, p<0.0001, η²=0.47, 95% CI 0.39-0.55. No deviations.',
  code_hash: 'æ:81ff…44a2',
  env_hash: 'æ:c2e9…81fa',
  deterministic: true,
  params: 'alpha=0.01, var.equal=FALSE, alternative="two.sided"',
}, ['crispr_m3041'], 'committed', '@viuqo·aether-analyze', '2026-05-25 18:02');

obj('crispr_c091', 'claim', {
  title: 'C-091: PAM-distal mismatches reduce off-target cleavage ≥40%',
  summary: 'Pre-registered claim: mismatches at positions 17-20 reduce off-target cleavage by ≥40% (η²=0.47) without affecting on-target.',
  statement: 'PAM-distal mismatches at positions 17–20 reduce off-target cleavage by ≥40% across 28 gRNAs in HEK293T, with effect size η²=0.47 (95% CI 0.39–0.55) at α=0.01.',
  falsifier: 'effect size η² < 0.15 OR p > 0.05 OR n < 20 → claim refuted.',
  scope: 'HEK293T (passage 10–20); AAVS1, EMX1, HBB loci; spCas9 only; mismatch positions 17–20.',
  posterior: 'P(true | data) = 0.94 · prior 0.30 · BF = 38.2',
  prereg_ref: 'crispr_pr1',
  power_achieved: 0.82,
}, ['crispr_a14', 'crispr_pr1'], 'staged', '@viuqo', '2026-05-25 20:14');

obj('crispr_repl_doudna', 'replication', {
  title: 'Replication R-Doudna (independent)',
  summary: 'Doudna lab independently executed Protocol v2.1, n=24, found η²=0.43 (CI 0.34–0.51). Replication succeeded.',
  outcome: 'succeeded',
  independence: 'no shared funding, no shared samples, blinded analysis',
  target: 'crispr_c091',
}, ['crispr_c091'], 'committed', '@doudna-lab', '2026-05-25 21:30');

obj('crispr_rv1', 'review', {
  title: 'Peer review accept (3 reviewers)',
  summary: 'All 3 reviewers signed accept with COI disclosed.',
  reviewers: ['@reviewer-A', '@reviewer-B', '@reviewer-C'],
  coi: '@reviewer-B: shared funding line (Howard Hughes Medical Institute)',
  verdict: 'accept',
}, ['crispr_c091'], 'committed', '@editor', '2026-05-25 21:45');

/* ---------- XSA refutation investigation ---------- */
obj('xsa_q1', 'question', {
  title: 'Does Exclusive Self-Attention (XSA) actually improve quality?',
  summary: 'Reproducing XSA paper claims on a $10 budget at compact scale.',
}, [], 'committed', '@viuqo', '2026-03-13');

obj('xsa_h1', 'hypothesis', {
  title: 'H-1: XSA improves quality vs SA at matched compute',
  summary: 'Author claim. We attempt to reproduce.',
  falsifier: '0 of 6 conditions show DELTA_XSA_MINUS_SA > 0 → refuted',
  scope: '50M param, Shakespeare-char, A10 GPU, 7 budget conditions',
}, ['xsa_q1'], 'committed');

obj('xsa_p1', 'protocol', {
  title: 'Reproduction protocol (matched-pair training)',
  summary: 'A10 GPU. Matched seed + LR + steps + tok/sec. 7 conditions.',
  steps: '1. Baseline SA. 2. XSA replacement. 3. Match LR / steps / tokens. 4. Train. 5. Eval val loss.',
}, ['xsa_h1']);

obj('xsa_r1', 'run', {
  title: '6 paired runs · A10',
  summary: 'All 6 conditions: default_lr, low_lr, sink_proxy, sw_768, sw_1024, sw_2048.',
  machine: 'nebius::a10',
  cost_usd: 9.40,
  duration_h: 8.0,
}, ['xsa_p1']);

obj('xsa_m1', 'measurement', {
  title: 'Val loss, tok/sec, peak VRAM per run',
  summary: '6 conditions × 4 metrics = 24 measurements.',
}, ['xsa_r1']);

obj('xsa_c1', 'claim', {
  title: 'Original author claim (under test)',
  summary: 'XSA improves val loss at matched compute.',
  statement: 'XSA improves validation loss vs SA at matched parameters and compute.',
  falsifier: 'no condition shows positive delta',
  scope: '50M param language modeling',
  posterior: '(under test)',
}, ['xsa_q1']);

obj('xsa_refu', 'refutation', {
  title: 'Refu-014 refutes XSA at compact scale',
  summary: '6/6 conditions show DELTA_XSA_MINUS_SA > 0 (XSA WORSE). XSA_BETTER count = 0. Refuted.',
  target: 'xsa_c1',
  mechanism: 'measured negative effect across all sampled conditions',
  evidence: 'xsa_m1',
}, ['xsa_m1', 'xsa_c1'], 'published');

obj('xsa_rt1', 'retraction', {
  title: 'Retraction propagation (3 dependants notified)',
  summary: 'On-publish hook fired: 3 downstream investigations pinning xsa_c1 received notifications.',
  target: 'xsa_c1',
  propagation_count: 3,
}, ['xsa_refu']);

/* ---------- Riemann hypothesis investigation ---------- */
obj('rh_q1', 'question', {
  title: 'Can the Riemann hypothesis be approached via spectral methods?',
  summary: 'Hilbert-Pólya-style strategy: find self-adjoint operator with eigenvalues = imaginary parts of nontrivial zeros.',
}, []);
obj('rh_h1', 'hypothesis', {
  title: 'Spectral compressibility induces Polya conjecture',
  falsifier: 'no compressibility metric satisfies bounds',
  scope: 'Connes adelic geometry'
}, ['rh_q1']);
obj('rh_pr1', 'prereg', {
  title: 'PreReg v4 — proof attempt lock',
  summary: 'Lean proof skeleton committed. 25-day re-write embargo.',
  signed_at: '2026-04-12T00:00Z',
}, ['rh_h1'], 'published');
obj('rh_i208', 'analysis', {
  title: 'I-208: Gauged cone quantization U(1) analog',
  summary: 'Lean 4 partial proof attached. Spectral bound holds for n<10^9 numerically.',
  code_hash: 'æ:lean9…2104',
}, ['rh_pr1']);

/* ---------- Alzheimer investigation ---------- */
obj('alz_q1', 'question', {
  title: 'Can a 4-biomarker plasma panel predict early Alzheimer onset?',
  summary: 'Aβ42/40, p-tau217, NfL, GFAP panel.',
}, []);
obj('alz_irb', 'prereg', {
  title: 'IRB-7714 approval + analysis plan',
  summary: 'Stanford IRB approved 2026-03-04. Informed consent v2.0.',
  signed_at: '2026-03-04T16:00Z',
}, ['alz_q1'], 'published');
obj('alz_d1', 'design', {
  title: 'Two-arm cohort n=142',
  summary: '71 MCI vs 71 matched controls. ROC primary, AUC ≥ 0.85 threshold.',
}, ['alz_irb']);

/* ============================================================
   EDGES (typed)
   ============================================================ */
const EDGES = [
  // CRISPR
  { from: 'crispr_q1', to: 'crispr_h019', type: 'derived_from' },
  { from: 'crispr_q1', to: 'crispr_h014', type: 'derived_from' },
  { from: 'crispr_q1', to: 'crispr_h021', type: 'derived_from' },
  { from: 'crispr_h019', to: 'crispr_pr1', type: 'tests' },
  { from: 'crispr_pr1', to: 'crispr_d87', type: 'derived_from' },
  { from: 'crispr_d87', to: 'crispr_p21', type: 'derived_from' },
  { from: 'crispr_p21', to: 'crispr_r247', type: 'derived_from' },
  { from: 'crispr_s1', to: 'crispr_r247', type: 'measured_by' },
  { from: 'crispr_r247', to: 'crispr_m3041', type: 'derived_from' },
  { from: 'crispr_m3041', to: 'crispr_a14', type: 'analyzes' },
  { from: 'crispr_a14', to: 'crispr_c091', type: 'supports' },
  { from: 'crispr_c091', to: 'crispr_repl_doudna', type: 'replicates' },
  { from: 'crispr_c091', to: 'crispr_rv1', type: 'reviewed_by' },
  // XSA
  { from: 'xsa_q1', to: 'xsa_h1', type: 'derived_from' },
  { from: 'xsa_h1', to: 'xsa_p1', type: 'tests' },
  { from: 'xsa_p1', to: 'xsa_r1', type: 'derived_from' },
  { from: 'xsa_r1', to: 'xsa_m1', type: 'derived_from' },
  { from: 'xsa_q1', to: 'xsa_c1', type: 'derived_from' },
  { from: 'xsa_c1', to: 'xsa_refu', type: 'refutes' },
  { from: 'xsa_m1', to: 'xsa_refu', type: 'supports' },
  { from: 'xsa_refu', to: 'xsa_rt1', type: 'retracts' },
  // RH
  { from: 'rh_q1', to: 'rh_h1', type: 'derived_from' },
  { from: 'rh_h1', to: 'rh_pr1', type: 'tests' },
  { from: 'rh_pr1', to: 'rh_i208', type: 'derived_from' },
  // Alz
  { from: 'alz_q1', to: 'alz_irb', type: 'tests' },
  { from: 'alz_irb', to: 'alz_d1', type: 'derived_from' },
];

/* ============================================================
   SUBAGENTS / SKILLS (for inspector "Activity" tab)
   ============================================================ */
const SUBAGENTS = [
  { id: 'design', name: 'aether-design (power gate)', status: 'done' },
  { id: 'run',    name: 'aether-run (compute orchestrator)', status: 'done' },
  { id: 'analyze',name: 'aether-analyze (Welch\'s t)', status: 'done' },
  { id: 'repl',   name: 'aether-replicate (Doudna fork)', status: 'running' },
  { id: 'review', name: 'aether-review (3 reviewers)', status: 'done' },
];

/* ============================================================
   HOOKS — typed events shipped (Æther has 40+; here are the active 3)
   ============================================================ */
const HOOKS = [
  { event: 'claim.committed',    action: 'notify replicators',           enabled: true },
  { event: 'retraction.published',action:'propagate to dependants',     enabled: true },
  { event: 'replication.added',  action: 'recompute meta-analysis',      enabled: true },
];

/* ============================================================
   Required-field schemas per kind (drives gate computation)
   ============================================================ */
const KIND_SCHEMA = {
  question:    { required: ['title', 'scope'], optional: ['summary'] },
  hypothesis:  { required: ['title', 'falsifier', 'scope'], optional: ['summary', 'auxiliary'] },
  prereg:      { required: ['title', 'signed_at', 'signing_key', 'plan'], optional: ['summary'] },
  design:      { required: ['title', 'factors', 'controls', 'primary_metric', 'power'], optional: ['blinding', 'randomization_seed'] },
  protocol:    { required: ['title', 'steps', 'hazards'], optional: ['summary', 'irb_ref'] },
  sample:      { required: ['title', 'origin', 'storage'], optional: ['expiry', 'hazard_class'] },
  run:         { required: ['title', 'machine', 'started', 'attestation'], optional: ['cost_usd', 'duration_h'] },
  measurement: { required: ['title', 'instrument', 'schema'], optional: ['count', 'raw_lfs'] },
  analysis:    { required: ['title', 'code_hash', 'env_hash'], optional: ['params', 'deterministic'] },
  claim:       { required: ['title', 'statement', 'falsifier', 'scope', 'posterior'], optional: ['prereg_ref', 'power_achieved'] },
  null:        { required: ['title', 'tested_hypothesis', 'power_achieved'], optional: ['ci'] },
  refutation:  { required: ['title', 'target', 'mechanism', 'evidence'], optional: ['summary'] },
  replication: { required: ['title', 'target', 'outcome', 'independence'], optional: ['summary'] },
  review:      { required: ['title', 'verdict', 'coi'], optional: ['reviewers'] },
  citation:    { required: ['title', 'target', 'relation_type'], optional: [] },
  retraction:  { required: ['title', 'target', 'reason'], optional: ['propagation_count'] },
  meta:        { required: ['title', 'included', 'method', 'posterior'], optional: [] },
  publication: { required: ['title', 'doi', 'license'], optional: ['journal'] },
};

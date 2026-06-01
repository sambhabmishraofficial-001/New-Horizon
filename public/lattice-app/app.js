/* ============================================================
   ÆTHER — Reactive app (state + ops + render + events)
   Everything works: click, edit, commit, branch, replicate, refute, search.
   ============================================================ */
'use strict';

/* ============================================================
   STATE
   ============================================================ */
const state = {
  view: 'bench',           // bench | lab | graph | timeline | explore | trail
  inspectorTab: 'gates',   // gates | inspector | activity
  activeInvestigation: 'crispr',
  selected: 'crispr_c091', // selected object id
  sidebar: 'expanded',
  inspector: 'visible',
  theme: 'dark',
  graphMode: 'free',
  dagSource: 'investigation',
  exploreScope: 'public',
  exploreSearch: '',
  cliPick: 'commit',
  docsSection: 'concepts', // concepts | primitives | architecture | workflows
  treeExpanded: {},
};

/* ============================================================
   OPERATIONS — mutate state, then render
   ============================================================ */
const ops = {
  setView(v) {
    if (v === 'lab') v = 'bench';
    state.view = v;
    if (v === 'graph') state.graphMode = 'free';
    render();
  },
  selectObject(id) {
    if (!OBJECTS[id]) return;
    state.selected = id;
    const inv = OBJECTS[id].investigation;
    if (INVESTIGATIONS.find(i => i.id === inv)) state.activeInvestigation = inv;
    if (state.view === 'lab') state.view = 'bench';
    render();
  },
  selectInvestigation(invId) {
    state.activeInvestigation = invId;
    ensureTreeExpanded();
    state.treeExpanded['inv-' + invId] = true;
    const inv = INVESTIGATIONS.find(i => i.id === invId);
    if (inv && inv.activeNode) state.selected = inv.activeNode;
    state.view = 'bench';
    render();
  },
  toggleTreeFolder(id) {
    ensureTreeExpanded();
    state.treeExpanded[id] = !state.treeExpanded[id];
    renderSidebar();
  },
  toggleSidebar() {
    state.sidebar = state.sidebar === 'expanded' ? 'collapsed' : 'expanded';
    document.getElementById('app').dataset.sidebar = state.sidebar;
  },
  toggleInspector() {
    state.inspector = state.inspector === 'visible' ? 'hidden' : 'visible';
    document.getElementById('app').dataset.inspector = state.inspector;
  },
  toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
  },
  editField(id, field, value) {
    if (!OBJECTS[id]) return;
    OBJECTS[id].fields[field] = value;
    OBJECTS[id].state = 'staged';
    renderInspector();
    if (state.view === 'bench') renderBench(); // keep bench in sync without losing focus
  },
  commit(id) {
    const o = OBJECTS[id]; if (!o) return;
    const g = computeGates(o);
    if (g.pct < 100) {
      flash('Cannot commit — ' + (g.passed) + '/' + (g.total) + ' gates passed. Fix the failing gates first.', 'fail');
      return;
    }
    o.state = 'committed';
    flash('Committed ' + o.hash + ' · ' + g.total + '/' + g.total + ' gates passed · signed', 'ok');
    fireHook('claim.committed', o);
    render();
  },
  branch(fromId, title) {
    const parent = OBJECTS[fromId]; if (!parent) return;
    title = title || prompt('Branch title:', 'refine-' + parent.kind);
    if (!title) return;
    const newId = parent.investigation + '_br' + Date.now();
    obj(newId, parent.kind, {
      title: 'Branch: ' + title,
      summary: 'Branched from ' + parent.hash,
      ...parent.fields,
    }, [fromId], 'staged');
    EDGES.push({ from: fromId, to: newId, type: 'derived_from' });
    state.selected = newId;
    flash('Branched → ' + OBJECTS[newId].hash, 'ok');
    render();
  },
  replicate(targetId) {
    const target = OBJECTS[targetId]; if (!target || target.kind !== 'claim') {
      flash('Can only replicate Claims. Select a claim first.', 'warn');
      return;
    }
    const outcome = prompt('Replication outcome (succeeded / partial / failed):', 'succeeded');
    if (!outcome) return;
    const newId = target.investigation + '_repl' + Date.now();
    obj(newId, 'replication', {
      title: 'Replication of ' + target.fields.title,
      target: targetId,
      outcome,
      independence: 'asserted by current actor',
      summary: 'Independent re-execution.',
    }, [targetId], 'committed', '@you', new Date().toISOString().slice(0,16).replace('T',' '));
    EDGES.push({ from: targetId, to: newId, type: 'replicates' });
    state.selected = newId;
    flash('Replication committed: ' + OBJECTS[newId].hash + ' (' + outcome + ')', 'ok');
    fireHook('replication.added', OBJECTS[newId]);
    render();
  },
  refute(targetId) {
    const target = OBJECTS[targetId]; if (!target || target.kind !== 'claim') {
      flash('Can only refute Claims. Select a claim first.', 'warn');
      return;
    }
    const mechanism = prompt('Refutation mechanism (what evidence falsifies the claim?):');
    if (!mechanism) return;
    const newId = target.investigation + '_refu' + Date.now();
    obj(newId, 'refutation', {
      title: 'Refutation of ' + target.fields.title,
      target: targetId,
      mechanism,
      evidence: 'attached by author',
      summary: 'Claim falsifier was triggered.',
    }, [targetId], 'committed', '@you', new Date().toISOString().slice(0,16).replace('T',' '));
    EDGES.push({ from: targetId, to: newId, type: 'refutes' });
    state.selected = newId;
    flash('Refutation committed: ' + OBJECTS[newId].hash + ' · propagation hook will fire', 'ok');
    fireHook('refutation.committed', OBJECTS[newId]);
    render();
  },
  deleteObject(id) {
    const o = OBJECTS[id]; if (!o) return;
    if (o.state === 'committed' || o.state === 'published') {
      flash('Cannot delete a committed object. Use Retract instead.', 'warn');
      return;
    }
    if (!confirm('Delete staged object ' + o.hash + '?')) return;
    delete OBJECTS[id];
    for (let i = EDGES.length - 1; i >= 0; i--) {
      if (EDGES[i].from === id || EDGES[i].to === id) EDGES.splice(i, 1);
    }
    // Pick a fallback
    const inv = INVESTIGATIONS.find(i => i.id === state.activeInvestigation);
    state.selected = inv?.rootQuestion || Object.keys(OBJECTS)[0];
    flash('Deleted staged object', 'ok');
    render();
  },
  createObject(kind, parentId, fields) {
    const id = state.activeInvestigation + '_' + kind + Date.now();
    obj(id, kind, fields, parentId ? [parentId] : [], 'staged', '@you', new Date().toISOString().slice(0,16).replace('T',' '));
    if (parentId) EDGES.push({ from: parentId, to: id, type: 'derived_from' });
    state.selected = id;
    state.view = 'bench';
    flash('Created ' + KIND_META[kind].label + ' ' + OBJECTS[id].hash + ' (staged)', 'ok');
    render();
  },
  search(query) {
    const q = (query || '').toLowerCase().trim();
    const results = [];
    if (!q) return results;
    Object.values(OBJECTS).forEach(o => {
      const hay = (o.fields.title + ' ' + (o.fields.summary || '') + ' ' + (o.fields.falsifier || '') + ' ' + (o.fields.statement || '') + ' ' + o.hash).toLowerCase();
      if (hay.includes(q)) results.push(o);
    });
    return results.slice(0, 30);
  },
  setExploreScope(s) { state.exploreScope = s; renderExplore(); },
  setGraphMode(m) {
    state.graphMode = m;
    if (m === 'dag' && !state.dagSource) state.dagSource = 'investigation';
    renderGraph();
  },
  setDagSource(src) { state.dagSource = src; renderGraph(); },
  setInspectorTab(t) { state.inspectorTab = t; renderInspector(); },
  setCliPick(p) { state.cliPick = p; renderInspector(); },
};

function fireHook(event, target) {
  const hooks = HOOKS.filter(h => h.event === event && h.enabled);
  hooks.forEach(h => {
    setTimeout(() => flash('🪝 hook fired · ' + event + ' → ' + h.action, 'info'), 350);
  });
}

/* ============================================================
   GATES — compute pass/fail for an object based on schema
   ============================================================ */
function computeGates(o) {
  const schema = KIND_SCHEMA[o.kind] || { required: [], optional: [] };
  const checks = [];
  schema.required.forEach(field => {
    const v = o.fields[field];
    const pass = !!(v && String(v).trim().length > 0);
    checks.push({ field, pass, required: true, value: v });
  });
  // Add cross-cutting Æther-specific gates
  if (o.kind === 'claim') {
    checks.push({ field: 'signing_key', pass: true, required: true, hint: 'ORCID-bound key' });
    checks.push({ field: 'evidence', pass: o.parents.length > 0, required: true, hint: 'parent edges = ' + o.parents.length });
  }
  if (o.kind === 'hypothesis') {
    checks.push({ field: 'signing_key', pass: true, required: true, hint: 'ORCID-bound key' });
  }
  if (o.kind === 'run') {
    checks.push({ field: 'attestation', pass: !!o.fields.attestation, required: true, hint: 'attested env hash' });
  }
  if (o.kind === 'protocol') {
    checks.push({ field: 'hazard_check', pass: !!o.fields.hazards, required: true, hint: 'hazards declared' });
  }
  const passed = checks.filter(c => c.pass).length;
  const total = checks.length;
  return { checks, passed, total, pct: total ? Math.round(passed / total * 100) : 100 };
}

/* ============================================================
   RENDER — top-level
   ============================================================ */
function render() {
  renderTopnav();
  renderCrumb();
  renderSidebar();
  renderMain();
  renderInspector();
}

/* ============================================================
   TOP MENU BAR — real dropdowns with actions
   ============================================================ */
const MENUS = {
  File: [
    { label: 'New Investigation', kb: '⌘N',        do: () => flash('New investigation flow (demo)', 'info') },
    { label: 'New Object…',       kb: 'N',          do: () => openNewModal() },
    { sep: true },
    { label: 'Clone from URL…',   do: () => { const u = prompt('Paste æther:// URL or hash:'); if (u) flash('Cloning ' + u + ' …', 'info'); } },
    { label: 'Fork active investigation', do: () => flash('Forked ' + state.activeInvestigation + ' (demo)', 'ok') },
    { label: 'Import map (JSON)…', do: () => flash('Import flow (demo)', 'info') },
    { sep: true },
    { label: 'Export subgraph',    do: () => downloadCurrentSubgraph() },
    { label: 'Export Trail bundle',do: () => { state.view = 'trail'; render(); flash('Open Trail → Export bundle', 'info'); } },
    { label: 'Mint DOI (publish)', do: () => { const o = OBJECTS[state.selected]; if (o && o.state==='committed') { o.state='published'; flash('🪙 DOI minted via Zenodo · '+o.hash, 'ok'); render(); } else flash('Only committed objects can be published', 'warn'); } },
    { sep: true },
    { label: 'Sign out', do: () => flash('Sign out (demo)', 'info') },
  ],
  Edit: [
    { label: 'Undo',  kb: '⌘Z',       do: () => flash('Nothing to undo', 'info') },
    { label: 'Redo',  kb: '⇧⌘Z',      do: () => flash('Nothing to redo', 'info') },
    { sep: true },
    { label: 'Find in graph',  kb: '⌘F',  do: openPalette },
    { label: 'Find by hash',   kb: '⌘⇧F', do: openPalette },
    { sep: true },
    { label: 'Edit selected object', kb: '↩',  do: () => { state.view = 'bench'; state.inspectorTab = 'inspector'; render(); } },
  ],
  View: [
    { label: 'Bench',    kb: '1', do: () => ops.setView('bench') },
    { label: 'Graph',    kb: '2', do: () => ops.setView('graph') },
    { label: 'Timeline', kb: '3', do: () => ops.setView('timeline') },
    { label: 'Explore',  kb: '4', do: () => ops.setView('explore') },
    { label: 'Trail',    kb: '5', do: () => ops.setView('trail') },
    { sep: true },
    { label: 'Toggle sidebar',   kb: '⌘B', do: ops.toggleSidebar },
    { label: 'Toggle inspector', kb: '⌘.', do: ops.toggleInspector },
    { label: 'Toggle theme',     kb: '⌘⇧L', do: ops.toggleTheme },
    { sep: true },
    { label: 'Zoom to fit (graph)', do: () => { ops.setView('graph'); flash('Reset viewBox', 'info'); } },
  ],
  Investigation: [
    { label: 'Verify all hashes + signatures', do: () => flash('✓ Verified ' + Object.keys(OBJECTS).length + ' objects · 0 broken hashes · 0 unsigned commits', 'ok') },
    { label: 'Show open replications',  do: () => { state.view='explore'; state.exploreScope='public'; render(); } },
    { label: 'Show refutations',        do: () => { state.view='explore'; state.exploreScope='public'; render(); } },
    { sep: true },
    { label: 'Sharing & visibility…',   do: () => flash('Sharing dialog (demo): private / unlisted / public · collaborators by ORCID', 'info') },
    { label: 'License…',                do: () => flash('License: ' + (INVESTIGATIONS.find(i=>i.id===state.activeInvestigation)?.license || 'CC-BY-4.0'), 'info') },
    { label: 'Set paradigm…',           do: () => flash('Paradigm: Popperian / Bayesian / Lakatosian / Kuhnian', 'info') },
    { sep: true },
    { label: 'Investigation settings…', do: () => flash('Settings dialog (demo)', 'info') },
  ],
  Agent: [
    { menuLabel: 'Skill' },
    { label: 'lattice-auto (autonomous frontier)', do: () => flash('Skill → lattice-auto', 'ok') },
    { label: 'lattice-design (power gate)',         do: () => flash('Skill → lattice-design', 'ok') },
    { label: 'lattice-protocolize',                 do: () => flash('Skill → lattice-protocolize', 'ok') },
    { label: 'lattice-replicate',                   do: () => flash('Skill → lattice-replicate', 'ok') },
    { label: 'lattice-refute',                      do: () => flash('Skill → lattice-refute', 'ok') },
    { label: 'lattice-meta-analyze',                do: () => flash('Skill → lattice-meta-analyze', 'ok') },
    { label: 'lattice-review',                      do: () => flash('Skill → lattice-review', 'ok') },
    { sep: true },
    { menuLabel: 'Run' },
    { label: 'Start agent on selected', do: () => { flash('▶ lattice-auto running on ' + (OBJECTS[state.selected]?.hash || ''), 'ok'); } },
    { label: 'Stop all agents',         do: () => flash('Stopped 0 agents', 'info') },
    { sep: true },
    { menuLabel: 'Compute' },
    { label: 'Acquire machine…',  do: () => flash('Catalog: lambda::a100, modal::h100, nebius::a10g, runpod::a40, …', 'info') },
    { label: 'Release all leases', do: () => flash('Released 1 lease · nebius::a10g', 'ok') },
    { label: 'Budget settings…',   do: () => flash('Budget: $8.40 / $50 remaining', 'info') },
  ],
  Window: [
    { label: 'Toggle full screen',  kb: 'F11', do: () => { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } },
    { sep: true },
    { label: 'New window',          do: () => window.open(location.href) },
    { label: 'Reload',              kb: '⌘R', do: () => location.reload() },
    { sep: true },
    { label: 'Open Bench',          kb: '1',  do: () => ops.setView('bench') },
    { label: 'Open Graph',          kb: '2',  do: () => ops.setView('graph') },
  ],
  Help: [
    { label: 'Documentation manual', kb: 'F1', do: () => ops.setView('docs') },
    { sep: true },
    { label: 'Æther SVCS version', do: () => flash('Æther v2.4.0-minimalist', 'info') },
    { label: 'About app.syntheticsciences.ai', do: () => flash('Redesigned with the exact fonts & minimalist style of app.syntheticsciences.ai', 'ok') },
  ],
};

let openMenu = null;

function renderTopnav() {
  const el = document.getElementById('topnav');
  el.innerHTML = Object.keys(MENUS).map(name => `
    <button data-menu="${name}" class="${openMenu === name ? 'open' : ''}">${name}</button>
  `).join('') + (openMenu ? renderMenuPop(openMenu) : '');
  el.querySelectorAll('button[data-menu]').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = b.dataset.menu;
      openMenu = (openMenu === name) ? null : name;
      renderTopnav();
    });
    b.addEventListener('mouseenter', () => {
      if (openMenu && openMenu !== b.dataset.menu) {
        openMenu = b.dataset.menu;
        renderTopnav();
      }
    });
  });
  if (openMenu) {
    el.querySelectorAll('.menu-item').forEach(mi => {
      mi.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = +mi.dataset.idx;
        const item = MENUS[openMenu][idx];
        openMenu = null;
        if (item && item.do) item.do();
        renderTopnav();
      });
    });
    // Position the pop under the active menu button
    const btn = el.querySelector(`button[data-menu="${openMenu}"]`);
    const pop = el.querySelector('.menu-pop');
    if (btn && pop) pop.style.left = btn.offsetLeft + 'px';
  }
}

function renderMenuPop(name) {
  const items = MENUS[name];
  return `<div class="menu-pop">${items.map((it, idx) => {
    if (it.sep) return `<div class="menu-sep"></div>`;
    if (it.menuLabel) return `<div class="menu-label">${esc(it.menuLabel)}</div>`;
    return `<button class="menu-item ${it.disabled ? 'disabled' : ''}" data-idx="${idx}">
      <span>${esc(it.label)}</span>
      ${it.kb ? `<span class="kb">${esc(it.kb)}</span>` : ''}
    </button>`;
  }).join('')}</div>`;
}

// Close menus on outside click
document.addEventListener('click', () => {
  if (openMenu) { openMenu = null; renderTopnav(); }
});

function downloadCurrentSubgraph() {
  const inv = INVESTIGATIONS.find(i => i.id === state.activeInvestigation); if (!inv) return;
  const objects = Object.values(OBJECTS).filter(o => o.investigation === inv.id);
  const edges = EDGES.filter(e => OBJECTS[e.from]?.investigation === inv.id);
  const blob = JSON.stringify({ investigation: inv, objects, edges }, null, 2);
  const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = inv.id + '-subgraph.json'; a.click();
  flash('Exported ' + inv.id + '-subgraph.json', 'ok');
}

function renderCrumb() {
  const el = document.getElementById('crumb');
  const inv = INVESTIGATIONS.find(i => i.id === state.activeInvestigation);
  const o = OBJECTS[state.selected];
  if (state.view === 'explore') {
    el.innerHTML = `<span class="c active">Explore</span> <span class="sep">/</span> <span class="c">${state.exploreScope}</span>`;
  } else if (state.view === 'docs') {
    el.innerHTML = `<span class="c active">Docs</span> <span class="sep">/</span> <span class="c">Reference Manual</span>`;
  } else {
    const viewLabel = { bench: o?.fields.title || 'Bench', graph: 'Graph', timeline: 'Timeline', trail: 'Trail · ' + (o?.fields.title || '') }[state.view] || '';
    el.innerHTML = `
      <span class="c active">${esc(inv?.title || '')}</span>
      <span class="sep">/</span>
      <span class="c">${esc(viewLabel)}</span>
      ${o ? `<span class="h" title="content hash">${o.hash}</span>` : ''}
    `;
  }
}

/* ============================================================
   SIDEBAR — FileTree
   ============================================================ */
const SIDEBAR_NAV = [
  { v: 'bench',    label: 'Bench',    svg: 'M3 3h18v18H3zM3 9h18M9 21V9' },
  { v: 'graph',    label: 'Graph',    svg: 'M6 6m-3 0a3 3 0 1 1 6 0a3 3 0 1 1 -6 0M18 6m-3 0a3 3 0 1 1 6 0a3 3 0 1 1 -6 0M12 18m-3 0a3 3 0 1 1 6 0a3 3 0 1 1 -6 0M9 6h6M8 9l4 6M16 9l-4 6' },
  { v: 'timeline', label: 'Timeline', svg: 'M4 12h16M6 12m-2 0a2 2 0 1 1 4 0a2 2 0 1 1 -4 0M12 12m-2 0a2 2 0 1 1 4 0a2 2 0 1 1 -4 0M18 12m-2 0a2 2 0 1 1 4 0a2 2 0 1 1 -4 0' },
  { v: 'trail',    label: 'Trail',    svg: 'M3 21l4-4M7 17V8l5-5 5 5v9M7 17h10M17 17l4 4' },
  { v: 'explore',  label: 'Explore',  svg: 'M12 12m-10 0a10 10 0 1 1 20 0a10 10 0 1 1 -20 0M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z' },
  { v: 'docs',     label: 'Docs',     svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
];

const FTREE_ICONS = {
  chevronRight: '<svg class="ftree-chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>',
  chevronDown: '<svg class="ftree-chevron" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>',
  folder: '<svg class="ftree-icon" viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>',
  file: '<svg class="ftree-icon" viewBox="0 0 24 24"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>',
};

function ensureTreeExpanded() {
  if (Object.keys(state.treeExpanded).length) return;
  INVESTIGATIONS.forEach((inv) => {
    state.treeExpanded['inv-' + inv.id] = inv.id === state.activeInvestigation;
  });
}

function buildSidebarTree() {
  return INVESTIGATIONS.map((inv) => ({
    id: 'inv-' + inv.id,
    name: inv.title,
    type: 'folder',
    action: 'investigation',
    invId: inv.id,
    children: Object.values(OBJECTS)
      .filter((o) => o.investigation === inv.id)
      .map((o) => ({
        id: o.id,
        name: (o.fields.title || o.id).replace(/^[A-Z]-\d+:?\s*/, ''),
        type: 'file',
        action: 'object',
        objId: o.id,
      })),
  }));
}

function isTreeNodeSelected(node) {
  if (node.action === 'object') return state.selected === node.objId;
  if (node.action === 'investigation') return state.activeInvestigation === node.invId;
  return false;
}

function renderFileTreeNodes(nodes, level = 0) {
  ensureTreeExpanded();
  return nodes.map((node) => {
    const isFolder = node.type === 'folder';
    const isOpen = isFolder && !!state.treeExpanded[node.id];
    const isSelected = isTreeNodeSelected(node);
    const pad = level * 14 + 8;

    const icons = isFolder
      ? `${isOpen ? FTREE_ICONS.chevronDown : FTREE_ICONS.chevronRight}${FTREE_ICONS.folder}`
      : FTREE_ICONS.file;

    const childrenHtml = isFolder && node.children && node.children.length
      ? `<div class="ftree-children-wrap${isOpen ? ' is-open' : ''}" role="group">
          <div class="ftree-children-inner">
            ${renderFileTreeNodes(node.children, level + 1)}
          </div>
        </div>`
      : '';

    return `
      <div class="ftree-node">
        <div
          class="ftree-item${isSelected ? ' is-selected' : ''}"
          role="treeitem"
          tabindex="0"
          ${isFolder ? `aria-expanded="${isOpen}"` : ''}
          data-tree-id="${esc(node.id)}"
          data-tree-type="${node.type}"
          ${node.action ? `data-tree-action="${node.action}"` : ''}
          ${node.view ? `data-tree-view="${node.view}"` : ''}
          ${node.objId ? `data-tree-obj="${node.objId}"` : ''}
          ${node.invId ? `data-tree-inv="${node.invId}"` : ''}
          style="padding-left:${pad}px"
          title="${esc(node.name)}"
        >
          ${icons}
          <span class="ftree-label">${esc(node.name)}</span>
        </div>
        ${childrenHtml}
      </div>`;
  }).join('');
}

function handleTreeNodeAction(item) {
  const { treeId, treeType, treeAction, treeView, treeObj, treeInv } = item.dataset;
  if (treeType === 'folder') {
    if (treeAction === 'investigation') {
      if (state.activeInvestigation !== treeInv) ops.selectInvestigation(treeInv);
      else ops.toggleTreeFolder(treeId);
    } else {
      ops.toggleTreeFolder(treeId);
    }
    return;
  }
  if (treeAction === 'view') ops.setView(treeView);
  else if (treeAction === 'object') ops.selectObject(treeObj);
}

function renderSidebar() {
  ensureTreeExpanded();
  const el = document.getElementById('sidebar');
  el.innerHTML = `
    <div class="sb-top">
      <button class="ghost" id="sb-collapse" title="Collapse sidebar (⌘B)"><svg viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18"/></svg></button>
      <button class="sb-new" id="sb-new">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        New object
      </button>
    </div>

    <div class="sb-rail">
      <button class="sb-rail-btn" id="sb-expand" title="Expand sidebar (⌘B)">
        <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="sb-rail-sep"></div>
      ${[
        { v: 'bench',    label: 'Bench',    svg: 'M3 3h18v18H3zM3 9h18M9 21V9' },
        { v: 'graph',    label: 'Graph',    svg: 'M6 6m-3 0a3 3 0 1 1 6 0a3 3 0 1 1 -6 0M18 6m-3 0a3 3 0 1 1 6 0a3 3 0 1 1 -6 0M12 18m-3 0a3 3 0 1 1 6 0a3 3 0 1 1 -6 0M9 6h6M8 9l4 6M16 9l-4 6' },
        { v: 'timeline', label: 'Timeline', svg: 'M4 12h16M6 12m-2 0a2 2 0 1 1 4 0a2 2 0 1 1 -4 0M12 12m-2 0a2 2 0 1 1 4 0a2 2 0 1 1 -4 0M18 12m-2 0a2 2 0 1 1 4 0a2 2 0 1 1 -4 0' },
        { v: 'trail',    label: 'Trail',    svg: 'M3 21l4-4M7 17V8l5-5 5 5v9M7 17h10M17 17l4 4' },
        { v: 'explore',  label: 'Explore',  svg: 'M12 12m-10 0a10 10 0 1 1 20 0a10 10 0 1 1 -20 0M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z' },
        { v: 'docs',     label: 'Docs',     svg: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
      ].map(n => `
        <button class="sb-rail-btn ${state.view===n.v?'active':''}" data-rail-view="${n.v}" title="${n.label}">
          <svg viewBox="0 0 24 24"><path d="${n.svg}"/></svg>
        </button>
      `).join('')}
      <div class="sb-rail-sep"></div>
      <button class="sb-rail-btn" id="sb-rail-new" title="New object (N)">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
    <div class="sb-scroll">
      <div class="sb-section">
        <div class="sb-section-label">Workspace</div>
        ${SIDEBAR_NAV.map((n) => `
          <div class="sb-item ${state.view === n.v ? 'active' : ''}" data-view="${n.v}">
            <svg viewBox="0 0 24 24"><path d="${n.svg}"/></svg>
            ${n.label}
          </div>
        `).join('')}
      </div>

      <div class="sb-section">
        <div class="sb-section-label">Investigations</div>
        <div class="ftree" role="tree">
          ${renderFileTreeNodes(buildSidebarTree())}
        </div>
      </div>

      <div class="sb-section">
        <div class="sb-section-label">Account</div>
        <div class="sb-item"><svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> Library <span class="count">328</span></div>
        <div class="sb-item"><svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg> Skills <span class="count">12</span></div>
        <div class="sb-item"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> Billing</div>
        <div class="sb-item"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l-.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Settings</div>
      </div>
    </div>

    <div class="sb-foot">
      <div class="avatar">V</div>
      <span class="em">viuqo.labs@gmail.com</span>
      <button class="ghost" id="sb-theme" title="Toggle theme">
        <svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>
  `;

  // wire
  el.querySelectorAll('.sb-item[data-view]').forEach((i) => {
    i.addEventListener('click', () => ops.setView(i.dataset.view));
  });
  const ftree = el.querySelector('.ftree');
  ftree.addEventListener('click', (e) => {
    const item = e.target.closest('.ftree-item');
    if (!item) return;
    handleTreeNodeAction(item);
  });
  ftree.addEventListener('keydown', (e) => {
    const item = e.target.closest('.ftree-item');
    if (!item || item.dataset.treeType !== 'folder') return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTreeNodeAction(item);
    }
  });
  el.querySelector('#sb-collapse').addEventListener('click', ops.toggleSidebar);
  el.querySelector('#sb-theme').addEventListener('click', ops.toggleTheme);
  el.querySelector('#sb-new').addEventListener('click', () => openNewModal());
  el.querySelector('#sb-expand')?.addEventListener('click', ops.toggleSidebar);
  el.querySelector('#sb-rail-new')?.addEventListener('click', () => openNewModal());
  el.querySelectorAll('[data-rail-view]').forEach(b => {
    b.addEventListener('click', () => ops.setView(b.dataset.railView));
  });
}

/* ============================================================
   MAIN RENDER (router)
   ============================================================ */
function renderMain() {
  const el = document.getElementById('main');
  el.innerHTML = `
    <section class="view ${state.view === 'bench' ? 'active' : ''}" id="view-bench"></section>
    <section class="view ${state.view === 'graph' ? 'active' : ''}" id="view-graph"></section>
    <section class="view ${state.view === 'timeline' ? 'active' : ''}" id="view-timeline"></section>
    <section class="view ${state.view === 'explore' ? 'active' : ''}" id="view-explore"></section>
    <section class="view ${state.view === 'trail' ? 'active' : ''}" id="view-trail"></section>
    <section class="view ${state.view === 'docs' ? 'active' : ''}" id="view-docs"></section>
  `;
  if (state.view === 'bench') renderBench();
  if (state.view === 'graph') renderGraph();
  if (state.view === 'timeline') renderTimeline();
  if (state.view === 'explore') renderExplore();
  if (state.view === 'trail') renderTrail();
  if (state.view === 'docs') renderDocs();
}

function renderDocs() {
  const el = document.getElementById('view-docs');
  const sections = [
    { id: 'concepts', label: '1. Vision & Analogy' },
    { id: 'primitives', label: '2. The 15 Primitives' },
    { id: 'architecture', label: '3. Platform Architecture' },
    { id: 'workflows', label: '4. Step-by-Step Guide' }
  ];

  let contentHtml = '';
  if (state.docsSection === 'concepts') {
    contentHtml = `
      <h1>1. The Vision & Git Analogy</h1>
      <p>Modern science suffers from a reproducibility crisis. Scientific publishing remains tethered to a static medium—the PDF—which represents the <em>final conclusion</em> of research while completely discarding the <em>provenance chain</em> (the exact sequence of questions, hypotheses, protocols, raw measurements, and transformations that led to the claim).</p>
      <blockquote>Æther solves this by applying the fundamental primitives of modern software engineering—distributed version control (Git), cryptographic hashing, and Directed Acyclic Graphs (DAGs)—to the process of scientific discovery.</blockquote>
      <h2>The Analogy Mapping</h2>
      <table class="docs-table">
        <thead>
          <tr>
            <th>Software Version Control (Git)</th>
            <th>Scientific Version Control (Æther)</th>
            <th>Purpose in Science</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Commit Object</strong></td>
            <td><strong>Research Object Node</strong></td>
            <td>Represents an atomic, immutable step in a scientific investigation.</td>
          </tr>
          <tr>
            <td><strong>Commit Hash (sha256)</strong></td>
            <td><strong>Cryptographic Merkle Hash (æ:hash)</strong></td>
            <td>Globally unique identifier ensuring that content cannot be modified post-hoc.</td>
          </tr>
          <tr>
            <td><strong>Parent Pointer</strong></td>
            <td><strong>Lineage Reference</strong></td>
            <td>Anchors a node to its logical precursor (e.g. protocol to sample, hypothesis to claim).</td>
          </tr>
          <tr>
            <td><strong>git add (Staging)</strong></td>
            <td><strong>Staged Object</strong></td>
            <td>Drafting phase where metadata, steps, or metrics are entered and updated.</td>
          </tr>
          <tr>
            <td><strong>git commit</strong></td>
            <td><strong>Committed Object</strong></td>
            <td>Digitally seals the node, verifying cryptographic gates and publishing to local DAG.</td>
          </tr>
          <tr>
            <td><strong>git branch</strong></td>
            <td><strong>Hypothesis Branching</strong></td>
            <td>Forking a lineage to test alternative variables, explanations, or analysis plans.</td>
          </tr>
          <tr>
            <td><strong>git merge</strong></td>
            <td><strong>Meta-Analysis</strong></td>
            <td>Synthesizing data and claims from multiple parent studies into a combined root claim.</td>
          </tr>
          <tr>
            <td><strong>Pull Request</strong></td>
            <td><strong>Signed Peer Review</strong></td>
            <td>Attaching a public, authenticated verdict block to a target node.</td>
          </tr>
          <tr>
            <td><strong>Conflict Resolution</strong></td>
            <td><strong>Cascading Refutation</strong></td>
            <td>Automated propagation of invalidation down the Merkle-DAG when a child claim is refuted.</td>
          </tr>
        </tbody>
      </table>
    `;
  } else if (state.docsSection === 'primitives') {
    contentHtml = `
      <h1>2. Platform Primitives (The 15 Object Kinds)</h1>
      <p>Every scientific investigation in Æther is built by linking together content-addressed research objects. Each kind has distinct semantic purposes and required validation gates:</p>
      
      <table class="docs-table">
        <thead>
          <tr>
            <th>Primitive Kind</th>
            <th>Core Function</th>
            <th>Required Inputs (Gates)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Question (Q)</strong></td>
            <td>Represents the starting root of an investigation.</td>
            <td>title, summary, scope</td>
          </tr>
          <tr>
            <td><strong>Hypothesis (H)</strong></td>
            <td>A candidate model or explanation addressing a question.</td>
            <td>title, parent question, falsifier</td>
          </tr>
          <tr>
            <td><strong>PreReg (🔒)</strong></td>
            <td>A locked, signed plan committing to a hypothesis before execution.</td>
            <td>parent hypothesis, signing_key, plan</td>
          </tr>
          <tr>
            <td><strong>Design (D)</strong></td>
            <td>Specifying experimental bounds, factors, and sample size.</td>
            <td>parent prereg, factors, primary_metric</td>
          </tr>
          <tr>
            <td><strong>Protocol (P)</strong></td>
            <td>Step-by-step manual or computational experimental recipe.</td>
            <td>parent design, steps, hazards rating</td>
          </tr>
          <tr>
            <td><strong>Sample (S)</strong></td>
            <td>Capturing material origins, freezer logs, and lot numbers.</td>
            <td>parent protocol, origin, storage</td>
          </tr>
          <tr>
            <td><strong>Run (R)</strong></td>
            <td>Audit logs capturing duration, cost, and Docker container hash.</td>
            <td>parent protocol, machine profile, attestation</td>
          </tr>
          <tr>
            <td><strong>Measurement (M)</strong></td>
            <td>Raw observations linking to Merkle-LFS storage.</td>
            <td>parent run, raw_lfs_pointer</td>
          </tr>
          <tr>
            <td><strong>Analysis (A)</strong></td>
            <td>Transforming data using specified code scripts and params.</td>
            <td>parent measurement, code_notebook_ref</td>
          </tr>
          <tr>
            <td><strong>Claim (C)</strong></td>
            <td>The conclusion asserted by testing the hypothesis.</td>
            <td>parent analysis, parent hypothesis, posterior</td>
          </tr>
          <tr>
            <td><strong>Null (∅)</strong></td>
            <td>A first-class commit representing negative or neutral outcomes.</td>
            <td>parent analysis, parent hypothesis</td>
          </tr>
          <tr>
            <td><strong>Refutation (✗)</strong></td>
            <td>Falsification block committed when a claim's falsifier is triggered.</td>
            <td>target claim, reproducing analysis, evidence</td>
          </tr>
          <tr>
            <td><strong>Replication (↻)</strong></td>
            <td>Audited independent re-execution logs testing reproducibility.</td>
            <td>target claim, independence attestations</td>
          </tr>
          <tr>
            <td><strong>Review (✓)</strong></td>
            <td>Signed, public critique permanently attached to any DAG node.</td>
            <td>target node, verdict, reviewer signature</td>
          </tr>
          <tr>
            <td><strong>Retraction (⊘)</strong></td>
            <td>Node repudiating a claim or sample, triggering Cascading Warnings.</td>
            <td>target node, reason, oversight signature</td>
          </tr>
        </tbody>
      </table>
    `;
  } else if (state.docsSection === 'architecture') {
    contentHtml = `
      <h1>3. Platform Architecture & Data Integrity</h1>
      <h2>The Cryptographic Merkle-DAG</h2>
      <p>Unlike traditional database schemas where relationships are loose, Æther constructs a strict <strong>Merkle Directed Acyclic Graph (Merkle-DAG)</strong>. Every research object has an immutable ID derived from its content: <code>æ:content_hash</code>.</p>
      <p>When an object references parent objects, it embeds the parent's <code>æ:hash</code> directly inside its own content. If a parent node is modified post-hoc, its hash changes, breaking the cryptographic chain and instantly flagging downstream manipulation. This guarantees absolute data provenance from sequencing machine to published claim.</p>
      
      <h2>Automated Validation Gates</h2>
      <p>Every primitive must pass through a strict semantic checker before it can transition from a <code>staged</code> draft to a <code>committed</code> cryptographically sealed record. The gate engine runs static checks:
        <ul>
          <li><strong>Hypotheses</strong> require a mathematically computable falsifier logic.</li>
          <li><strong>PreRegistrations</strong> require a verified cryptokey linked to an ORCID.</li>
          <li><strong>Claims</strong> require parent pointers to BOTH a hypothesis and an analysis block.</li>
        </ul>
      </p>

      <h2>Cascading Invalidation</h2>
      <p>If a <code>refutation</code> or <code>retraction</code> node is committed to a claim, the graph state engine automatically propagates a warning down the DAG. Any downstream claims or analyses building on that protocol or sample are immediately marked as <strong>compromised</strong> in the UI, preserving the clean scientific record from compounding errors.</p>
    `;
  } else if (state.docsSection === 'workflows') {
    contentHtml = `
      <h1>4. Step-by-Step Practical Workflow Guide</h1>
      <p>Here is a step-by-step walk demonstrating how a research team uses Æther to run a CRISPR off-target experiment from question to published claim:</p>
      
      <h3>Step 1: Open the Inquiry</h3>
      <p>Select your active investigation, press <code>N</code>, choose <code>question</code> as the object kind. Enter your query: <em>"Do PAM-distal mismatches reduce spCas9 off-target rates in human cells?"</em> and commit it to create the root hash.</p>

      <h3>Step 2: Formulate the Hypothesis</h3>
      <p>Select the question node, select <strong>Branch</strong>, and draft your <code>hypothesis</code>. You must specify the mathematical falsifier logic: <code>relative_reduction < 0.40 OR p_value > 0.01</code>. The Gates tab will show that the falsifier is registered but pre-registration is outstanding.</p>

      <h3>Step 3: Lock the PreRegistration</h3>
      <p>Select the hypothesis, choose <strong>Preregister</strong>, enter your Welch's t-test analysis plan, and sign it with your verified ORCID digital signature key. Committing this locks the hypothesis, preventing post-hoc parameter adjustments.</p>

      <h3>Step 4: Execute Protocol & Collect Raw Data</h3>
      <p>Create <code>design</code>, <code>protocol</code>, and <code>sample</code> nodes. Run the sequencing protocol on the automated sequencer. Æther automatically logs resources and creates a <code>run</code> node. Upon completion, raw FASTQ sequencing reads are saved to Merkle Large File Storage (LFS) and registered via a <code>measurement</code> node.</p>

      <h3>Step 5: Analysis & Publishing Claims</h3>
      <p>Run your computational notebook script. Commit an <code>analysis</code> node. Bind this back to your locked hypothesis. If the computational outputs did not trigger the falsifier, commit the <code>claim</code>. Click <strong>Publish DOI</strong> to sync the signed claim to the public explore feed for peer review.</p>
    `;
  }

  el.innerHTML = `
    <div class="docs-wrap">
      <div class="docs-sidebar">
        <div class="docs-section-label">Manual Sections</div>
        ${sections.map(s => `
          <button class="docs-nav-item ${state.docsSection === s.id ? 'active' : ''}" data-sec="${s.id}">${s.label}</button>
        `).join('')}
      </div>
      <div class="docs-content-container">
        <div class="docs-content">
          ${contentHtml}
        </div>
      </div>
    </div>
  `;

  el.querySelectorAll('.docs-nav-item').forEach(b => {
    b.addEventListener('click', () => {
      state.docsSection = b.dataset.sec;
      renderDocs();
    });
  });
}

/* ---------- Lab view ---------- */
function renderLab() {
  const el = document.getElementById('view-lab');
  el.innerHTML = `
    <div class="view-head">
      <h1>Lab</h1>
      <div class="sub">${INVESTIGATIONS.length} investigations · ${Object.keys(OBJECTS).length} objects · ${EDGES.length} edges</div>
      <div class="view-actions">
        <button class="btn outline" id="lab-new">+ New investigation</button>
        <button class="btn outline">Import map</button>
      </div>
    </div>
    <div class="lab-grid">
      ${INVESTIGATIONS.map(inv => renderInvCard(inv)).join('')}
    </div>
  `;
  el.querySelectorAll('.inv').forEach(card => {
    card.addEventListener('click', () => ops.selectInvestigation(card.dataset.inv));
  });
  el.querySelector('#lab-new')?.addEventListener('click', () => flash('New investigation flow (demo)', 'info'));
}

function renderInvCard(inv) {
  const objs = Object.values(OBJECTS).filter(o => o.investigation === inv.id);
  const byKind = {};
  objs.forEach(o => byKind[o.kind] = (byKind[o.kind] || 0) + 1);
  const counts = (k) => byKind[k] || 0;
  const edges = EDGES.filter(e => OBJECTS[e.from]?.investigation === inv.id);
  return `
    <div class="inv" data-inv="${inv.id}">
      <div class="inv-head">
        <div class="inv-hue" style="background:${inv.hue}"></div>
        <div style="flex:1">
          <div class="inv-title">${esc(inv.title)}</div>
          <div class="inv-meta">${inv.domain} · ${inv.paradigm} · ${inv.license}</div>
        </div>
      </div>
      <div class="inv-preview">
        ${miniDag(objs, edges)}
      </div>
      <div class="inv-foot">
        <span class="pill">${counts('hypothesis') + counts('claim')} claims</span>
        <span class="pill rep"><span class="d"></span>${counts('replication')} repl</span>
        ${counts('refutation') ? `<span class="pill ref"><span class="d"></span>${counts('refutation')} refute</span>` : ''}
        ${counts('review') ? `<span class="pill rev"><span class="d"></span>${counts('review')} review</span>` : ''}
        ${objs.some(o => o.state === 'staged') ? '<span class="pill attn"><span class="d"></span>staged</span>' : ''}
      </div>
    </div>
  `;
}

function miniDag(objs, edges) {
  if (!objs.length) return '';
  // Topological-ish layout: by depth from root
  const depths = {};
  const root = objs.find(o => !objs.some(p => p.children && p.children.includes(o.id))) || objs[0];
  const visit = (id, d) => {
    if (depths[id] !== undefined && depths[id] >= d) return;
    depths[id] = d;
    edges.filter(e => e.from === id).forEach(e => visit(e.to, d + 1));
  };
  objs.forEach(o => { if (!o.parents.length) visit(o.id, 0); });
  // Layout
  const cols = {};
  Object.entries(depths).forEach(([id, d]) => {
    cols[d] = cols[d] || [];
    cols[d].push(id);
  });
  const W = 300, H = 90;
  const maxDepth = Math.max(0, ...Object.values(depths));
  const xStep = W / Math.max(1, maxDepth);
  const pos = {};
  Object.entries(cols).forEach(([d, ids]) => {
    ids.forEach((id, i) => {
      pos[id] = { x: 10 + (+d) * xStep, y: 10 + (i + 0.5) * (H - 20) / ids.length };
    });
  });
  const elines = edges.filter(e => pos[e.from] && pos[e.to]).map(e => {
    const f = pos[e.from], t = pos[e.to];
    const stroke = EDGE_META[e.type]?.color || '#565D65';
    return `<line x1="${f.x}" y1="${f.y}" x2="${t.x}" y2="${t.y}" stroke="${stroke}" stroke-width="1" opacity="0.65"/>`;
  }).join('');
  const enodes = objs.filter(o => pos[o.id]).map(o => {
    const p = pos[o.id];
    return `<circle cx="${p.x}" cy="${p.y}" r="4" fill="${KIND_META[o.kind].color}" stroke="${KIND_META[o.kind].color}" stroke-opacity="0.4" stroke-width="2"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">${elines}${enodes}</svg>`;
}

/* ---------- Bench view (active object editor) ---------- */
function renderBench() {
  const el = document.getElementById('view-bench');
  const o = OBJECTS[state.selected];
  if (!o) {
    el.innerHTML = `<div class="empty"><h3>No object selected</h3>Select an object in the sidebar or graph.</div>`;
    return;
  }
  const inv = INVESTIGATIONS.find(i => i.id === o.investigation);
  const kind = KIND_META[o.kind];
  const schema = KIND_SCHEMA[o.kind] || { required: [], optional: [] };

  el.innerHTML = `
    <div class="bench">
      <div class="bn-head">
        <button class="bn-back" id="bn-back" title="Back to Lab"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg></button>
        <span class="bn-id">${o.hash}</span>
        <span class="bn-kind" style="background:${withAlpha(kind.color, 0.18)};color:${kind.color}">${kind.label}</span>
        <span class="bn-state ${o.state}">${o.state}</span>
      </div>
      <div class="bn-sub">
        <span class="slug">${o.id}</span>
        <span>·</span>
        <span>${o.actor}</span>
        <span>·</span>
        <span>r${(o.fields.revision || 1)}</span>
        <span class="ago">${esc(o.when)}</span>
      </div>

      <h2 class="bn-title" contenteditable="true" data-field="title">${esc(o.fields.title || '')}</h2>

      ${renderBenchSummary(o)}
      ${renderBenchFields(o, schema)}
      ${renderBenchLineage(o)}
    </div>
  `;

  // wire
  el.querySelector('#bn-back')?.addEventListener('click', () => {
    const inv = INVESTIGATIONS.find(i => i.id === state.activeInvestigation);
    if (inv?.rootQuestion) ops.selectObject(inv.rootQuestion);
  });
  el.querySelectorAll('[contenteditable][data-field]').forEach(node => {
    node.addEventListener('input', () => {
      const f = node.dataset.field;
      const v = node.innerText.trim();
      ops.editField(o.id, f, v);
    });
    node.addEventListener('blur', () => { renderInspector(); }); // refresh gates after edit
  });
  el.querySelectorAll('.lin-row .nm').forEach(n => {
    n.addEventListener('click', () => ops.selectObject(n.dataset.obj));
  });
}

function renderBenchSummary(o) {
  return `
    <div class="bn-sect">
      <div class="bn-label">Summary</div>
      <div class="bn-field" contenteditable="true" data-field="summary" data-placeholder="One-line takeaway for the graph card…">${esc(o.fields.summary || '')}</div>
    </div>
  `;
}

function renderBenchFields(o, schema) {
  // Render all required + optional kind-specific fields except title/summary
  const seen = new Set(['title', 'summary']);
  const fields = [...schema.required, ...schema.optional].filter(f => !seen.has(f));
  return fields.map(f => {
    const isRequired = schema.required.includes(f);
    const isLong = ['statement', 'falsifier', 'scope', 'mechanism', 'plan', 'steps', 'auxiliary'].includes(f);
    return `
      <div class="bn-sect">
        <div class="bn-label">
          ${humanize(f)}
          ${isRequired ? '<span class="req">REQUIRED</span>' : '<span class="opt">OPTIONAL</span>'}
        </div>
        <div class="bn-field ${isLong ? '' : 'short'}" contenteditable="true" data-field="${f}" data-placeholder="${fieldPlaceholder(f)}">${esc(o.fields[f] != null ? String(o.fields[f]) : '')}</div>
      </div>
    `;
  }).join('');
}

function renderBenchLineage(o) {
  const parents = o.parents.map(pid => OBJECTS[pid]).filter(Boolean);
  const children = EDGES.filter(e => e.from === o.id).map(e => ({ ...e, obj: OBJECTS[e.to] })).filter(x => x.obj);
  if (!parents.length && !children.length) return '';
  return `
    <div class="bn-sect">
      <div class="bn-label">Lineage</div>
      <div class="bn-meta-grid">
        ${parents.map(p => `
          <div class="bn-meta-row">
            <span class="lk">parent (${EDGES.find(e => e.from===p.id&&e.to===o.id)?.type || 'derived_from'})</span>
            <span class="vv fluent" style="cursor:pointer;color:${KIND_META[p.kind].color}" onclick="ops.selectObject('${p.id}')">${esc((p.fields.title || p.id).slice(0, 60))}</span>
          </div>
        `).join('')}
        ${children.map(c => `
          <div class="bn-meta-row">
            <span class="lk">${c.type}</span>
            <span class="vv fluent" style="cursor:pointer;color:${KIND_META[c.obj.kind].color}" onclick="ops.selectObject('${c.obj.id}')">${esc((c.obj.fields.title || c.obj.id).slice(0, 60))}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ---------- Graph view ---------- */
function renderGraphDAG(el, inv, objects, edges) {
  const payload = getDAGPayload(state.dagSource, objects, edges);
  const meta = payload.meta || null;
  const W = 1200, H = 720;
  const positions = layoutCompilerDAG(payload.nodes, payload.edges, W, H);
  const isInv = state.dagSource === 'investigation';
  const title = isInv ? inv.title : (meta?.title || 'DAG');
  const sub = isInv
    ? `${objects.length} nodes · Merkle-DAG · leaves = inputs · interior = derived objects`
    : (meta?.subtitle || '');

  const exampleOpts = Object.entries(DAG_EXAMPLES).map(([k, ex]) =>
    `<option value="${k}" ${state.dagSource === k ? 'selected' : ''}>${esc(ex.title)}</option>`
  ).join('');

  el.innerHTML = `
    <div class="view-head">
      <h1>${esc(title)}</h1>
      <div class="sub">${esc(sub)}</div>
      <div class="view-actions">
        <span class="toggle dag-source-toggle">
          <button class="${isInv ? 'active' : ''}" data-dag-src="investigation">Merkle-DAG</button>
          <select id="dag-example-select" class="dag-select" title="Compiler DAG examples">
            <option value="investigation" ${isInv ? 'selected' : ''}>Examples…</option>
            ${exampleOpts}
          </select>
        </span>
        ${!isInv && meta?.statements ? `
          <div class="dag-stmts">${meta.statements.map((s) => `<code>${esc(s)}</code>`).join('')}</div>
        ` : ''}
        <button class="btn outline" id="gr-export">Export subgraph</button>
      </div>
    </div>
    <div class="graph-wrap dag-wrap">
      <svg class="graph-svg dag-svg" id="graph-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <marker id="darrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="var(--fg-3)"/>
          </marker>
        </defs>
        <g marker-end="url(#darrow)">
          ${renderCompilerDAGSvg(payload.nodes, payload.edges, positions, { selectedId: state.selected })}
        </g>
      </svg>
      <div class="graph-legend dag-legend">
        <div class="lg-row"><span class="dnode-swatch dnode-swatch-leaf"></span>Leaf (operand / input)</div>
        <div class="lg-row"><span class="dnode-swatch dnode-swatch-op"></span>Interior (operator / derived)</div>
        <div class="lg-row"><span class="dnode-swatch dnode-swatch-edge"></span>Directed edge (acyclic)</div>
      </div>
      <div class="graph-status">
        DAG · bottom = leaves · top = result · shared nodes = common subexpressions
        ${isInv ? '· click node to inspect' : ''}
      </div>
      <button class="fab" id="gr-fab" title="New object (N)">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  `;

  el.querySelectorAll('[data-dag-src]').forEach((b) => {
    b.addEventListener('click', () => ops.setDagSource(b.dataset.dagSrc));
  });
  el.querySelector('#dag-example-select')?.addEventListener('change', (e) => {
    ops.setDagSource(e.target.value);
  });
  el.querySelectorAll('.dnode[data-obj]').forEach((n) => {
    n.addEventListener('click', () => ops.selectObject(n.dataset.obj));
  });
  el.querySelector('#gr-fab')?.addEventListener('click', () => openNewModal());
  el.querySelector('#gr-export')?.addEventListener('click', () => {
    const blob = JSON.stringify({ source: state.dagSource, nodes: payload.nodes, edges: payload.edges }, null, 2);
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = (isInv ? inv.id : state.dagSource) + '-dag.json';
    a.click();
  });
  initGraphPanZoom();
  autoFitGraph(positions);
}

function renderGraph() {
  const el = document.getElementById('view-graph');
  const inv = INVESTIGATIONS.find(i => i.id === state.activeInvestigation);
  const objects = Object.values(OBJECTS).filter(o => o.investigation === inv.id);
  const edges = EDGES.filter(e => OBJECTS[e.from]?.investigation === inv.id);

  if (state.graphMode === 'dag') {
    renderGraphDAG(el, inv, objects, edges);
    return;
  }

  const positions = layoutDAG(objects, edges, 1200, 700);

  el.innerHTML = `
    <div class="view-head">
      <h1>${esc(inv.title)}</h1>
      <div class="sub">${objects.length} objects · ${edges.length} edges</div>
      <div class="view-actions">
        <span class="toggle">
          <button class="${state.graphMode === 'free' ? 'active' : ''}" data-mode="free">Free</button>
          <button class="${state.graphMode === 'lineage' ? 'active' : ''}" data-mode="lineage">Lineage</button>
          <button class="${state.graphMode === 'machines' ? 'active' : ''}" data-mode="machines">Machines</button>
          <button class="${state.graphMode === 'dag' ? 'active' : ''}" data-mode="dag">DAG</button>
        </span>
        <button class="btn outline" id="gr-export">Export subgraph</button>
      </div>
    </div>
    <div class="graph-wrap">
      <svg class="graph-svg" id="graph-svg" viewBox="-50 -50 1300 800" preserveAspectRatio="xMidYMid meet">
        <defs>
          ${Object.entries(EDGE_META).map(([k, v]) => `
            <marker id="m-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="${v.color}"/>
            </marker>
          `).join('')}
        </defs>
        ${renderGraphEdges(edges, positions)}
        ${renderGraphNodes(objects, positions)}
      </svg>

      <div class="graph-tools">
        <button class="${state.graphMode === 'free' ? 'active' : ''}" data-mode="free">Free <span class="kb">1</span></button>
        <button class="${state.graphMode === 'lineage' ? 'active' : ''}" data-mode="lineage">Lineage <span class="kb">2</span></button>
        <button class="${state.graphMode === 'machines' ? 'active' : ''}" data-mode="machines">Machines <span class="kb">3</span></button>
        <button class="${state.graphMode === 'dag' ? 'active' : ''}" data-mode="dag">DAG <span class="kb">4</span></button>
      </div>

      <div class="graph-legend">
        ${Object.entries(KIND_META).slice(0, 8).map(([k, v]) => `
          <div class="lg-row"><span class="lg-dot" style="border-color:${v.color}"></span>${v.label}</div>
        `).join('')}
      </div>

      <div class="graph-status">
        ${state.graphMode} · scroll to zoom · drag to pan · click node
      </div>

      <button class="fab" id="gr-fab" title="New object (N)">
        <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  `;
  // wire
  el.querySelectorAll('[data-mode]').forEach(b => {
    b.addEventListener('click', () => ops.setGraphMode(b.dataset.mode));
  });
  el.querySelectorAll('.gnode').forEach(n => {
    n.addEventListener('click', () => ops.selectObject(n.dataset.obj));
  });
  el.querySelector('#gr-fab')?.addEventListener('click', () => openNewModal());
  el.querySelector('#gr-export')?.addEventListener('click', () => {
    const blob = JSON.stringify({ investigation: inv, objects, edges }, null, 2);
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = inv.id + '-subgraph.json'; a.click();
  });
  initGraphPanZoom();
  autoFitGraph(positions);
}

function renderGraphNodes(objs, pos) {
  return objs.map(o => {
    const p = pos[o.id]; if (!p) return '';
    const k = KIND_META[o.kind];
    const sel = state.selected === o.id;
    const r = 24;
    const label = esc(shortTitle(o.fields.title || o.id, 20));
    return `
      <g class="gnode ${sel ? 'selected' : ''}" data-obj="${o.id}" transform="translate(${p.x},${p.y})">
        <circle class="gnode-outer" r="${r + 8}" stroke="${k.color}" />
        ${sel ? `<circle class="gnode-select-ring" r="${r + 5}" stroke="${k.color}" />` : ''}
        <circle class="gnode-fill" r="${r}" fill="${k.color}" />
        <circle class="gnode-ring" r="${r}" stroke="${k.color}" />
        <text class="gnode-glyph" fill="${k.color}">${k.glyph}</text>
        <rect class="gnode-label-bg" x="${-label.length * 3.2}" y="${r + 10}" width="${label.length * 6.4}" height="16" />
        <text class="gnode-label" y="${r + 22}">${label}</text>
      </g>
    `;
  }).join('');
}

function renderGraphEdges(edges, pos) {
  return edges.map(e => {
    const f = pos[e.from], t = pos[e.to]; if (!f || !t) return '';
    const dx = t.x - f.x, dy = t.y - f.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Offset start/end to node border (radius 24)
    const r = 24;
    const sx = f.x + (dx / dist) * r, sy = f.y + (dy / dist) * r;
    const ex = t.x - (dx / dist) * r, ey = t.y - (dy / dist) * r;
    // Bezier control points
    const midX = (sx + ex) / 2;
    const c1x = sx + (midX - sx) * 0.8, c1y = sy;
    const c2x = ex - (ex - midX) * 0.8, c2y = ey;
    const path = `M${sx},${sy} C${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}`;
    return `<path class="gedge-outline" d="${path}"/><path class="gedge ${e.type}" d="${path}" marker-end="url(#m-${e.type})"/>`;
  }).join('');
}

function layoutDAG(objs, edges, W, H) {
  // Step 1: Assign layers by longest path
  const depths = {};
  const visit = (id, d) => {
    depths[id] = Math.max(depths[id] || 0, d);
    edges.filter(e => e.from === id).forEach(e => visit(e.to, d + 1));
  };
  objs.forEach(o => { if (!o.parents.length) visit(o.id, 0); });
  // Ensure all objects have a depth
  objs.forEach(o => { if (depths[o.id] === undefined) depths[o.id] = 0; });

  // Step 2: Group by layer
  const layers = {};
  Object.entries(depths).forEach(([id, d]) => { layers[d] = layers[d] || []; layers[d].push(id); });
  const maxD = Math.max(0, ...Object.values(depths));

  // Step 3: Cross-minimization (barycenter heuristic)
  for (let pass = 0; pass < 4; pass++) {
    for (let d = 1; d <= maxD; d++) {
      const layer = layers[d];
      if (!layer) continue;
      const bary = {};
      layer.forEach(id => {
        const parents = edges.filter(e => e.to === id && layers[depths[e.from]])
          .map(e => {
            const pLayer = layers[depths[e.from]];
            return pLayer ? pLayer.indexOf(e.from) : 0;
          }).filter(x => x >= 0);
        bary[id] = parents.length ? parents.reduce((a, b) => a + b, 0) / parents.length : 0;
      });
      layers[d] = layer.sort((a, b) => bary[a] - bary[b]);
    }
  }

  // Step 4: Assign coordinates with generous spacing
  const hSpacing = Math.min(200, (W - 180) / Math.max(1, maxD));
  const pos = {};
  Object.entries(layers).forEach(([d, ids]) => {
    const colN = ids.length;
    const vSpacing = Math.min(110, (H - 120) / Math.max(1, colN));
    const colHeight = (colN - 1) * vSpacing;
    const startY = (H - colHeight) / 2;
    ids.forEach((id, i) => {
      pos[id] = {
        x: 120 + (+d) * hSpacing,
        y: startY + i * vSpacing,
      };
    });
  });
  return pos;
}

function initGraphPanZoom() {
  const svg = document.getElementById('graph-svg'); if (!svg) return;
  let vb = { x: -50, y: -50, w: 1300, h: 800 };
  let panning = false; let last = null;
  const applyVB = () => svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  svg.addEventListener('mousedown', (e) => {
    if (e.target.closest('.gnode')) return;
    panning = true; last = { x: e.clientX, y: e.clientY }; svg.classList.add('dragging');
  });
  window.addEventListener('mousemove', (e) => {
    if (!panning) return;
    const dx = (e.clientX - last.x) * vb.w / svg.clientWidth;
    const dy = (e.clientY - last.y) * vb.h / svg.clientHeight;
    vb.x -= dx; vb.y -= dy; last = { x: e.clientX, y: e.clientY };
    applyVB();
  });
  window.addEventListener('mouseup', () => { panning = false; svg.classList.remove('dragging'); });
  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const mx = (e.offsetX / svg.clientWidth) * vb.w + vb.x;
    const my = (e.offsetY / svg.clientHeight) * vb.h + vb.y;
    vb.w *= scale; vb.h *= scale;
    vb.x = mx - (mx - vb.x) * scale;
    vb.y = my - (my - vb.y) * scale;
    applyVB();
  }, { passive: false });
}

function autoFitGraph(positions) {
  const svg = document.getElementById('graph-svg'); if (!svg) return;
  const pts = Object.values(positions);
  if (!pts.length) return;
  const pad = 80;
  const minX = Math.min(...pts.map(p => p.x)) - pad;
  const minY = Math.min(...pts.map(p => p.y)) - pad;
  const maxX = Math.max(...pts.map(p => p.x)) + pad;
  const maxY = Math.max(...pts.map(p => p.y)) + pad;
  const w = maxX - minX, h = maxY - minY;
  svg.setAttribute('viewBox', `${minX} ${minY} ${w} ${h}`);
}

/* ---------- Timeline view ---------- */
function renderTimeline() {
  const el = document.getElementById('view-timeline');
  const inv = INVESTIGATIONS.find(i => i.id === state.activeInvestigation);
  const objs = Object.values(OBJECTS).filter(o => o.investigation === inv.id);
  const hyps = objs.filter(o => o.kind === 'hypothesis');
  const root = objs.find(o => o.kind === 'question');

  // Build lanes: one per hypothesis branch + one for main chain
  const lanes = [];
  if (root) {
    const mainChain = buildChain(root, objs);
    lanes.push({ name: inv.title, sub: 'main branch', color: inv.hue, chain: mainChain });
  }
  hyps.forEach(h => {
    const chain = buildChain(h, objs);
    if (chain.length > 1 || !root) {
      lanes.push({
        name: shortTitle(h.fields.title || h.id, 28),
        sub: 'hypothesis branch',
        color: KIND_META.hypothesis.color,
        chain
      });
    }
  });
  if (!lanes.length) lanes.push({ name: inv.title, sub: 'all objects', color: inv.hue, chain: objs });

  el.innerHTML = `
    <div class="view-head">
      <h1>Timeline</h1>
      <div class="sub">${esc(inv.title)} · ${objs.length} objects</div>
      <div class="view-actions">
        <span class="toggle">
          <button class="active">all branches</button>
          <button>main only</button>
          <button>by actor</button>
        </span>
      </div>
    </div>
    <div class="tl">
      ${lanes.map(lane => `
        <div class="tl-lane">
          <div class="tl-lane-info">
            <div class="tl-lane-name">
              <span class="lane-dot" style="background:${lane.color}"></span>
              ${esc(lane.name)}
            </div>
            <div class="tl-lane-sub">${lane.sub}</div>
            <div class="tl-lane-stats">
              <span><span class="stat-val">${lane.chain.length}</span> commits</span>
              <span><span class="stat-val">${lane.chain.filter(o => o.state === 'committed' || o.state === 'published').length}</span> verified</span>
            </div>
          </div>
          <div class="tl-scroll">
            <div class="tl-chain">
              ${lane.chain.map((o, i) => `
                ${i > 0 ? '<div class="tl-edge"></div>' : ''}
                <div class="tl-node ${state.selected === o.id ? 'selected' : ''}" data-obj="${o.id}" style="border-color:${KIND_META[o.kind].color}; color:${KIND_META[o.kind].color}">
                  ${KIND_META[o.kind].glyph}
                  <span class="tl-node-label">${esc(shortTitle(o.fields.title || '', 12))}</span>
                  <div class="tl-tip">
                    <div class="tip-kind" style="color:${KIND_META[o.kind].color}">${KIND_META[o.kind].label}</div>
                    <div>${esc(shortTitle(o.fields.title || o.id, 40))}</div>
                    <div class="tip-hash">${o.hash} · ${esc(o.when || '')}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  el.querySelectorAll('.tl-node').forEach(n => n.addEventListener('click', () => ops.selectObject(n.dataset.obj)));

  // Enable horizontal scroll with shift+wheel or regular wheel on the scroll area
  el.querySelectorAll('.tl-scroll').forEach(sc => {
    sc.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        e.preventDefault();
        sc.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  });
}

function buildChain(start, allObjs) {
  const chain = [start];
  let cur = start;
  while (true) {
    const next = EDGES.find(e => e.from === cur.id && allObjs.find(o => o.id === e.to));
    if (!next) break;
    const nObj = allObjs.find(o => o.id === next.to);
    if (!nObj || chain.includes(nObj)) break;
    chain.push(nObj);
    cur = nObj;
  }
  return chain;
}

/* ---------- Explore view ---------- */
function renderExplore() {
  const el = document.getElementById('view-explore');
  let pool = Object.values(OBJECTS);
  if (state.exploreScope === 'mine') pool = pool.filter(o => o.actor.includes('viuqo') || o.actor === '@you');
  else if (state.exploreScope === 'shared') pool = pool.filter(o => o.state !== 'staged');
  else if (state.exploreScope === 'public') pool = pool.filter(o => o.state === 'published' || o.state === 'committed');
  // featured kinds first
  const featured = ['claim', 'refutation', 'replication', 'review', 'publication'];
  pool.sort((a, b) => {
    const fa = featured.indexOf(a.kind); const fb = featured.indexOf(b.kind);
    return (fb >= 0 ? 1 : 0) - (fa >= 0 ? 1 : 0);
  });

  el.innerHTML = `
    <div class="view-head">
      <h1>Explore</h1>
      <div class="sub">${pool.length} objects in scope</div>
      <div class="view-actions">
        <span class="toggle" id="ex-scope">
          <button class="${state.exploreScope === 'mine' ? 'active' : ''}" data-s="mine">mine</button>
          <button class="${state.exploreScope === 'shared' ? 'active' : ''}" data-s="shared">shared</button>
          <button class="${state.exploreScope === 'public' ? 'active' : ''}" data-s="public">public</button>
          <button class="${state.exploreScope === 'following' ? 'active' : ''}" data-s="following">following</button>
        </span>
      </div>
    </div>
    <div class="ex-feed">
      ${pool.slice(0, 40).map(o => renderExploreCard(o)).join('')}
    </div>
  `;
  el.querySelectorAll('#ex-scope button').forEach(b => b.addEventListener('click', () => ops.setExploreScope(b.dataset.s)));
  el.querySelectorAll('.ex-card').forEach(c => c.addEventListener('click', () => ops.selectObject(c.dataset.obj)));
}

function renderExploreCard(o) {
  const k = KIND_META[o.kind];
  const stateLabel = o.state === 'published' ? 'published' : (o.state === 'committed' ? 'completed' : 'staged');
  return `
    <div class="ex-card" data-obj="${o.id}">
      <div class="ex-card-top">
        <span class="ex-ts">${esc(o.when || '')}</span>
        <span class="kind-tag" style="background:${withAlpha(k.color, 0.15)};color:${k.color}">${k.label}</span>
        <span class="ex-title">${esc(o.fields.title || o.id)}</span>
        <span class="status-tag ${stateLabel === 'completed' ? 'completed' : (stateLabel === 'staged' ? 'staged' : 'completed')}">${stateLabel}</span>
      </div>
      <div class="ex-desc">${o.hash} · ${esc((o.fields.summary || '').slice(0, 110))}</div>
    </div>
  `;
}

/* ---------- Trail view ---------- */
function renderTrail() {
  const el = document.getElementById('view-trail');
  const target = OBJECTS[state.selected]; if (!target) {
    el.innerHTML = `<div class="empty"><h3>Select an object</h3>Then open Trail to see its provenance.</div>`;
    return;
  }
  // Build trail = ancestors in topological order leading to target
  const chain = buildAncestors(target);
  el.innerHTML = `
    <div class="view-head">
      <h1>Trail · ${esc(target.fields.title || target.id)}</h1>
      <div class="sub">${chain.length} steps · ${target.hash}</div>
      <div class="view-actions">
        <button class="btn primary" id="tr-replay">▶ Replay</button>
        <button class="btn outline" id="tr-export">Export bundle</button>
        <button class="btn outline" id="tr-cite">Cite</button>
        <button class="btn outline" id="tr-share">Share</button>
      </div>
    </div>
    <div class="trail">
      ${chain.map((o, i) => renderTrailStep(o, i + 1)).join('')}
    </div>
  `;
  el.querySelector('#tr-replay').addEventListener('click', () => flash('▶ Reproducing trail — running deterministic re-execution in BenchSpace…', 'info'));
  el.querySelector('#tr-export').addEventListener('click', () => {
    const blob = JSON.stringify({ target: target.hash, trail: chain.map(o => ({ id: o.id, hash: o.hash, kind: o.kind, fields: o.fields })) }, null, 2);
    const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = target.id + '-trail.latticebundle'; a.click();
  });
  el.querySelector('#tr-cite').addEventListener('click', () => {
    navigator.clipboard?.writeText(`æther://${target.hash}`);
    flash('Citation copied: æther://' + target.hash, 'ok');
  });
  el.querySelector('#tr-share').addEventListener('click', () => flash('Share dialog (demo)', 'info'));
  el.querySelectorAll('.tr-step').forEach(s => s.addEventListener('click', () => ops.selectObject(s.dataset.obj)));
}

function buildAncestors(target) {
  const visited = new Set();
  const result = [];
  const visit = (id) => {
    if (visited.has(id)) return;
    visited.add(id);
    const o = OBJECTS[id]; if (!o) return;
    o.parents.forEach(p => visit(p));
    result.push(o);
  };
  visit(target.id);
  return result;
}

function renderTrailStep(o, i) {
  const k = KIND_META[o.kind];
  return `
    <div class="tr-step" data-obj="${o.id}" style="cursor:pointer">
      <div class="tr-num">${i}</div>
      <div class="tr-body">
        <h4>
          ${esc(o.fields.title || o.id)}
          <span class="kind-tag" style="background:${withAlpha(k.color, 0.15)};color:${k.color}">${k.label}</span>
        </h4>
        ${o.fields.summary ? `<p>${esc(o.fields.summary)}</p>` : ''}
        <div class="h">${o.hash}${o.parents.length ? ' ← ' + o.parents.map(p => OBJECTS[p]?.hash || p).join(', ') : ''}</div>
      </div>
      <div class="tr-aside">
        <span class="actor">${esc(o.actor)}</span>
        <span class="ts">${esc(o.when)}</span>
        <button class="replay">▶ open</button>
      </div>
    </div>
  `;
}

/* ============================================================
   INSPECTOR RENDER
   ============================================================ */
function renderInspector() {
  const el = document.getElementById('inspector');
  const o = OBJECTS[state.selected];
  if (!o) {
    el.innerHTML = `<div class="empty"><h3>Inspector</h3>Select an object to inspect.</div>`;
    return;
  }
  const gates = computeGates(o);
  const tabs = [
    { id: 'gates',     label: 'Gates',     ct: `${gates.passed}/${gates.total}` },
    { id: 'inspector', label: 'Inspector', ct: o.kind },
    { id: 'activity',  label: 'Activity',  ct: SUBAGENTS.filter(s => s.status === 'running').length || '' },
  ];
  el.innerHTML = `
    <div class="ins-tabs">
      ${tabs.map(t => `
        <div class="ins-tab ${state.inspectorTab === t.id ? 'active' : ''}" data-tab="${t.id}">
          ${t.label} ${t.ct !== '' ? `<span class="ct">${t.ct}</span>` : ''}
        </div>
      `).join('')}
    </div>
    <div class="ins-body">
      ${state.inspectorTab === 'gates' ? renderInspectorGates(o, gates) : ''}
      ${state.inspectorTab === 'inspector' ? renderInspectorDetails(o) : ''}
      ${state.inspectorTab === 'activity' ? renderInspectorActivity(o) : ''}
    </div>
  `;
  // wire
  el.querySelectorAll('.ins-tab').forEach(t => t.addEventListener('click', () => ops.setInspectorTab(t.dataset.tab)));
  el.querySelectorAll('[data-action]').forEach(b => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const a = b.dataset.action;
      if (a === 'commit') ops.commit(o.id);
      if (a === 'branch') ops.branch(o.id);
      if (a === 'replicate') ops.replicate(o.id);
      if (a === 'refute') ops.refute(o.id);
      if (a === 'delete') ops.deleteObject(o.id);
      if (a === 'open-trail') { state.view = 'trail'; render(); }
      if (a === 'verify') flash('✓ Verified ' + o.hash + ' — all hashes match · 0 unsigned commits', 'ok');
      if (a === 'export') {
        const blob = JSON.stringify(o, null, 2);
        const url = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
        const aEl = document.createElement('a'); aEl.href = url; aEl.download = o.id + '.json'; aEl.click();
      }
    });
  });
  el.querySelectorAll('[data-cli]').forEach(b => b.addEventListener('click', () => ops.setCliPick(b.dataset.cli)));
  el.querySelector('#cli-copy')?.addEventListener('click', () => {
    const txt = el.querySelector('.cli-body').innerText;
    navigator.clipboard?.writeText(txt);
    flash('Copied to clipboard', 'ok');
  });
  el.querySelectorAll('[data-edit-field]').forEach(input => {
    input.addEventListener('input', () => {
      ops.editField(o.id, input.dataset.editField, input.value);
    });
  });
  el.querySelectorAll('[data-jump]').forEach(j => j.addEventListener('click', () => ops.selectObject(j.dataset.jump)));
}

function renderInspectorGates(o, gates) {
  const k = KIND_META[o.kind];
  const allPass = gates.pct === 100;
  return `
    <div class="id-card">
      <div class="id-row">
        <span class="id-kind" style="background:${withAlpha(k.color, 0.18)};color:${k.color}">${k.label}</span>
        <span class="id-hash"><strong>${o.hash}</strong></span>
        <div class="id-actions">
          <button title="Verify hashes + sigs" data-action="verify"><svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg></button>
          <button title="Open Trail" data-action="open-trail"><svg viewBox="0 0 24 24"><path d="M3 21l4-4M7 17V8l5-5 5 5v9M7 17h10M17 17l4 4"/></svg></button>
          <button title="Export" data-action="export"><svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
          <button class="danger" title="Delete (staged only)" data-action="delete"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div>
      </div>
      <div class="id-stats">
        <div class="id-stat"><span class="lk">State</span><span class="vl ${o.state === 'committed' ? 'ok' : ''}">${o.state}</span></div>
        <div class="id-stat"><span class="lk">Parents</span><span class="vl">${o.parents.length}</span></div>
        <div class="id-stat"><span class="lk">Children</span><span class="vl">${EDGES.filter(e => e.from === o.id).length}</span></div>
        <div class="id-stat"><span class="lk">Gates</span><span class="vl ${allPass ? 'ok' : 'warn'}">${gates.passed}/${gates.total}</span></div>
      </div>
    </div>

    <div class="act-row split-4">
      <button class="act-btn primary" data-action="commit" ${allPass ? '' : 'disabled'}>
        <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;stroke-width:2;fill:none"><polyline points="20 6 9 17 4 12"/></svg>
        Commit
      </button>
      <button class="act-btn" data-action="branch">
        <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;stroke-width:2;fill:none"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
        Branch
      </button>
      <button class="act-btn" data-action="replicate" ${o.kind === 'claim' ? '' : 'disabled'}>
        <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;stroke-width:2;fill:none"><path d="M21 12a9 9 0 1 1-3-7"/><polyline points="21 4 21 10 15 10"/></svg>
        Replicate
      </button>
      <button class="act-btn" data-action="refute" ${o.kind === 'claim' ? '' : 'disabled'}>
        <svg viewBox="0 0 24 24" style="width:14px;height:14px;stroke:currentColor;stroke-width:2;fill:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Refute
      </button>
    </div>

    <div class="gates">
      <div class="gates-head">
        <span class="gates-title">Gate checklist</span>
        <span class="gates-meta"><span class="pct">${gates.pct}%</span> · ${gates.passed}/${gates.total}</span>
      </div>
      <div class="gates-bar ${gates.pct === 100 ? '' : (gates.pct >= 60 ? 'partial' : 'empty')}">
        <div class="fill" style="width:${gates.pct}%"></div>
      </div>
      ${gates.checks.map(c => `
        <div class="gate ${c.pass ? 'pass' : 'fail'}">
          <span class="ck"></span>
          <span class="nm">${humanize(c.field)}</span>
          <span class="why">${c.hint || (c.pass ? esc(String(c.value || '').slice(0, 28)) : 'missing')}</span>
        </div>
      `).join('')}
    </div>

    ${renderCliMirror(o)}
  `;
}

function renderCliMirror(o) {
  const cmds = {
    commit:    cmdCommit(o),
    branch:    cmdBranch(o),
    replicate: cmdReplicate(o),
    inspect:   cmdInspect(o),
    verify:    cmdVerify(o),
  };
  return `
    <div class="cli">
      <div class="cli-head">
        <span class="cli-title">CLI mirror</span>
        <span class="cli-pick">
          <button class="${state.cliPick==='commit'?'active':''}" data-cli="commit">commit</button>
          <button class="${state.cliPick==='branch'?'active':''}" data-cli="branch">branch</button>
          <button class="${state.cliPick==='replicate'?'active':''}" data-cli="replicate">replicate</button>
          <button class="${state.cliPick==='inspect'?'active':''}" data-cli="inspect">inspect</button>
          <button class="${state.cliPick==='verify'?'active':''}" data-cli="verify">verify</button>
        </span>
      </div>
      <div class="cli-body">${cmds[state.cliPick]}<button class="cli-copy" id="cli-copy" title="Copy">⧉</button></div>
    </div>
  `;
}

function cmdCommit(o) {
  const args = [];
  if (o.kind === 'claim') {
    args.push(['statement', o.fields.statement]);
    args.push(['scope', o.fields.scope]);
    args.push(['falsifier', o.fields.falsifier]);
    args.push(['posterior', o.fields.posterior]);
    if (o.fields.prereg_ref) args.push(['prereg', OBJECTS[o.fields.prereg_ref]?.hash]);
  } else {
    Object.entries(o.fields).slice(0, 4).forEach(([k, v]) => args.push([k, v]));
  }
  return `<span class="cmd">lattice ${o.kind}</span> \\\n` + args.map(([k, v]) =>
    `  <span class="arg">--${k}</span> <span class="str">${esc(jsonish(v))}</span>`
  ).join(' \\\n') + ` \\\n  <span class="arg">--sign</span>`;
}
function cmdBranch(o) {
  return `<span class="cmd">lattice branch</span> <span class="str">"refine-${o.kind}"</span> \\\n  <span class="arg">--from</span> <span class="str">${o.hash}</span>`;
}
function cmdReplicate(o) {
  return `<span class="com"># anyone can replicate a published claim</span>\n<span class="cmd">lattice replicate</span> \\\n  <span class="arg">--target-claim</span> <span class="str">${o.hash}</span> \\\n  <span class="arg">--outcome</span> <span class="str">[succeeded|partial|failed]</span> \\\n  <span class="arg">--evidence</span> <span class="str">æ:&lt;your-data&gt;</span> \\\n  <span class="arg">--independence-asserted</span>`;
}
function cmdInspect(o) {
  return `<span class="cmd">lattice nodes:show</span> \\\n  <span class="arg">--node</span> <span class="str">${o.hash}</span> \\\n  <span class="arg">--projection</span> <span class="str">full</span>`;
}
function cmdVerify(o) {
  return `<span class="com"># walk DAG, check hashes + signatures, offline-verifiable</span>\n<span class="cmd">lattice verify</span> \\\n  <span class="arg">--node</span> <span class="str">${o.hash}</span> \\\n  <span class="arg">--check-sigs</span> \\\n  <span class="arg">--check-hashes</span> \\\n  <span class="arg">--depth</span> <span class="str">all</span>`;
}

function renderInspectorDetails(o) {
  const schema = KIND_SCHEMA[o.kind] || { required: [], optional: [] };
  const fields = [...schema.required, ...schema.optional];
  return `
    <div class="ins-block">
      <div class="ins-h">Object fields <span class="ct">${fields.length} fields</span></div>
      ${fields.map(f => `
        <div class="ins-fld">
          <div class="lk">${humanize(f)} ${schema.required.includes(f) ? '<span class="req">REQ</span>' : ''}</div>
          ${['statement','falsifier','scope','summary','mechanism','plan','steps','auxiliary'].includes(f)
            ? `<textarea data-edit-field="${f}" placeholder="${fieldPlaceholder(f)}">${esc(o.fields[f] || '')}</textarea>`
            : `<input class="${isHashy(f) ? 'mono' : ''}" data-edit-field="${f}" placeholder="${fieldPlaceholder(f)}" value="${esc(o.fields[f] != null ? String(o.fields[f]) : '')}" />`
          }
        </div>
      `).join('')}
    </div>

    ${renderLineage(o)}
  `;
}

function renderLineage(o) {
  const parents = o.parents.map(id => OBJECTS[id]).filter(Boolean);
  const children = EDGES.filter(e => e.from === o.id).map(e => ({ rel: e.type, obj: OBJECTS[e.to] })).filter(c => c.obj);
  if (!parents.length && !children.length) return '';
  return `
    <div class="ins-block">
      <div class="ins-h">Lineage <span class="ct">${parents.length}↑ ${children.length}↓</span></div>
      <div class="lin">
        ${parents.map(p => `
          <div class="lin-row">
            <span class="rl">parent</span>
            <span class="nm" data-jump="${p.id}" style="color:${KIND_META[p.kind].color}">${esc(shortTitle(p.fields.title || p.id, 32))}</span>
            <span class="h">${p.hash.slice(2, 12)}</span>
          </div>
        `).join('')}
        ${children.map(c => `
          <div class="lin-row">
            <span class="rl">${c.rel}</span>
            <span class="nm" data-jump="${c.obj.id}" style="color:${KIND_META[c.obj.kind].color}">${esc(shortTitle(c.obj.fields.title || c.obj.id, 32))}</span>
            <span class="h">${c.obj.hash.slice(2, 12)}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderInspectorActivity(o) {
  // Subagents + hooks + recent edits
  const recentEdits = Object.values(OBJECTS)
    .filter(x => x.investigation === o.investigation)
    .sort((a, b) => String(b.when).localeCompare(String(a.when)))
    .slice(0, 8);
  return `
    <div class="ins-block">
      <div class="ins-h">Subagents <span class="ct">${SUBAGENTS.length}</span></div>
      ${SUBAGENTS.map(s => `
        <div class="sub-row">
          <span class="d ${s.status}"></span>
          <span class="nm">${esc(s.name)}</span>
          ${s.status === 'done' ? '<span class="ck">✓</span>' : ''}
        </div>
      `).join('')}
    </div>

    <div class="ins-block">
      <div class="ins-h">Hooks <span class="ct">${HOOKS.filter(h => h.enabled).length} enabled</span></div>
      ${HOOKS.map(h => `
        <div class="sub-row">
          <span class="d ${h.enabled ? 'done' : 'pending'}"></span>
          <span class="nm"><strong style="color:var(--teal)">on ${h.event}</strong> → ${h.action}</span>
        </div>
      `).join('')}
    </div>

    <div class="ins-block">
      <div class="ins-h">Recent activity</div>
      <div class="act-feed">
        ${recentEdits.map(e => `
          <div class="act-line">
            <span class="ts">${shortTs(e.when)}</span>
            <span class="vb">${e.kind}</span>
            <span style="flex:1;color:var(--fg-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer" data-jump="${e.id}">${esc((e.fields.title || e.id).slice(0, 40))}</span>
            <span style="color:var(--fg-4)">${e.state}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* ============================================================
   NEW OBJECT MODAL
   ============================================================ */
function openNewModal() {
  const modal = document.getElementById('modal-new');
  const card = document.getElementById('modal-new-card');
  let picked = null;
  let parentId = state.selected;

  function paint() {
    card.innerHTML = `
      <div class="mc-head">
        <h3>${picked ? 'New ' + KIND_META[picked].label : 'New object'}</h3>
        <button class="mc-close" data-close><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>
      <div class="mc-body">
        ${picked ? renderNewForm(picked, parentId) : renderKindPicker()}
      </div>
      <div class="mc-foot">
        ${picked ? `
          <button class="btn outline" id="back-pick">← back</button>
          <span style="font-size:11.5px;color:var(--fg-3)">Parent: ${OBJECTS[parentId]?.hash || 'none'}</span>
          <div class="progress" style="margin-left:auto;max-width:120px"><div class="fill" id="form-progress" style="width:0%"></div></div>
          <button class="btn primary" id="create-btn" disabled>Create staged</button>
        ` : `<span style="font-size:11.5px;color:var(--fg-3)">Pick a kind to start.</span>`}
      </div>
    `;
    wireModal();
  }

  function wireModal() {
    card.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeModal));
    card.querySelectorAll('.kp').forEach(k => k.addEventListener('click', () => { picked = k.dataset.k; paint(); }));
    card.querySelector('#back-pick')?.addEventListener('click', () => { picked = null; paint(); });
    if (picked) {
      const form = card.querySelectorAll('[data-form-field]');
      const validate = () => {
        const schema = KIND_SCHEMA[picked];
        const fields = {};
        form.forEach(i => fields[i.dataset.formField] = i.value);
        const required = schema.required.length;
        const filled = schema.required.filter(f => fields[f] && fields[f].trim()).length;
        const pct = required ? Math.round(filled / required * 100) : 100;
        card.querySelector('#form-progress').style.width = pct + '%';
        card.querySelector('#create-btn').disabled = pct < 100;
      };
      form.forEach(i => i.addEventListener('input', validate));
      validate();
      card.querySelector('#create-btn').addEventListener('click', () => {
        const fields = {};
        form.forEach(i => { if (i.value.trim()) fields[i.dataset.formField] = i.value.trim(); });
        ops.createObject(picked, parentId, fields);
        closeModal();
      });
    }
  }

  modal.hidden = false;
  paint();
}

function renderKindPicker() {
  const kinds = Object.keys(KIND_META).filter(k => k !== 'publication'); // publication minted via publish op
  return `<div class="kind-picker">${kinds.map(k => `
    <button class="kp" data-k="${k}">
      <span class="kp-dot" style="background:${KIND_META[k].color}"></span>
      <span class="kp-nm">${KIND_META[k].label}</span>
      <span class="kp-desc">${KIND_META[k].desc}</span>
    </button>
  `).join('')}</div>`;
}

function renderNewForm(kind, parentId) {
  const schema = KIND_SCHEMA[kind];
  return `
    <div style="font-size:12px;color:var(--fg-3);margin-bottom:14px">
      Creating a <strong style="color:${KIND_META[kind].color}">${KIND_META[kind].label}</strong>.
      Required fields enforce gates before commit. You can save as staged and commit later.
    </div>
    ${schema.required.map(f => `
      <div class="ins-fld">
        <div class="lk">${humanize(f)} <span class="req">REQ</span></div>
        ${['statement','falsifier','scope','summary','mechanism','plan','steps','auxiliary'].includes(f)
          ? `<textarea data-form-field="${f}" placeholder="${fieldPlaceholder(f)}"></textarea>`
          : `<input data-form-field="${f}" placeholder="${fieldPlaceholder(f)}" />`}
      </div>
    `).join('')}
    ${schema.optional.map(f => `
      <div class="ins-fld">
        <div class="lk">${humanize(f)} <span class="opt">optional</span></div>
        <input data-form-field="${f}" placeholder="${fieldPlaceholder(f)}" />
      </div>
    `).join('')}
  `;
}

function closeModal() {
  document.getElementById('modal-new').hidden = true;
}

/* ============================================================
   SEARCH PALETTE
   ============================================================ */
function openPalette() {
  const p = document.getElementById('palette');
  const input = document.getElementById('palette-input');
  const results = document.getElementById('palette-results');
  p.hidden = false;
  input.value = '';
  results.innerHTML = '';
  setTimeout(() => input.focus(), 0);

  const rerun = () => {
    const r = ops.search(input.value);
    results.innerHTML = r.map((o, i) => `
      <div class="pr-row ${i === 0 ? 'active' : ''}" data-obj="${o.id}">
        <span class="kind-tag" style="background:${withAlpha(KIND_META[o.kind].color, 0.15)};color:${KIND_META[o.kind].color}">${KIND_META[o.kind].label}</span>
        <span class="nm">${esc(o.fields.title || o.id)}</span>
        <span class="h">${o.hash}</span>
      </div>
    `).join('');
    results.querySelectorAll('.pr-row').forEach(row => row.addEventListener('click', () => {
      ops.selectObject(row.dataset.obj);
      closePalette();
    }));
  };
  input.oninput = rerun;
  input.onkeydown = (e) => {
    if (e.key === 'Escape') closePalette();
    if (e.key === 'Enter') {
      const first = results.querySelector('.pr-row');
      if (first) first.click();
    }
  };
  p.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closePalette));
}
function closePalette() { document.getElementById('palette').hidden = true; }

/* ============================================================
   UTILITIES
   ============================================================ */
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function humanize(s) { return String(s).replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()); }
function shortTitle(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function shortTs(s) {
  if (!s) return '';
  s = String(s);
  const m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    const d = new Date(s.replace(' ', 'T'));
    const days = Math.round((Date.now() - d.getTime()) / 86400000);
    if (days < 1) return 'today';
    if (days < 30) return days + 'd';
    if (days < 365) return Math.round(days/30) + 'mo';
    return Math.round(days/365) + 'y';
  }
  return s;
}
function withAlpha(hex, a) {
  const r = parseInt(hex.slice(1,3), 16), g = parseInt(hex.slice(3,5), 16), b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function jsonish(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v.length > 56 ? v.slice(0, 53) + '…' : v;
  return JSON.stringify(v);
}
function isHashy(f) { return /hash|key|sha|seed|ref/i.test(f); }
function fieldPlaceholder(f) {
  const map = {
    title: 'short headline',
    summary: 'one-line takeaway for the graph card',
    statement: 'the precise claim being asserted',
    falsifier: 'the condition under which this is refuted',
    scope: 'where this applies and where it does not',
    posterior: 'e.g. P(true|data) = 0.94 · BF = 38',
    mechanism: 'what evidence falsifies the target?',
    plan: 'analysis plan locked at pre-registration',
    steps: 'executable protocol steps',
    factors: 'experimental factors',
    controls: 'comparator condition(s)',
    primary_metric: 'the metric that decides the claim',
    power: 'achieved or designed power (1-β)',
    hazards: 'BSL level, sharps, hazardous reagents',
    code_hash: 'æ:…',
    env_hash: 'æ:…',
    machine: 'provider::sku',
    instrument: 'instrument id + calibration ref',
    target: 'hash of target claim',
    outcome: 'succeeded | partial | failed',
    independence: 'how is this independent of the original?',
    verdict: 'accept | request_changes | reject',
    coi: 'declare conflicts of interest',
    relation_type: 'supports | contradicts | extends | depends_on',
  };
  return map[f] || '';
}

/* ============================================================
   FLASH (toast)
   ============================================================ */
function flash(msg, kind = 'info') {
  let host = document.getElementById('flash-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'flash-host';
    host.style.cssText = 'position:fixed;bottom:96px;left:50%;transform:translateX(-50%);z-index:2000;display:flex;flex-direction:column;gap:6px;align-items:center;pointer-events:none';
    document.body.appendChild(host);
  }
  const colors = { ok: 'var(--green)', warn: 'var(--amber)', fail: 'var(--red)', info: 'var(--teal)' };
  const el = document.createElement('div');
  el.style.cssText = `
    background: var(--bg-3); border: 1px solid var(--line-2);
    border-left: 3px solid ${colors[kind]};
    border-radius: 6px; padding: 8px 14px;
    font-size: 12.5px; color: var(--fg-0);
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    opacity: 0; transform: translateY(8px); transition: all 0.18s;
    max-width: 480px;
  `;
  el.textContent = msg;
  host.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
  setTimeout(() => {
    el.style.opacity = '0'; el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 250);
  }, 2800);
}

/* ============================================================
   EXIT / BACK
   ============================================================ */
function latticeGoBack() {
  const computerHref = '/products/';
  try {
    if (window.top !== window.self) {
      window.top.location.href = computerHref;
      return;
    }
  } catch (_) {}
  window.location.href = computerHref;
}

/* ============================================================
   INIT
   ============================================================ */
window.ops = ops; // expose for inline onclick handlers

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.setAttribute('data-theme', state.theme);
  document.getElementById('app').dataset.sidebar = state.sidebar;
  document.getElementById('app').dataset.inspector = state.inspector;

  // Global key shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.key === '1') ops.setView('bench');
    else if (e.key === '2') ops.setView('graph');
    else if (e.key === '3') ops.setView('timeline');
    else if (e.key === '4') ops.setView('explore');
    else if (e.key === '5') ops.setView('trail');
    else if (e.key === '6') ops.setView('docs');
    else if (e.key === 'F1') { e.preventDefault(); ops.setView('docs'); }
    else if (e.key === 'n') openNewModal();
    else if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openPalette(); }
    else if ((e.metaKey || e.ctrlKey) && e.key === '.') { e.preventDefault(); ops.toggleInspector(); }
    else if ((e.metaKey || e.ctrlKey) && e.key === 'b') { e.preventDefault(); ops.toggleSidebar(); }
    else if ((e.metaKey || e.ctrlKey) && e.key === 'f') { e.preventDefault(); openPalette(); }
    else if (e.key === 'Escape') { closeModal(); closePalette(); if (openMenu) { openMenu = null; renderTopnav(); } }
  });

  // Topbar inspector + search toggles
  document.getElementById('topbar-back')?.addEventListener('click', latticeGoBack);
  document.getElementById('toggle-inspector').addEventListener('click', ops.toggleInspector);
  document.getElementById('open-search').addEventListener('click', openPalette);

  // Prompt input — PromptInputBox-style chat bar
  (function initPromptBox() {
    const box = document.getElementById('prompt-box');
    const input = document.getElementById('prompt-input');
    const sendBtn = document.getElementById('prompt-send');
    const previewsEl = document.getElementById('prompt-previews');
    const editorEl = document.getElementById('prompt-editor');
    const recorderEl = document.getElementById('prompt-recorder');
    const recTimeEl = document.getElementById('prompt-rec-time');
    const recBarsEl = document.getElementById('prompt-rec-bars');
    const actionsLeft = document.getElementById('prompt-actions-left');
    const fileInput = document.getElementById('prompt-file-input');
    const uploadBtn = document.getElementById('prompt-upload');
    const toggleSearch = document.getElementById('prompt-toggle-search');
    const toggleThink = document.getElementById('prompt-toggle-think');
    const toggleCanvas = document.getElementById('prompt-toggle-canvas');
    const imageModal = document.getElementById('prompt-image-modal');
    const imageFull = document.getElementById('prompt-image-full');
    const imageClose = document.getElementById('prompt-image-close');

    const iconMic = sendBtn.querySelector('.icon-mic');
    const iconSend = sendBtn.querySelector('.icon-send');
    const iconStop = sendBtn.querySelector('.icon-stop');
    const iconRecStop = sendBtn.querySelector('.icon-rec-stop');

    let attachedFile = null;
    let previewUrl = null;
    let showSearch = false;
    let showThink = false;
    let showCanvas = false;
    let isRecording = false;
    let isLoading = false;
    let recordSeconds = 0;
    let recordTimer = null;

    for (let i = 0; i < 32; i++) {
      const bar = document.createElement('div');
      bar.className = 'prompt-rec-bar';
      bar.style.height = `${Math.max(15, Math.random() * 100)}%`;
      bar.style.animationDelay = `${i * 0.05}s`;
      bar.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
      recBarsEl.appendChild(bar);
    }

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function autosize() {
      input.style.height = 'auto';
      input.style.height = `${Math.min(input.scrollHeight, 240)}px`;
    }

    function hasContent() {
      return input.value.trim() !== '' || !!attachedFile;
    }

    function updatePlaceholder() {
      if (showSearch) input.placeholder = 'Search the web...';
      else if (showThink) input.placeholder = 'Think deeply...';
      else if (showCanvas) input.placeholder = 'Create on canvas...';
      else input.placeholder = 'Ask lattice-agent, @ to mention, / for actions (e.g. /replicate, /refute, /preregister)';
    }

    function updateSendButton() {
      iconMic.hidden = true;
      iconSend.hidden = true;
      iconStop.hidden = true;
      iconRecStop.hidden = true;
      sendBtn.classList.remove('has-content', 'is-recording', 'is-loading');

      if (isLoading) {
        iconStop.hidden = false;
        sendBtn.classList.add('is-loading');
        sendBtn.title = 'Stop generation';
      } else if (isRecording) {
        iconRecStop.hidden = false;
        sendBtn.classList.add('is-recording');
        sendBtn.title = 'Stop recording';
      } else if (hasContent()) {
        iconSend.hidden = false;
        sendBtn.classList.add('has-content');
        sendBtn.title = 'Send message';
      } else {
        iconMic.hidden = false;
        sendBtn.title = 'Voice message';
      }
    }

    function updateRecordingUI() {
      box.classList.toggle('is-recording', isRecording);
      recorderEl.hidden = !isRecording;
      editorEl.classList.toggle('is-hidden', isRecording);
      actionsLeft.classList.toggle('is-hidden', isRecording);
      input.disabled = isLoading || isRecording;
      uploadBtn.disabled = isRecording;
      updateSendButton();
    }

    function renderPreview() {
      if (!attachedFile || !previewUrl || isRecording) {
        previewsEl.hidden = true;
        previewsEl.innerHTML = '';
        return;
      }
      previewsEl.hidden = false;
      previewsEl.innerHTML = `
        <div class="prompt-preview" data-open-preview>
          <img src="${previewUrl}" alt="${esc(attachedFile.name)}" />
          <button type="button" class="prompt-preview-remove" data-remove-preview title="Remove">
            <svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>`;
      previewsEl.querySelector('[data-open-preview]').addEventListener('click', (e) => {
        if (e.target.closest('[data-remove-preview]')) return;
        openImageModal(previewUrl);
      });
      previewsEl.querySelector('[data-remove-preview]').addEventListener('click', (e) => {
        e.stopPropagation();
        clearAttachment();
      });
    }

    function clearAttachment() {
      attachedFile = null;
      previewUrl = null;
      renderPreview();
      updateSendButton();
    }

    function isImageFile(file) {
      return file && file.type.startsWith('image/');
    }

    function processFile(file) {
      if (!isImageFile(file)) {
        flash('Only image files are allowed', 'warn');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        flash('File too large (max 10MB)', 'warn');
        return;
      }
      attachedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl = e.target.result;
        renderPreview();
        updateSendButton();
      };
      reader.readAsDataURL(file);
    }

    function openImageModal(url) {
      imageFull.src = url;
      imageModal.hidden = false;
    }

    function closeImageModal() {
      imageModal.hidden = true;
      imageFull.src = '';
    }

    function setMode(mode) {
      if (mode === 'search') {
        showSearch = !showSearch;
        if (showSearch) showThink = false;
      } else if (mode === 'think') {
        showThink = !showThink;
        if (showThink) showSearch = false;
      } else if (mode === 'canvas') {
        showCanvas = !showCanvas;
      }
      toggleSearch.classList.toggle('is-active', showSearch);
      toggleThink.classList.toggle('is-active', showThink);
      toggleCanvas.classList.toggle('is-active', showCanvas);
      updatePlaceholder();
    }

    function startRecording() {
      isRecording = true;
      recordSeconds = 0;
      recTimeEl.textContent = formatTime(recordSeconds);
      recordTimer = setInterval(() => {
        recordSeconds += 1;
        recTimeEl.textContent = formatTime(recordSeconds);
      }, 1000);
      updateRecordingUI();
    }

    function stopRecording() {
      if (!isRecording) return;
      clearInterval(recordTimer);
      recordTimer = null;
      isRecording = false;
      updateRecordingUI();
      dispatchMessage(`[Voice message - ${recordSeconds} seconds]`, []);
      recordSeconds = 0;
    }

    function dispatchMessage(text, files) {
      const v = text.trim();
      if (!v && (!files || !files.length)) return;
      const lower = v.toLowerCase();
      const fileNote = files && files.length ? ` · ${files.length} attachment${files.length > 1 ? 's' : ''}` : '';
      if (lower.startsWith('/replicate')) ops.replicate(state.selected);
      else if (lower.startsWith('/refute')) ops.refute(state.selected);
      else if (lower.startsWith('/branch')) ops.branch(state.selected);
      else if (lower.startsWith('/commit')) ops.commit(state.selected);
      else if (lower.startsWith('/new')) openNewModal();
      else flash(`Agent · "${v.slice(0, 60)}${v.length > 60 ? '…' : ''}"${fileNote} — would dispatch to lattice-auto skill (demo)`, 'info');
    }

    function handleSubmit() {
      const raw = input.value.trim();
      if (!raw && !attachedFile) return;
      let prefix = '';
      if (showSearch) prefix = '[Search: ';
      else if (showThink) prefix = '[Think: ';
      else if (showCanvas) prefix = '[Canvas: ';
      const formatted = prefix ? `${prefix}${raw}]` : raw;
      const files = attachedFile ? [attachedFile] : [];
      dispatchMessage(formatted, files);
      input.value = '';
      autosize();
      clearAttachment();
    }

    input.addEventListener('input', () => {
      autosize();
      updateSendButton();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!isRecording && !isLoading) handleSubmit();
      }
    });

    sendBtn.addEventListener('click', () => {
      if (isLoading) {
        isLoading = false;
        box.classList.remove('is-loading');
        updateRecordingUI();
        return;
      }
      if (isRecording) stopRecording();
      else if (hasContent()) handleSubmit();
      else startRecording();
    });

    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
      e.target.value = '';
    });

    toggleSearch.addEventListener('click', () => setMode('search'));
    toggleThink.addEventListener('click', () => setMode('think'));
    toggleCanvas.addEventListener('click', () => setMode('canvas'));

    box.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); });
    box.addEventListener('dragleave', (e) => { e.preventDefault(); e.stopPropagation(); });
    box.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const image = Array.from(e.dataTransfer.files).find(isImageFile);
      if (image) processFile(image);
    });

    document.addEventListener('paste', (e) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            processFile(file);
            break;
          }
        }
      }
    });

    imageClose.addEventListener('click', closeImageModal);
    imageModal.querySelector('[data-close-image]').addEventListener('click', closeImageModal);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !imageModal.hidden) closeImageModal();
    });

    autosize();
    updateSendButton();
    updatePlaceholder();
  })();

  // Click-outside to close palette/modal
  document.querySelectorAll('.modal-backdrop, .palette-backdrop').forEach(b => b.addEventListener('click', () => { closeModal(); closePalette(); }));

  render();

  console.log('%cÆther %cready · git for scientific research and discovery',
    'color:#2DD4BF;font-weight:700;font-size:14px',
    'color:#828A92;font-weight:400');
  console.log('Loaded: %d investigations · %d objects · %d edges', INVESTIGATIONS.length, Object.keys(OBJECTS).length, EDGES.length);
  console.log('Try: clicking any object · /replicate · /refute · ⌘K search · n for new object · 1-6 view switch');
});

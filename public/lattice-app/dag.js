/* ============================================================
   ÆTHER — Compiler-style Directed Acyclic Graph (DAG)
   Based on classic DAG construction for basic blocks
   (see GeeksforGeeks compiler design reference)
   ============================================================ */
'use strict';

const DAG_EXAMPLES = {
  ex1: {
    title: 'Example 1 — common subexpression',
    subtitle: 'T0 = a + b · T1 = T0 + c · d = T0 + T1',
    statements: ['T0 = a + b', 'T1 = T0 + c', 'd = T0 + T1'],
    nodes: [
      { id: 'a', label: 'a', type: 'leaf' },
      { id: 'b', label: 'b', type: 'leaf' },
      { id: 'c', label: 'c', type: 'leaf' },
      { id: 'n0', label: '+', type: 'op', ident: 'T0' },
      { id: 'n1', label: '+', type: 'op', ident: 'T1' },
      { id: 'n2', label: '+', type: 'op', ident: 'd' },
    ],
    edges: [
      { from: 'a', to: 'n0' }, { from: 'b', to: 'n0' },
      { from: 'n0', to: 'n1' }, { from: 'c', to: 'n1' },
      { from: 'n0', to: 'n2' }, { from: 'n1', to: 'n2' },
    ],
  },
  ex2: {
    title: 'Example 2 — mixed operators',
    subtitle: 'T1 = a + b · T2 = T1 + c · T3 = T1 × T2',
    statements: ['T1 = a + b', 'T2 = T1 + c', 'T3 = T1 × T2'],
    nodes: [
      { id: 'a', label: 'a', type: 'leaf' },
      { id: 'b', label: 'b', type: 'leaf' },
      { id: 'c', label: 'c', type: 'leaf' },
      { id: 'n1', label: '+', type: 'op', ident: 'T1' },
      { id: 'n2', label: '+', type: 'op', ident: 'T2' },
      { id: 'n3', label: '×', type: 'op', ident: 'T3' },
    ],
    edges: [
      { from: 'a', to: 'n1' }, { from: 'b', to: 'n1' },
      { from: 'n1', to: 'n2' }, { from: 'c', to: 'n2' },
      { from: 'n1', to: 'n3' }, { from: 'n2', to: 'n3' },
    ],
  },
  ex3: {
    title: 'Example 3 — multi-use chain',
    subtitle: 'T1 = a + b · T2 = a − b · T3 = T2 × T1 · T4 = T1 − T3 · T5 = T4 + T3',
    statements: [
      'T1 = a + b', 'T2 = a − b', 'T3 = T2 × T1',
      'T4 = T1 − T3', 'T5 = T4 + T3',
    ],
    nodes: [
      { id: 'a', label: 'a', type: 'leaf' },
      { id: 'b', label: 'b', type: 'leaf' },
      { id: 'n1', label: '+', type: 'op', ident: 'T1' },
      { id: 'n2', label: '−', type: 'op', ident: 'T2' },
      { id: 'n3', label: '×', type: 'op', ident: 'T3' },
      { id: 'n4', label: '−', type: 'op', ident: 'T4' },
      { id: 'n5', label: '+', type: 'op', ident: 'T5' },
    ],
    edges: [
      { from: 'a', to: 'n1' }, { from: 'b', to: 'n1' },
      { from: 'a', to: 'n2' }, { from: 'b', to: 'n2' },
      { from: 'n2', to: 'n3' }, { from: 'n1', to: 'n3' },
      { from: 'n1', to: 'n4' }, { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' }, { from: 'n3', to: 'n5' },
    ],
  },
  ex4: {
    title: 'Example 4 — reassignment & reuse',
    subtitle: 'Final DAG after eliminating b×c, d=b, e=d×c, f=b+c, g=f+d',
    statements: [
      'a = b × c', 'd = b', 'e = d × c', 'b = e', 'f = b + c', 'g = f + d',
    ],
    nodes: [
      { id: 'b', label: 'b', type: 'leaf' },
      { id: 'c', label: 'c', type: 'leaf' },
      { id: 'n_bc', label: '×', type: 'op', ident: 'b·c' },
      { id: 'n_a', label: 'a', type: 'ident' },
      { id: 'n_d', label: 'd', type: 'ident' },
      { id: 'n_e', label: '×', type: 'op', ident: 'e' },
      { id: 'n_f', label: '+', type: 'op', ident: 'f' },
      { id: 'n_g', label: '+', type: 'op', ident: 'g' },
    ],
    edges: [
      { from: 'b', to: 'n_bc' }, { from: 'c', to: 'n_bc' },
      { from: 'n_bc', to: 'n_a' },
      { from: 'n_bc', to: 'n_d' },
      { from: 'n_d', to: 'n_e' }, { from: 'c', to: 'n_e' },
      { from: 'n_e', to: 'n_f' }, { from: 'c', to: 'n_f' },
      { from: 'n_f', to: 'n_g' }, { from: 'n_d', to: 'n_g' },
    ],
  },
};

const DAG_LEAF_KINDS = new Set(['question', 'sample', 'measurement', 'citation', 'null']);

function investigationToDAG(objects, edges) {
  const ids = new Set(objects.map((o) => o.id));
  const dagEdges = [];
  objects.forEach((o) => {
    (o.parents || []).forEach((p) => {
      if (ids.has(p)) dagEdges.push({ from: p, to: o.id, type: 'derived_from' });
    });
  });
  edges.forEach((e) => {
    if (ids.has(e.from) && ids.has(e.to) && !dagEdges.some((d) => d.from === e.from && d.to === e.to)) {
      dagEdges.push({ from: e.from, to: e.to, type: e.type });
    }
  });
  const nodes = objects.map((o) => {
    const meta = KIND_META[o.kind] || { label: o.kind, glyph: '·', color: '#888' };
    const isLeaf = DAG_LEAF_KINDS.has(o.kind) || !(o.parents || []).some((p) => ids.has(p));
    return {
      id: o.id,
      label: (o.fields.title || o.id).replace(/^[A-Z]-\d+:?\s*/, '').slice(0, 22),
      type: isLeaf ? 'leaf' : 'op',
      ident: meta.label,
      glyph: meta.glyph,
      color: meta.color,
      objId: o.id,
    };
  });
  return { nodes, edges: dagEdges };
}

function layoutCompilerDAG(nodes, edges, W, H) {
  const memo = {};
  const depthOf = (id) => {
    if (memo[id] !== undefined) return memo[id];
    const inputs = edges.filter((e) => e.to === id).map((e) => e.from);
    memo[id] = inputs.length ? 1 + Math.max(...inputs.map(depthOf)) : 0;
    return memo[id];
  };
  nodes.forEach((n) => depthOf(n.id));

  const layers = {};
  nodes.forEach((n) => {
    const d = memo[n.id];
    layers[d] = layers[d] || [];
    layers[d].push(n.id);
  });

  const maxD = Math.max(0, ...Object.keys(layers).map(Number));
  const vSpacing = Math.min(90, (H - 100) / Math.max(1, maxD));
  const pos = {};

  Object.entries(layers).forEach(([d, ids]) => {
    const layer = layers[d];
    const bary = {};
    layer.forEach((id) => {
      const inputs = edges.filter((e) => e.to === id).map((e) => e.from);
      if (!inputs.length) {
        bary[id] = 0;
        return;
      }
      bary[id] = inputs.reduce((sum, inp) => sum + (pos[inp]?.x || 0), 0) / inputs.length;
    });
    layer.sort((a, b) => bary[a] - bary[b]);

    const hSpacing = Math.min(140, (W - 160) / Math.max(1, layer.length));
    const rowW = (layer.length - 1) * hSpacing;
    const startX = (W - rowW) / 2;
    layer.forEach((id, i) => {
      pos[id] = {
        x: startX + i * hSpacing,
        y: H - 60 - (+d) * vSpacing,
      };
    });
  });

  return pos;
}

function renderCompilerDAGSvg(nodes, edges, positions, options = {}) {
  const { onNodeClick, selectedId } = options;
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  const edgeSvg = edges.map((e) => {
    const f = positions[e.from], t = positions[e.to];
    if (!f || !t) return '';
    const dx = t.x - f.x, dy = t.y - f.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const nh = 22, nt = 28;
    const sx = f.x + (dx / dist) * nh;
    const sy = f.y - (dy / dist) * nh;
    const ex = t.x - (dx / dist) * nt;
    const ey = t.y + (dy / dist) * nt;
    const stroke = e.type && EDGE_META[e.type] ? EDGE_META[e.type].color : 'var(--fg-3)';
    return `<line class="dedge" x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${stroke}"/>`;
  }).join('');

  const nodeSvg = nodes.map((n) => {
    const p = positions[n.id];
    if (!p) return '';
    const sel = selectedId && (selectedId === n.id || selectedId === n.objId);
    const w = n.type === 'leaf' ? 44 : 52;
    const h = n.type === 'leaf' ? 28 : 36;
    const x = p.x - w / 2;
    const y = p.y - h / 2;
    const click = n.objId ? `data-obj="${n.objId}"` : `data-dag-node="${n.id}"`;
    const cls = `dnode dnode-${n.type}${sel ? ' is-selected' : ''}`;

    if (n.type === 'leaf') {
      return `
        <g class="${cls}" ${click} transform="translate(${x},${y})">
          <rect class="dnode-box dnode-leaf-box" width="${w}" height="${h}" rx="6"/>
          <text class="dnode-leaf-text" x="${w / 2}" y="${h / 2 + 1}">${escDag(n.label)}</text>
        </g>`;
    }
    if (n.type === 'ident') {
      return `
        <g class="${cls}" ${click} transform="translate(${x},${y})">
          <rect class="dnode-box dnode-ident-box" width="${w}" height="${h}" rx="4"/>
          <text class="dnode-ident-text" x="${w / 2}" y="${h / 2 + 1}">${escDag(n.label)}</text>
        </g>`;
    }
    const ident = n.ident ? `<text class="dnode-ident-tag" x="${w / 2}" y="${h - 5}">${escDag(n.ident)}</text>` : '';
    const opLabel = n.glyph || n.label;
    return `
      <g class="${cls}" ${click} transform="translate(${x},${y})" ${n.color ? `style="--dnode-accent:${n.color}"` : ''}>
        <rect class="dnode-box dnode-op-box" width="${w}" height="${h}" rx="4"/>
        <text class="dnode-op-text" x="${w / 2}" y="${ident ? h / 2 - 2 : h / 2 + 1}">${escDag(opLabel)}</text>
        ${ident}
      </g>`;
  }).join('');

  return edgeSvg + nodeSvg;
}

function escDag(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getDAGPayload(source, objects, edges) {
  if (source === 'investigation') {
    return investigationToDAG(objects, edges);
  }
  const ex = DAG_EXAMPLES[source];
  if (!ex) return investigationToDAG(objects, edges);
  return { nodes: ex.nodes, edges: ex.edges, meta: ex };
}

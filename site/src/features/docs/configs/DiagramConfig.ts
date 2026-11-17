export const DIAGRAM_FONT = '"JetBrains Mono"';

export const DIAGRAM_THEME_CSS = `
  .node rect, .node circle, .node ellipse, .node polygon, .node path {
    fill: var(--paper); stroke: var(--ink); stroke-width: 2px;
  }
  .cluster rect { fill: var(--page); stroke: var(--ink); stroke-width: 2px; }
  .nodeLabel, .cluster-label, .cluster-label span, .label, .label text, text {
    color: var(--ink); fill: var(--ink);
  }
  .flowchart-link, .edgePath .path { stroke: var(--ink); stroke-width: 2px; }
  .marker, marker path { fill: var(--ink); stroke: var(--ink); }
  .edgeLabel, .edgeLabel p, .edgeLabel span, .labelBkg {
    background-color: var(--yellow); color: var(--on-accent);
  }
  .edgeLabel rect { fill: var(--yellow); }
`;

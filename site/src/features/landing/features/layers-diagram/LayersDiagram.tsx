import { DOCS_ROUTE } from '@/shared/links/LinksConfig.ts';
import '@/features/landing/features/layers-diagram/layers-diagram.css';

type LayerBoxProps = {
  x: number;
  y: number;
  width: number;
  label: string;
  tone: 'yellow' | 'pink' | 'blue';
};

type ImportArrowProps = {
  from: [number, number];
  to: [number, number];
};

const BOX_HEIGHT = 56;

function LayerBox({ x, y, width, label, tone }: LayerBoxProps) {
  return (
    <g>
      <rect
        className={`layers-box layers-box-${tone}`}
        x={x}
        y={y}
        width={width}
        height={BOX_HEIGHT}
      />
      <text className="layers-label" x={x + width / 2} y={y + BOX_HEIGHT / 2}>
        {label}
      </text>
    </g>
  );
}

function ImportArrow({ from, to }: ImportArrowProps) {
  return (
    <line
      className="layers-arrow"
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      markerEnd="url(#layers-arrow-head)"
    />
  );
}

function ForbiddenImport() {
  return (
    <g>
      <line className="layers-forbidden" x1={182} y1={178} x2={258} y2={178} />
      <path className="layers-cross" d="M210 166 L230 190 M230 166 L210 190" />
    </g>
  );
}

function Diagram() {
  return (
    <svg className="layers-svg" viewBox="0 0 440 360" role="img" aria-labelledby="layers-title">
      <title id="layers-title">
        src/app imports the features todo-list and todo-stats, both import the slice
        src/shared/todos, and they never import each other
      </title>
      <defs>
        <marker
          id="layers-arrow-head"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path className="layers-arrow-head" d="M0 0 L10 5 L0 10 z" />
        </marker>
      </defs>
      <ImportArrow from={[190, 68]} to={[95, 148]} />
      <ImportArrow from={[250, 68]} to={[345, 148]} />
      <ImportArrow from={[95, 208]} to={[190, 288]} />
      <ImportArrow from={[345, 208]} to={[250, 288]} />
      <ForbiddenImport />
      <LayerBox x={120} y={10} width={200} label="src/app/" tone="yellow" />
      <LayerBox x={10} y={150} width={170} label="todo-list/" tone="pink" />
      <LayerBox x={260} y={150} width={170} label="todo-stats/" tone="pink" />
      <LayerBox x={90} y={290} width={260} label="src/shared/todos/" tone="blue" />
    </svg>
  );
}

export function LayersDiagram() {
  return (
    <section id="layers" className="layers container">
      <h2 className="section-title reveal reveal-from-left">Imports only go down</h2>
      <p className="layers-intro">
        <code>src/</code> has three layers. A layer imports only the layers below it, two features
        never import each other, and what they share goes down into a slice of{' '}
        <code>src/shared/</code>. dependency-cruiser fails the check on any other import.
      </p>
      <div className="layers-figure reveal reveal-stamp">
        <Diagram />
      </div>
      <p>
        <a href={`${DOCS_ROUTE}/brutalway/docs/reference/rules.md#layers`}>
          The layers in the common rules
        </a>
      </p>
    </section>
  );
}

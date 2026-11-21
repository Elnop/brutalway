import type { ReactElement, ReactNode } from 'react';

type SlotsProps = {
  children: (count: number) => ReactNode;
  renderEmpty: () => ReactElement;
  onRender: () => ReactNode;
  footer: () => JSX.Element;
  renderSave: () => void;
};

export function Slots({ children, renderEmpty, onRender, footer, renderSave }: SlotsProps) {
  return (
    <section onClick={renderSave}>
      {children(1)}
      {renderEmpty()}
      {onRender()}
      {footer()}
    </section>
  );
}

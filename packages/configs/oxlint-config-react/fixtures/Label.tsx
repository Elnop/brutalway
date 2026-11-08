type LabelProps = { text: string };

export const LABEL_PREFIX = 'label';

export function Label({ text }: LabelProps) {
  return <span>{text}</span>;
}

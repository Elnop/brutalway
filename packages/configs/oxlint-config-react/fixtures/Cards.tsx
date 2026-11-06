type BadgeOptions = { label: string };
type CardProps = { title: string };

export type Size = 'small' | 'large';

export function Avatar({ url }) {
  return url;
}

export function Banner({ text }: { text: string }) {
  return text;
}

export function Badge({ label }: BadgeOptions) {
  return label;
}

export function Card({ title }: CardProps) {
  return title;
}

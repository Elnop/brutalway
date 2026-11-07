type ScoreLayoutProps = {
  scores: number[];
};

export function ScoreLayout({ scores }: ScoreLayoutProps) {
  return <p>{scores.filter((score) => score > 0).length}</p>;
}

export type ExternalLink = {
  doc: string;
  url: string;
  line: number;
};

export type LinkVerdict = 'alive' | 'dead' | 'unsure';

export type LinkResult = {
  verdict: LinkVerdict;
  reason: string;
};

export type DocLengthSettings = {
  maxLines: number;
  fileDepth: number;
  include: string[];
  ignore: string[];
  indexName: string;
  orderPrefix: boolean;
};

export type LongDoc = {
  path: string;
  lines: number;
};

export type WrittenFile = {
  path: string;
  content: string;
};

export type SplitPlan = {
  removed: string;
  written: WrittenFile[];
};

export type TextEdit = {
  start: number;
  end: number;
  text: string;
};

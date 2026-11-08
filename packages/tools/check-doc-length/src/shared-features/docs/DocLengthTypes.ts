export type DocLengthSettings = {
  maxLines: number;
  fileDepth: number;
  include: string[];
  ignore: string[];
  indexName: string;
  orderPrefix: boolean;
};

export type WrittenFile = {
  path: string;
  content: string;
};

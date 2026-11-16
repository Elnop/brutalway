export type OxlintDiagnostic = {
  code: string;
  filename: string;
  labels: { span: { line: number } }[];
};

export type OxlintReport = {
  diagnostics: OxlintDiagnostic[];
};

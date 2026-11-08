import { definePlugin } from '@oxlint/plugins';
import { fileNamedAfterExport } from '#src/features/file-named-after-export/fileNamedAfterExport.ts';

export default definePlugin({
  meta: { name: 'file-named-after-export' },
  rules: { 'file-named-after-export': fileNamedAfterExport },
});

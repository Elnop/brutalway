import { isRecord } from './isRecord.ts';

const PRINT_WIDTH = 200;
const INDENT = '  ';

function printInlineObject(record: Record<string, unknown>): string {
  const entries = Object.entries(record).map(([key, item]) => `${JSON.stringify(key)}: ${printInline(item)}`);
  return `{ ${entries.join(', ')} }`;
}

function printInline(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map((item) => printInline(item)).join(', ')}]`;
  if (isRecord(value)) return printInlineObject(value);
  return JSON.stringify(value);
}

function printEntry(key: string, value: unknown, indent: string, last: boolean): string {
  const head = `${indent}${JSON.stringify(key)}: `;
  const tail = last ? '' : ',';
  if (Array.isArray(value)) {
    const flat = `${head}${printInline(value)}${tail}`;
    if (flat.length <= PRINT_WIDTH) return flat;
    const items = value.map((item, index) => `${indent}${INDENT}${printInline(item)}${index === value.length - 1 ? '' : ','}`);
    return [`${head}[`, ...items, `${indent}]${tail}`].join('\n');
  }
  if (isRecord(value)) return `${head}${printObject(value, indent)}${tail}`;
  return `${head}${JSON.stringify(value)}${tail}`;
}

function printObject(record: Record<string, unknown>, indent: string): string {
  const entries = Object.entries(record);
  if (entries.length === 0) return '{}';
  const lines = entries.map(([key, value], index) => printEntry(key, value, `${indent}${INDENT}`, index === entries.length - 1));
  return `{\n${lines.join('\n')}\n${indent}}`;
}

export function formatJson(text: string, name: string): string {
  const config: unknown = JSON.parse(text);
  if (!isRecord(config)) throw new Error(`${name} is not an object`);
  return `${printObject(config, '')}\n`;
}

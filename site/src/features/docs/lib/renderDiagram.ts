import { DIAGRAM_FONT, DIAGRAM_THEME_CSS } from '@/features/docs/configs/DiagramConfig.ts';

function diagramId(source: string): string {
  let hash = 0;
  for (const character of source) hash = (hash * 31 + character.charCodeAt(0)) | 0;
  return `diagram-${(hash >>> 0).toString(36)}`;
}

export async function renderDiagram(source: string): Promise<string> {
  const { default: mermaid } = await import('mermaid');
  await document.fonts.load(`16px ${DIAGRAM_FONT}`);
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    suppressErrorRendering: true,
    theme: 'base',
    look: 'classic',
    fontFamily: DIAGRAM_FONT,
    themeCSS: DIAGRAM_THEME_CSS,
  });
  const { svg } = await mermaid.render(diagramId(source), source);
  return svg;
}

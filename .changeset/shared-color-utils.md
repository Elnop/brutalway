---
'@brutalway/oxlint-config-tailwind': patch
'@brutalway/stylelint-config': patch
---

The oklab conversion, the color distance and the cached reading of the color tokens come from the private `@brutalway/color-utils`, bundled into `dist` at build time. Each package keeps its own parsing of the stylesheet, and the reported colors and suggestions are the same.

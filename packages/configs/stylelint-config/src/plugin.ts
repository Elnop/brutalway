import stylelint from 'stylelint';
import { colorTokens } from '#src/features/color-tokens/lib/colorTokens.ts';
import { moduleNextToComponent } from '#src/features/module-next-to-component/moduleNextToComponent.ts';
import { noUnusedClass } from '#src/features/no-unused-class/lib/noUnusedClass.ts';

export default [colorTokens, moduleNextToComponent, noUnusedClass].map((rule) => stylelint.createPlugin(rule.ruleName, rule));

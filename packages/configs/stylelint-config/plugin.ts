import stylelint from 'stylelint';
import { colorTokens } from './colorTokens.ts';
import { moduleNextToComponent } from './moduleNextToComponent.ts';
import { noUnusedClass } from './noUnusedClass.ts';

export default [colorTokens, moduleNextToComponent, noUnusedClass].map((rule) => stylelint.createPlugin(rule.ruleName, rule));

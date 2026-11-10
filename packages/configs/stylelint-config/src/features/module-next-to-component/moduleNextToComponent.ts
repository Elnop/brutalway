import stylelint from 'stylelint';
import type { Rule } from 'stylelint';
import {
  cssModuleComponent,
  moduleName,
} from '#src/shared-features/css-modules/cssModuleComponent.ts';

const { utils } = stylelint;
const ruleName = 'brutalway/module-next-to-component';

const messages = utils.ruleMessages(ruleName, {
  alone: (name: string) =>
    `${name}.module.css has no ${name}.tsx next to it. Name the stylesheet after the component that imports it, or delete it if the component is gone.`,
});

export function moduleNextToComponent(primary: unknown): ReturnType<Rule> {
  return (root, result) => {
    if (!utils.validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;
    const file = root.source?.input.file;
    const name = moduleName(file);
    if (file === undefined || name === undefined || cssModuleComponent(file, name) !== undefined) {
      return;
    }
    utils.report({
      result,
      ruleName,
      message: messages.alone(name),
      node: root,
      index: 0,
      endIndex: 0,
    });
  };
}

moduleNextToComponent.ruleName = ruleName;
moduleNextToComponent.messages = messages;

import stylelint from 'stylelint';
import type { Rule } from 'stylelint';
import { classSelectors } from '#src/features/no-unused-class/lib/classSelectors.ts';
import {
  cssModuleComponent,
  moduleName,
} from '#src/shared-features/css-modules/cssModuleComponent.ts';
import { stylesImport, usedClassNames } from '#src/features/no-unused-class/lib/usedClassNames.ts';

const { utils } = stylelint;
const ruleName = 'brutalway/no-unused-class';

const messages = utils.ruleMessages(ruleName, {
  notImported: (component: string, stylesheet: string) =>
    `${component} does not import ${stylesheet}. Import it as styles, or delete the stylesheet.`,
  unused: (className: string, component: string, binding: string) =>
    `.${className} is not used by ${component}. Use ${binding}.${className} in the component, or delete the rule.`,
});

type LintRoot = Parameters<ReturnType<Rule>>[0];
type LintResult = Parameters<ReturnType<Rule>>[1];
type ModuleComponent = NonNullable<ReturnType<typeof cssModuleComponent>>;

function reportUnusedClasses(
  root: LintRoot,
  result: LintResult,
  component: ModuleComponent,
  binding: string,
): void {
  const used = usedClassNames(component.text, binding);
  const reported = new Set<string>();
  root.walkRules((rule) => {
    for (const className of classSelectors(rule.selector)) {
      if (used.has(className) || reported.has(className)) continue;
      reported.add(className);
      utils.report({
        result,
        ruleName,
        message: messages.unused(className, component.name, binding),
        node: rule,
        word: `.${className}`,
      });
    }
  });
}

export function noUnusedClass(primary: unknown): ReturnType<Rule> {
  return (root, result) => {
    if (!utils.validateOptions(result, ruleName, { actual: primary, possible: [true] })) return;
    const file = root.source?.input.file;
    const name = moduleName(file);
    const component =
      file === undefined || name === undefined ? undefined : cssModuleComponent(file, name);
    if (name === undefined || component === undefined) return;
    const stylesheet = `${name}.module.css`;
    const binding = stylesImport(component.text, stylesheet);
    if (binding === undefined) {
      utils.report({
        result,
        ruleName,
        message: messages.notImported(component.name, stylesheet),
        node: root,
        index: 0,
        endIndex: 0,
      });
      return;
    }
    reportUnusedClasses(root, result, component, binding);
  };
}

noUnusedClass.ruleName = ruleName;
noUnusedClass.messages = messages;

import { Root, Rule, Declaration, Comment, AtRule, Node } from 'postcss';

const INDENT = '  ';

function indent(str: string, indentLevel: number) {
  return `${Array(indentLevel + 1).join(INDENT)}${str}`;
}

function lineBreaks(str: string = '', initial: number = 0) {
  let count = initial + str.split('').reduce((p, c) => p + (c === '\n' ? 1 : 0), 0);
  return count > 1 ? Array(count).join('\n') : '';
}

function printDeclaration(decl: Declaration, indentLevel: number) {
  const property = decl.prop.startsWith('@') ? decl.prop : decl.prop.toLocaleLowerCase();
  let output = `${property}: ${decl.value}`;

  if (decl.important) {
    output += ' !important';
  }

  output += ';';

  return lineBreaks(decl.raws.before) + indent(output, indentLevel) + lineBreaks(decl.raws.after);
}

function printComment(comment: Comment, indentLevel: number) {
  return (
    lineBreaks(comment.raws.before) +
    indent(`/* ${comment.text} */`, indentLevel) +
    lineBreaks(comment.raws.after)
  );
}

function printRule(rule: Rule, indentLevel: number) {
  let output = '';

  const emptyRule = rule.nodes == null || rule.nodes.length === 0;
  const selectors = rule.selector.split(',').map(s => indent(s.trim(), indentLevel)).join(',\n');

  output += `${selectors} ${emptyRule ? "{}" : "{"}\n`;

  (rule.nodes || []).forEach(node => {
    output += printNode(node, indentLevel + 1);
    output += '\n';
  });

  if (!emptyRule) {
    output += indent(`}\n`, indentLevel);
  }

  return output;
}

function printAtRule(atRule: AtRule, indentLevel: number) {
  let output = indent(`@${atRule.name}`, indentLevel);
  if (atRule.params) {
    output += ' ' + atRule.params;
  }

  const { nodes } = atRule;
  if (nodes) {
    output += ' {\n';
    nodes.forEach((node, index) => {
      output += printNode(node, indentLevel + 1);
      if (node.type !== 'rule') {
        output += `\n`;
      }
    });
    output += indent(`}\n`, indentLevel);
  } else {
    output += ';';
    output += '\n';
  }

  return output;
}

function printNode(node: Node, indentLevel: number) {
  switch (node.type) {
    case 'rule':
      return printRule(node as Rule, indentLevel);
    case 'atrule':
      return printAtRule(node as AtRule, indentLevel);
    case 'comment':
      return printComment(node as Comment, indentLevel);
    case 'decl':
      return printDeclaration(node as Declaration, indentLevel);
    default:
      console.error(`Unknown node type: "${node.type}"`);
  }
}

export function print(tree: Root) {
  let output = '';

  const { nodes } = tree;
  if (nodes) {
    nodes.forEach((node, nodeIndex) => {
      output += printNode(node, 0);
      if (nodeIndex < nodes.length - 1) {
        output += `\n`;
      }
    });
  }

  return output;
}
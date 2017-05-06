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
  let output = `${decl.prop.toLowerCase()}: ${decl.value}`;

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

function printBlockComment(comment: Comment, indentLevel: number) {
  const lines = [
    '/*',
    ' ' + comment.text,
    ' */',
    ''
  ]
    .map(line => indent(line, indentLevel))
    .join('\n');
  return lineBreaks(comment.raws.before, -1) + lines + lineBreaks(comment.raws.after);
}

function printRule(rule: Rule, indentLevel: number) {
  let output = '';

  const emptyRule = rule.nodes == null || rule.nodes.length === 0;
  const selectors = rule.selector.split(',').map(s => indent(s.trim(), indentLevel)).join(',\n');

  output += `${selectors} ${emptyRule ? "{}" : "{"}\n`;

  (rule.nodes || []).forEach(node => {
    switch (node.type) {
      case 'decl':
        output += printDeclaration(node as Declaration, indentLevel + 1);
        break;
      case 'comment':
        output += printComment(node as Comment, indentLevel + 1);
        break;
      default:
      // console.log(node.type, node);
    }
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
  } else {
    output += ';';
  }

  if (nodes) {
    nodes.forEach((node, index) => {
      switch (node.type) {
        case 'rule':
          output += printRule(node as Rule, indentLevel + 1);
          break;
        case 'decl':
          output += printDeclaration(node as Declaration, indentLevel + 1);
          if (index === nodes.length - 1) {
            output += `\n`;
          }
          break;
        default:
        // console.log(node.type, node);
      }
      if (index < nodes.length - 1) {
        output += `\n`;
      }
    });
  }

  if (atRule.nodes) {
    output += indent(`}\n`, indentLevel);
  } else {
    output += '\n';
  }

  return output;
}

export function print(tree: Root) {
  let output = '';

  const { nodes } = tree;
  if (nodes) {
    nodes.forEach((node, nodeIndex) => {
      switch (node.type) {
        case 'rule':
          output += printRule(node as Rule, 0);
          break;
        case 'atrule':
          output += printAtRule(node as AtRule, 0);
          break;
        case 'comment':
          output += printBlockComment(node as Comment, 0);
          break;
        default:
        // console.log(node.type, node);
      }

      if (nodeIndex < nodes.length - 1) {
        output += `\n`;
      }
    });
  }

  return output;
}
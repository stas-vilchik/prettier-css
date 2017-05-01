"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const INDENT = '  ';
function indent(str, indentLevel) {
    return `${Array(indentLevel + 1).join(INDENT)}${str}`;
}
function lineBreaks(str = '', initial = 0) {
    let count = initial + str.split('').reduce((p, c) => p + (c === '\n' ? 1 : 0), 0);
    return count > 1 ? Array(count).join('\n') : '';
}
function printDeclaration(decl, indentLevel) {
    let output = `${decl.prop}: ${decl.value}`;
    if (decl.important) {
        output += ' !important';
    }
    output += ';';
    return lineBreaks(decl.raws.before) + indent(output, indentLevel) + lineBreaks(decl.raws.after);
}
function printComment(comment, indentLevel) {
    return (lineBreaks(comment.raws.before) +
        indent(`/* ${comment.text} */`, indentLevel) +
        lineBreaks(comment.raws.after));
}
function printBlockComment(comment, indentLevel) {
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
function printRule(rule, indentLevel) {
    let output = '';
    const emptyRule = rule.nodes.length === 0;
    const selectors = rule.selector.split(',').map(s => indent(s.trim(), indentLevel)).join(',\n');
    output += `${selectors} ${emptyRule ? "{}" : "{"}\n`;
    rule.nodes.forEach(node => {
        switch (node.type) {
            case 'decl':
                output += printDeclaration(node, indentLevel + 1);
                break;
            case 'comment':
                output += printComment(node, indentLevel + 1);
                break;
            default:
                console.log(node.type, node);
        }
        output += '\n';
    });
    if (!emptyRule) {
        output += indent(`}\n`, indentLevel);
    }
    return output;
}
function printAtRule(atRule, indentLevel) {
    let output = indent(`@${atRule.name} ${atRule.params ? atRule.params + ' ' : ''}{\n`, indentLevel);
    atRule.nodes.forEach((node, index) => {
        switch (node.type) {
            case 'rule':
                output += printRule(node, indentLevel + 1);
                break;
            case 'decl':
                output += printDeclaration(node, indentLevel + 1);
                if (index === atRule.nodes.length - 1) {
                    output += `\n`;
                }
                break;
            default:
                console.log(node.type, node);
        }
        if (index < atRule.nodes.length - 1) {
            output += `\n`;
        }
    });
    output += indent(`}\n`, indentLevel);
    return output;
}
function print(tree) {
    let output = '';
    tree.nodes.forEach((node, nodeIndex) => {
        switch (node.type) {
            case 'rule':
                output += printRule(node, 0);
                break;
            case 'atrule':
                output += printAtRule(node, 0);
                break;
            case 'comment':
                output += printBlockComment(node, 0);
                break;
            default:
                console.log(node.type, node);
        }
        if (nodeIndex < tree.nodes.length - 1) {
            output += `\n`;
        }
    });
    return output;
}
exports.print = print;
//# sourceMappingURL=printer.js.map
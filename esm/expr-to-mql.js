import "core-js/modules/es.function.name";
import "core-js/modules/es.object.define-property";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import jsep from 'jsep';
import validateAST from './utils/validate-ast';
import { isNumber } from 'lodash'; // maps binary expression operators to their respective agg operators

var BINARY_OPERATOR_MAP = {
  '+': '$sum',
  '-': '$subtract',
  '*': '$multiply',
  '/': '$divide'
}; // expression builder function for BinaryExpression nodes

var binaryExpressionFn = function binaryExpressionFn(node) {
  return _defineProperty({}, BINARY_OPERATOR_MAP[node.operator], [mapNodeToMQL(node.left), mapNodeToMQL(node.right)]);
}; // expression builder function for UnaryExpression nodes


var unaryExpressionFn = function unaryExpressionFn(node) {
  // if positive, just continue with argument
  if (node.operator === '+') {
    return mapNodeToMQL(node.argument);
  } // for literals, we can return the negative value


  if (node.argument.type === 'Literal' && isNumber(node.argument.value)) {
    return -node.argument.value;
  } // flatten nested unary expressions


  if (node.argument.type === 'UnaryExpression') {
    node.argument.operator = node.argument.operator === '+' ? '-' : '+';
    return mapNodeToMQL(node.argument);
  } // for everything else, multiply with -1 in the agg framework


  return {
    $multiply: [-1, mapNodeToMQL(node.argument)]
  };
}; // expression builder function for Literal nodes


var literalExpressionFn = function literalExpressionFn(node) {
  return isNumber(node.value) ? node.value : "$".concat(node.value);
}; // expression builder function for Identifier nodes


var identifierExpressionFn = function identifierExpressionFn(node) {
  return "$".concat(node.name);
}; // maps AST node types to their expression builder functions


var expressionMap = {
  BinaryExpression: binaryExpressionFn,
  UnaryExpression: unaryExpressionFn,
  Literal: literalExpressionFn,
  Identifier: identifierExpressionFn
};
/**
 * recursive function calling different helper functions
 * depending on the node type.
 *
 * @param  {Object} node    AST node object
 * @return {Object}         MQL representation of the node
 */

var mapNodeToMQL = function mapNodeToMQL(node) {
  return expressionMap[node.type](node);
};
/**
 * main function to convert an expression string into
 * an MQL aggregation language object.
 *
 * @param  {String} expr    arithmetic expression
 * @return {Object}         MQL query object
 */


function exprToMQL(expr) {
  // parse expression into AST
  var ast = jsep(expr); // throws if expression is not valid

  validateAST(ast); // recursively map the AST to MQL syntax

  return mapNodeToMQL(ast);
}

export default exprToMQL;
export { exprToMQL };
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exprToMQL = exprToMQL;
exports.default = void 0;

var _jsep = _interopRequireDefault(require("jsep"));

var _validateAst = _interopRequireDefault(require("./utils/validate-ast"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// maps binary expression operators to their respective agg operators
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


  if (node.argument.type === 'Literal') {
    return -node.argument.value;
  } // for everything else, multiply with -1 in the agg framework


  return {
    $multiply: [-1, mapNodeToMQL(node.argument)]
  };
}; // expression builder function for Literal nodes


var literalExpressionFn = function literalExpressionFn(node) {
  return node.value;
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
  var ast = (0, _jsep.default)(expr); // throws if expression is not valid

  (0, _validateAst.default)(ast); // recursively map the AST to MQL syntax

  return mapNodeToMQL(ast);
}

var _default = exprToMQL;
exports.default = _default;
"use strict";

var DEFAULT_ALLOWED_NODE_TYPES = ['BinaryExpression', 'UnaryExpression', 'MemberExpression', 'Literal'];
var DEFAULT_ALLOWED_BINARY_OPERATORS = ['+', '-', '*', '/'];
var DEFAULT_ALLOWED_UNARY_OPERATORS = ['+', '-'];

function validateAST() {
  var allowedNodeTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_ALLOWED_NODE_TYPES;
  var allowedUnaryOperators = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_ALLOWED_UNARY_OPERATORS;
  var allowedBinaryOperators = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_ALLOWED_BINARY_OPERATORS;
}
"use strict";

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _traverseAst = _interopRequireDefault(require("./traverse-ast"));

var _errorMsg = require("./error-msg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const DEFAULT_ALLOWED_LITERAL_TYPES = ['number', 'string'];
const DEFAULT_ALLOWED_BINARY_OPERATORS = ['+', '-', '*', '/'];
const DEFAULT_ALLOWED_UNARY_OPERATORS = ['+', '-'];
const DEFAULT_ALLOWED_NODE_TYPES = ['BinaryExpression', 'UnaryExpression', 'MemberExpression', 'Identifier', 'Literal'];

function validateAST(ast, {
  allowedNodeTypes = DEFAULT_ALLOWED_NODE_TYPES,
  allowedLiteralTypes = DEFAULT_ALLOWED_LITERAL_TYPES,
  allowedUnaryOperators = DEFAULT_ALLOWED_UNARY_OPERATORS,
  allowedBinaryOperators = DEFAULT_ALLOWED_BINARY_OPERATORS
} = {}) {
  function validateNodes(nodeArray) {
    nodeArray.forEach(node => {
      // check if the node type is allowed
      if (!allowedNodeTypes.includes(node.type)) {
        throw new Error((0, _errorMsg.notOneOfSetError)('node type', node.type, allowedNodeTypes));
      } // for binary expressions, check if the operator is supported


      if (node.type === 'BinaryExpression') {
        if (!allowedBinaryOperators.includes(node.operator)) {
          throw new Error((0, _errorMsg.notOneOfSetError)('binary expression operator', node.operator, allowedBinaryOperators));
        }
      } // for unary expressions, check if the operator is supported


      if (node.type === 'UnaryExpression') {
        if (!allowedUnaryOperators.includes(node.operator)) {
          throw new Error((0, _errorMsg.notOneOfSetError)('unary expression operator', node.operator, allowedUnaryOperators));
        }
      } // for Literal node types, only allow whitelisted types


      if (node.type === 'Literal') {
        const type = typeof node.value;

        if (!allowedLiteralTypes.includes(type)) {
          throw new Error((0, _errorMsg.notOneOfSetError)('literal type', type, allowedLiteralTypes));
        }
      }
    });
  }

  const nodeArray = Array.from((0, _traverseAst.default)(ast));
  validateNodes(nodeArray);
}

var _default = validateAST;
exports.default = _default;
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _traverseAst = _interopRequireDefault(require("./traverse-ast"));

var _errorMsg = require("./error-msg");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var DEFAULT_ALLOWED_LITERAL_TYPES = ['number', 'string'];
var DEFAULT_ALLOWED_BINARY_OPERATORS = ['+', '-', '*', '/'];
var DEFAULT_ALLOWED_UNARY_OPERATORS = ['+', '-'];
var DEFAULT_ALLOWED_NODE_TYPES = ['BinaryExpression', 'UnaryExpression', 'MemberExpression', 'Identifier', 'Literal'];

function validateAST(ast) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$allowedNodeTypes = _ref.allowedNodeTypes,
      allowedNodeTypes = _ref$allowedNodeTypes === void 0 ? DEFAULT_ALLOWED_NODE_TYPES : _ref$allowedNodeTypes,
      _ref$allowedLiteralTy = _ref.allowedLiteralTypes,
      allowedLiteralTypes = _ref$allowedLiteralTy === void 0 ? DEFAULT_ALLOWED_LITERAL_TYPES : _ref$allowedLiteralTy,
      _ref$allowedUnaryOper = _ref.allowedUnaryOperators,
      allowedUnaryOperators = _ref$allowedUnaryOper === void 0 ? DEFAULT_ALLOWED_UNARY_OPERATORS : _ref$allowedUnaryOper,
      _ref$allowedBinaryOpe = _ref.allowedBinaryOperators,
      allowedBinaryOperators = _ref$allowedBinaryOpe === void 0 ? DEFAULT_ALLOWED_BINARY_OPERATORS : _ref$allowedBinaryOpe;

  function validateNodes(nodeArray) {
    nodeArray.forEach(function (node) {
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
        var type = _typeof(node.value);

        if (!allowedLiteralTypes.includes(type)) {
          throw new Error((0, _errorMsg.notOneOfSetError)('literal type', type, allowedLiteralTypes));
        }
      }
    });
  }

  var nodeArray = Array.from((0, _traverseAst.default)(ast));
  validateNodes(nodeArray);
}

var _default = validateAST;
exports.default = _default;
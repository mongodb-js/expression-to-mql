"use strict";

var _validateAst = _interopRequireDefault(require("./validate-ast"));

var _chai = require("chai");

var _jsep = _interopRequireDefault(require("jsep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Validate AST', function () {
  describe('Node types', function () {
    context('with default node types', function () {
      it('validates correctly when the AST only includes valid node types', function () {
        var tree = (0, _jsep.default)('foo + (16.3 * bar)');
        (0, _chai.expect)(_validateAst.default.bind(null, tree)).to.not.throw();
      });
      it('throws when the AST includes an invalid node type', function () {
        var tree = (0, _jsep.default)('round(16.334)');
        (0, _chai.expect)(_validateAst.default.bind(null, tree)).to.throw(/Invalid node type "CallExpression"/);
      });
    });
    context('with custom node types', function () {
      it('validates correctly when the AST only includes valid node types', function () {
        var tree = (0, _jsep.default)('1 - 3 * 5 + 9');
        (0, _chai.expect)(_validateAst.default.bind(null, tree, {
          allowedNodeTypes: ['BinaryExpression', 'Literal']
        })).to.not.throw();
      });
      it('throws when the AST includes an invalid node type', function () {
        var tree = (0, _jsep.default)('-5.3');
        (0, _chai.expect)(_validateAst.default.bind(null, tree)).to.not.throw();
        (0, _chai.expect)(_validateAst.default.bind(null, tree, {
          allowedNodeTypes: ['BinaryExpression']
        })).to.throw(/Invalid node type "UnaryExpression"/);
      });
    });
  });
  describe('Binary Operators', function () {
    context('with default binary operators', function () {
      it('validates correctly when the AST only includes valid binary operators', function () {
        var tree = (0, _jsep.default)('1 + 2 - 3 / 4 * 5');
        (0, _chai.expect)(_validateAst.default.bind(null, tree)).to.not.throw();
      });
      it('throws when the AST includes an invalid binary operator', function () {
        var tree = (0, _jsep.default)('1 + 2 - 3 ^ 4 * 5');
        (0, _chai.expect)(_validateAst.default.bind(null, tree)).to.throw(/Invalid binary expression operator/);
      });
    });
    context('with custom binary operators', function () {
      it('validates correctly when the AST only includes valid binary operators', function () {
        var tree = (0, _jsep.default)('1 + 2 ^ 3 + 4');
        (0, _chai.expect)(_validateAst.default.bind(null, tree, {
          allowedBinaryOperators: ['+', '^']
        })).to.not.throw();
      });
      it('throws when the AST includes an invalid binary operator', function () {
        var tree = (0, _jsep.default)('1 + 2 - 3 ^ 4 * 5');
        (0, _chai.expect)(_validateAst.default.bind(null, tree, {
          allowedBinaryOperators: ['+', '^']
        })).to.throw(/Invalid binary expression operator/);
      });
    });
  });
  describe('Unary Operators', function () {
    context('with default unary operators', function () {
      it('validates correctly when the AST only includes valid unary operators', function () {
        var tree = (0, _jsep.default)('-foo - (+bar)');
        (0, _chai.expect)(_validateAst.default.bind(null, tree)).to.not.throw();
      });
    });
    context('with custom unary operators', function () {
      it('validates correctly when the AST only includes valid unary operators', function () {
        var tree = (0, _jsep.default)('-foo + (-bar)');
        (0, _chai.expect)(_validateAst.default.bind(null, tree, {
          allowedUnaryOperators: ['-']
        })).to.not.throw();
      });
      it('throws when the AST includes an invalid unary operator', function () {
        var tree = (0, _jsep.default)('-foo + (+bar)');
        (0, _chai.expect)(_validateAst.default.bind(null, tree, {
          allowedUnaryOperators: ['-']
        })).to.throw(/Invalid unary expression operator/);
      });
    });
  });
});
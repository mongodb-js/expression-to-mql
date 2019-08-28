"use strict";

var _traverseAst = _interopRequireWildcard(require("./traverse-ast"));

var _chai = require("chai");

var _jsep = _interopRequireDefault(require("jsep"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

describe('Traverse AST', function () {
  describe('traversal mode', function () {
    it('does not accept an invalid traversal mode', function () {
      (0, _chai.expect)(function () {
        return Array.from((0, _traverseAst.default)(null, {
          traversalMode: 'foofix'
        }));
      }).to.throw(/Invalid traversal mode/);
    });

    _traverseAst.TRAVERSAL_MODES.forEach(function (mode) {
      it("accepts traversal mode ".concat(mode), function () {
        (0, _chai.expect)(function () {
          return Array.from((0, _traverseAst.default)(null, mode));
        }).to.not.throw();
      });
    });

    it('traverses a simple binary expression in prefix mode', function () {
      var tree = (0, _jsep.default)('foo + bar');
      var result = Array.from((0, _traverseAst.default)(tree, {
        traversalMode: 'prefix'
      }));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(3);
      var types = (0, _lodash.map)(result, 'type');
      (0, _chai.expect)(types).to.deep.equal(['BinaryExpression', 'Identifier', 'Identifier']);
    });
    it('traverses a simple binary expression in infix mode', function () {
      var tree = (0, _jsep.default)('foo + bar');
      var result = Array.from((0, _traverseAst.default)(tree));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(3);
      var types = (0, _lodash.map)(result, 'type');
      (0, _chai.expect)(types).to.deep.equal(['Identifier', 'BinaryExpression', 'Identifier']);
    });
    it('traverses a simple binary expression in postfix mode', function () {
      var tree = (0, _jsep.default)('foo + bar');
      var result = Array.from((0, _traverseAst.default)(tree, {
        traversalMode: 'postfix'
      }));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(3);
      var types = (0, _lodash.map)(result, 'type');
      (0, _chai.expect)(types).to.deep.equal(['Identifier', 'Identifier', 'BinaryExpression']);
    });
  });
  describe('error handling', function () {
    it('throws an error if a node does not have a type', function () {
      var brokenTree = {
        left: {
          type: 'Identifier',
          name: 'foo'
        },
        right: {
          type: 'Identifier',
          name: 'bar'
        }
      };
      (0, _chai.expect)(function () {
        return Array.from((0, _traverseAst.default)(brokenTree));
      }).to.throw(/Invalid tree format/);
    });
  });
  describe('null / empty trees', function () {
    it('does not yield any values for a null tree', function () {
      var result = Array.from((0, _traverseAst.default)(null));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(0);
    });
    it('does not yield any values for a tree from an empty string', function () {
      var tree = (0, _jsep.default)('');
      var result = Array.from((0, _traverseAst.default)(tree));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(0);
    });
  });
  describe('BinaryExpression', function () {
    it('traverses the left and right children', function () {
      var tree = (0, _jsep.default)('1 + 2');
      var result = Array.from((0, _traverseAst.default)(tree));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(3);
      var types = (0, _lodash.map)(result, 'type');
      (0, _chai.expect)(types).to.deep.equal(['Literal', 'BinaryExpression', 'Literal']);
    });
  });
  describe('UnaryExpression', function () {
    it('traverses the argument child', function () {
      var tree = (0, _jsep.default)('-1');
      var result = Array.from((0, _traverseAst.default)(tree));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(2);
      var types = (0, _lodash.map)(result, 'type');
      (0, _chai.expect)(types).to.deep.equal(['UnaryExpression', 'Literal']);
    });
  });
  describe('collapse MemberExpression nodes to a single Identifier', function () {
    it('collapses a one-level member node correctly', function () {
      var tree = (0, _jsep.default)('foo.bar');
      var result = Array.from((0, _traverseAst.default)(tree));
      (0, _chai.expect)(result[0]).to.include({
        type: 'Identifier',
        name: 'foo.bar'
      });
    });
    it('collapses a multi-level member nodes correctly', function () {
      var tree = (0, _jsep.default)('foo.bar.baz.boom');
      var result = Array.from((0, _traverseAst.default)(tree));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(1);
      (0, _chai.expect)(result[0]).to.include({
        type: 'Identifier',
        name: 'foo.bar.baz.boom'
      });
    });
    it('works inside an expression', function () {
      var tree = (0, _jsep.default)('foo.bar + baz.boom');
      var result = Array.from((0, _traverseAst.default)(tree));
      (0, _chai.expect)(result).to.be.an('array').with.lengthOf(3);
      (0, _chai.expect)(result[0]).to.include({
        type: 'Identifier',
        name: 'foo.bar'
      });
      (0, _chai.expect)(result[1]).to.include({
        type: 'BinaryExpression',
        operator: '+'
      });
      (0, _chai.expect)(result[2]).to.include({
        type: 'Identifier',
        name: 'baz.boom'
      });
    });
  });
});
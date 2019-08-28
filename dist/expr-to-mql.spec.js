"use strict";

var _exprToMql = _interopRequireDefault(require("./expr-to-mql"));

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('exprToMQL', function () {
  it('works for literals', function () {
    var mql = (0, _exprToMql.default)('1 + 2');
    (0, _chai.expect)(mql).to.be.deep.equal({
      $sum: [1, 2]
    });
  });
  it('works for identifiers', function () {
    var mql = (0, _exprToMql.default)('var1 + var2');
    (0, _chai.expect)(mql).to.be.deep.equal({
      $sum: ['$var1', '$var2']
    });
  });
  it('works for identifiers with underscores and capital letters', function () {
    var mql = (0, _exprToMql.default)('My_Var + YOUR_VAR');
    (0, _chai.expect)(mql).to.be.deep.equal({
      $sum: ['$My_Var', '$YOUR_VAR']
    });
  });
  it('throws for identifiers starting with a digit', function () {
    (0, _chai.expect)(_exprToMql.default.bind(null, '1two + 3four')).to.throw(/Variable names cannot start with a number/);
  });
  it('prioritises parenthesis correctly', function () {
    var mql = (0, _exprToMql.default)('(3 - 4) * 5');
    (0, _chai.expect)(mql).to.be.deep.equal({
      $multiply: [{
        $subtract: [3, 4]
      }, 5]
    });
  });
  it('supports field paths in dot notation', function () {
    var mql = (0, _exprToMql.default)('foo.bar / 2.1');
    (0, _chai.expect)(mql).to.be.deep.equal({
      $divide: ['$foo.bar', 2.1]
    });
  });
  it('throws on function syntax', function () {
    (0, _chai.expect)(_exprToMql.default.bind(null, '1 + sum(3, 4)')).to.throw(/Invalid node type "CallExpression"/);
  });
  describe('examples', function () {
    var examples = [{
      input: '1',
      output: 1
    }, {
      input: '+1',
      output: 1
    }, {
      input: '-1',
      output: -1
    }, {
      input: '--1',
      output: {
        $multiply: [-1, -1]
      }
    }, {
      input: '++++++1',
      output: 1
    }, {
      input: 'foo',
      output: '$foo'
    }, {
      input: '+foo',
      output: '$foo'
    }, {
      input: '-foo',
      output: {
        $multiply: [-1, '$foo']
      }
    }, {
      input: 'foo.bar',
      output: '$foo.bar'
    }, {
      input: '-foo.bar',
      output: {
        $multiply: [-1, '$foo.bar']
      }
    }, {
      input: '1 + 2',
      output: {
        $sum: [1, 2]
      }
    }, {
      input: '1 / foo',
      output: {
        $divide: [1, '$foo']
      }
    }, {
      input: 'foo.bar - bar.baz',
      output: {
        $subtract: ['$foo.bar', '$bar.baz']
      }
    }, {
      input: '(foo * 1.5) - bar + (foo.bar / 2)',
      output: {
        $sum: [{
          $subtract: [{
            $multiply: ['$foo', 1.5]
          }, '$bar']
        }, {
          $divide: ['$foo.bar', 2]
        }]
      }
    }];
    examples.forEach(function (ex) {
      it("".concat(ex.input), function () {
        var mql = (0, _exprToMql.default)(ex.input);
        (0, _chai.expect)(mql).to.be.deep.equal(ex.output);
      });
    });
  });
});
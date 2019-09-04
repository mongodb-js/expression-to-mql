import exprToMQL from '../src/expr-to-mql';
import { expect } from 'chai';

describe('exprToMQL', function() {
  it('works for numeric literals', function() {
    const mql = exprToMQL('1 + 2');
    expect(mql).to.be.deep.equal({ $sum: [1, 2] });
  });
  it('flattens repeated unary operators', function() {
    const mql = exprToMQL('--1 - --1');
    expect(mql).to.be.deep.equal({ $subtract: [1, 1] });
  });
  it('works for string literals', function() {
    const mql = exprToMQL('"field" + "other"');
    expect(mql).to.be.deep.equal({ $sum: ['$field', '$other'] });
  });
  it('works for string literals with spaces', function() {
    const mql = exprToMQL('"some field" / 2');
    expect(mql).to.be.deep.equal({ $divide: ['$some field', 2] });
  });
  it('throws for invalid literal types', function() {
    expect(exprToMQL.bind(null, '3 + false')).to.throw(
      /Invalid literal type "boolean"/
    );
  });
  it('works for identifiers', function() {
    const mql = exprToMQL('var1 + var2');
    expect(mql).to.be.deep.equal({ $sum: ['$var1', '$var2'] });
  });
  it('works for identifiers with underscores and capital letters', function() {
    const mql = exprToMQL('My_Var + YOUR_VAR');
    expect(mql).to.be.deep.equal({ $sum: ['$My_Var', '$YOUR_VAR'] });
  });
  it('throws for identifiers starting with a digit', function() {
    expect(exprToMQL.bind(null, '1two + 3four')).to.throw(
      /Variable names cannot start with a number/
    );
  });
  it('prioritises parenthesis correctly', function() {
    const mql = exprToMQL('(3 - 4) * 5');
    expect(mql).to.be.deep.equal({ $multiply: [{ $subtract: [3, 4] }, 5] });
  });
  it('supports field paths in dot notation', function() {
    const mql = exprToMQL('foo.bar / 2.1');
    expect(mql).to.be.deep.equal({ $divide: ['$foo.bar', 2.1] });
  });
  it('throws on function syntax', function() {
    expect(exprToMQL.bind(null, '1 + sum(3, 4)')).to.throw(
      /Invalid node type "CallExpression"/
    );
  });
  describe('examples', function() {
    const examples = [
      { input: '1', output: 1 },
      { input: '+1', output: 1 },
      { input: '-1', output: -1 },
      { input: '--1', output: 1 },
      { input: '---1', output: -1 },
      { input: '----1', output: 1 },
      { input: '++++++1', output: 1 },
      { input: 'foo', output: '$foo' },
      { input: '+foo', output: '$foo' },
      { input: '-foo', output: { $multiply: [-1, '$foo'] } },
      { input: 'foo.bar', output: '$foo.bar' },
      { input: '-foo.bar', output: { $multiply: [-1, '$foo.bar'] } },
      { input: '-"foo bar"', output: { $multiply: [-1, '$foo bar'] } },
      {
        input: 'foo--bar',
        output: { $subtract: ['$foo', { $multiply: [-1, '$bar'] }] }
      },
      {
        input: '"foo"--"bar"',
        output: { $subtract: ['$foo', { $multiply: [-1, '$bar'] }] }
      },
      { input: '1 + 2', output: { $sum: [1, 2] } },
      { input: '1 / foo', output: { $divide: [1, '$foo'] } },
      {
        input: 'foo.bar - bar.baz',
        output: { $subtract: ['$foo.bar', '$bar.baz'] }
      },
      {
        input: '(foo * 1.5) - bar + (foo.bar / 2)',
        output: {
          $sum: [
            { $subtract: [{ $multiply: ['$foo', 1.5] }, '$bar'] },
            { $divide: ['$foo.bar', 2] }
          ]
        }
      }
    ];

    examples.forEach(function(ex) {
      it(`${ex.input}`, function() {
        const mql = exprToMQL(ex.input);
        expect(mql).to.be.deep.equal(ex.output);
      });
    });
  });
});

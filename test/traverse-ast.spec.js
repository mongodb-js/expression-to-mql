import traverseAST, { TRAVERSAL_MODES } from '../src/utils/traverse-ast';
import { expect } from 'chai';
import jsep from 'jsep';
import { map } from 'lodash';

describe('Traverse AST', function() {
  describe('traversal mode', function() {
    it('does not accept an invalid traversal mode', function() {
      expect(() =>
        Array.from(traverseAST(null, { traversalMode: 'foofix' }))
      ).to.throw(/Invalid traversal mode/);
    });
    TRAVERSAL_MODES.forEach(mode => {
      it(`accepts traversal mode ${mode}`, function() {
        expect(() => Array.from(traverseAST(null, mode))).to.not.throw();
      });
    });
    it('traverses a simple binary expression in prefix mode', function() {
      const tree = jsep('foo + bar');
      const result = Array.from(traverseAST(tree, { traversalMode: 'prefix' }));
      expect(result)
        .to.be.an('array')
        .with.lengthOf(3);

      const types = map(result, 'type');
      expect(types).to.deep.equal([
        'BinaryExpression',
        'Identifier',
        'Identifier'
      ]);
    });
    it('traverses a simple binary expression in infix mode', function() {
      const tree = jsep('foo + bar');
      const result = Array.from(traverseAST(tree));
      expect(result)
        .to.be.an('array')
        .with.lengthOf(3);

      const types = map(result, 'type');
      expect(types).to.deep.equal([
        'Identifier',
        'BinaryExpression',
        'Identifier'
      ]);
    });
    it('traverses a simple binary expression in postfix mode', function() {
      const tree = jsep('foo + bar');
      const result = Array.from(
        traverseAST(tree, { traversalMode: 'postfix' })
      );
      expect(result)
        .to.be.an('array')
        .with.lengthOf(3);

      const types = map(result, 'type');
      expect(types).to.deep.equal([
        'Identifier',
        'Identifier',
        'BinaryExpression'
      ]);
    });
  });
  describe('error handling', function() {
    it('throws an error if a node does not have a type', function() {
      const brokenTree = {
        left: { type: 'Identifier', name: 'foo' },
        right: { type: 'Identifier', name: 'bar' }
      };
      expect(() => Array.from(traverseAST(brokenTree))).to.throw(
        /Invalid tree format/
      );
    });
  });
  describe('null / empty trees', function() {
    it('does not yield any values for a null tree', function() {
      const result = Array.from(traverseAST(null));
      expect(result)
        .to.be.an('array')
        .with.lengthOf(0);
    });
    it('does not yield any values for a tree from an empty string', function() {
      const tree = jsep('');
      const result = Array.from(traverseAST(tree));
      expect(result)
        .to.be.an('array')
        .with.lengthOf(0);
    });
  });
  describe('BinaryExpression', function() {
    it('traverses the left and right children', function() {
      const tree = jsep('1 + 2');
      const result = Array.from(traverseAST(tree));
      expect(result)
        .to.be.an('array')
        .with.lengthOf(3);

      const types = map(result, 'type');
      expect(types).to.deep.equal(['Literal', 'BinaryExpression', 'Literal']);
    });
  });
  describe('UnaryExpression', function() {
    it('traverses the argument child', function() {
      const tree = jsep('-1');
      const result = Array.from(traverseAST(tree));
      expect(result)
        .to.be.an('array')
        .with.lengthOf(2);

      const types = map(result, 'type');
      expect(types).to.deep.equal(['UnaryExpression', 'Literal']);
    });
  });
  describe('collapse MemberExpression nodes to a single Identifier', function() {
    it('collapses a one-level member node correctly', function() {
      const tree = jsep('foo.bar');
      const result = Array.from(traverseAST(tree));
      expect(result[0]).to.include({ type: 'Identifier', name: 'foo.bar' });
    });
    it('collapses a multi-level member nodes correctly', function() {
      const tree = jsep('foo.bar.baz.boom');
      const result = Array.from(traverseAST(tree));
      expect(result)
        .to.be.an('array')
        .with.lengthOf(1);
      expect(result[0]).to.include({
        type: 'Identifier',
        name: 'foo.bar.baz.boom'
      });
    });
    it('works inside an expression', function() {
      const tree = jsep('foo.bar + baz.boom');
      const result = Array.from(traverseAST(tree));
      expect(result)
        .to.be.an('array')
        .with.lengthOf(3);
      expect(result[0]).to.include({
        type: 'Identifier',
        name: 'foo.bar'
      });
      expect(result[1]).to.include({
        type: 'BinaryExpression',
        operator: '+'
      });
      expect(result[2]).to.include({
        type: 'Identifier',
        name: 'baz.boom'
      });
    });
  });
});

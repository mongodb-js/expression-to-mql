import traverseAST, { TRAVERSAL_MODES } from './traverse-ast';
import { expect } from 'chai';
import jsep from 'jsep';
import { map } from 'lodash';

describe('Traverse AST', function() {
  describe('traversal mode', function() {
    it('does not accept an invalid traversal mode', function() {
      expect(() => Array.from(traverseAST(null, 'foofix'))).to.throw(
        /Invalid traversal mode/
      );
    });
    TRAVERSAL_MODES.forEach(mode => {
      it(`accepts traversal mode ${mode}`, function() {
        expect(() => Array.from(traverseAST(null, mode))).to.not.throw();
      });
    });
    it('traverses a simple binary expression in prefix mode', function() {
      const tree = jsep('foo + bar');
      const result = Array.from(traverseAST(tree, 'prefix'));
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
      const result = Array.from(traverseAST(tree, 'postfix'));
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
});

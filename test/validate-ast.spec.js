import validateAST from '../src/utils/validate-ast';
import { expect } from 'chai';
import jsep from 'jsep';

describe('Validate AST', function() {
  describe('Node types', function() {
    context('with default node types', function() {
      it('validates correctly when the AST only includes valid node types', function() {
        const tree = jsep('foo + (16.3 * bar)');
        expect(validateAST.bind(null, tree)).to.not.throw();
      });

      it('throws when the AST includes an invalid node type', function() {
        const tree = jsep('round(16.334)');
        expect(validateAST.bind(null, tree)).to.throw(
          /Invalid node type "CallExpression"/
        );
      });
    });

    context('with custom node types', function() {
      it('validates correctly when the AST only includes valid node types', function() {
        const tree = jsep('1 - 3 * 5 + 9');
        expect(
          validateAST.bind(null, tree, {
            allowedNodeTypes: ['BinaryExpression', 'Literal']
          })
        ).to.not.throw();
      });

      it('throws when the AST includes an invalid node type', function() {
        const tree = jsep('-5.3');
        expect(validateAST.bind(null, tree)).to.not.throw();
        expect(
          validateAST.bind(null, tree, {
            allowedNodeTypes: ['BinaryExpression']
          })
        ).to.throw(/Invalid node type "UnaryExpression"/);
      });
    });
  });

  describe('Binary Operators', function() {
    context('with default binary operators', function() {
      it('validates correctly when the AST only includes valid binary operators', function() {
        const tree = jsep('1 + 2 - 3 / 4 * 5');
        expect(validateAST.bind(null, tree)).to.not.throw();
      });

      it('throws when the AST includes an invalid binary operator', function() {
        const tree = jsep('1 + 2 - 3 ^ 4 * 5');
        expect(validateAST.bind(null, tree)).to.throw(
          /Invalid binary expression operator/
        );
      });
    });

    context('with custom binary operators', function() {
      it('validates correctly when the AST only includes valid binary operators', function() {
        const tree = jsep('1 + 2 ^ 3 + 4');
        expect(
          validateAST.bind(null, tree, {
            allowedBinaryOperators: ['+', '^']
          })
        ).to.not.throw();
      });

      it('throws when the AST includes an invalid binary operator', function() {
        const tree = jsep('1 + 2 - 3 ^ 4 * 5');
        expect(
          validateAST.bind(null, tree, {
            allowedBinaryOperators: ['+', '^']
          })
        ).to.throw(/Invalid binary expression operator/);
      });
    });
  });

  describe('Unary Operators', function() {
    context('with default unary operators', function() {
      it('validates correctly when the AST only includes valid unary operators', function() {
        const tree = jsep('-foo - (+bar)');
        expect(validateAST.bind(null, tree)).to.not.throw();
      });
    });

    context('with custom unary operators', function() {
      it('validates correctly when the AST only includes valid unary operators', function() {
        const tree = jsep('-foo + (-bar)');
        expect(
          validateAST.bind(null, tree, {
            allowedUnaryOperators: ['-']
          })
        ).to.not.throw();
      });

      it('throws when the AST includes an invalid unary operator', function() {
        const tree = jsep('-foo + (+bar)');
        expect(
          validateAST.bind(null, tree, {
            allowedUnaryOperators: ['-']
          })
        ).to.throw(/Invalid unary expression operator/);
      });
    });
  });

  describe('Literal Types', function() {
    context('with default literal types', function() {
      it('validates correctly when the AST only includes valid literal types', function() {
        const tree = jsep('"bar" + 9.4 - "foo" + 16.111');
        expect(validateAST.bind(null, tree)).to.not.throw();
      });

      it('throws when the AST includes invalid literal types', function() {
        const tree = jsep('"bar" + true - null + undefined');
        expect(validateAST.bind(null, tree)).to.throw(
          /Invalid literal type "boolean"/
        );
      });
    });

    context('with custom literal types', function() {
      it('validates correctly when the AST only includes valid literal types', function() {
        const tree = jsep('13 + true + 16.111');
        expect(
          validateAST.bind(null, tree, {
            allowedLiteralTypes: ['boolean', 'number']
          })
        ).to.not.throw();
      });

      it('throws when the AST includes invalid literal types', function() {
        const tree = jsep('"bar" + true / 16');
        expect(
          validateAST.bind(null, tree, {
            allowedLiteralTypes: ['boolean', 'number']
          })
        ).to.throw(/Invalid literal type "string"/);
      });
    });
  });
});

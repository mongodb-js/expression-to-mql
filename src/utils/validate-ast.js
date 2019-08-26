import traverseAST from './traverse-ast';
import { notOneOfSetError } from './error-msg';

const DEFAULT_ALLOWED_NODE_TYPES = [
  'BinaryExpression',
  'UnaryExpression',
  'MemberExpression',
  'Identifier',
  'Literal'
];

const DEFAULT_ALLOWED_BINARY_OPERATORS = ['+', '-', '*', '/'];
const DEFAULT_ALLOWED_UNARY_OPERATORS = ['+', '-'];

function validateAST(
  ast,
  {
    allowedNodeTypes = DEFAULT_ALLOWED_NODE_TYPES,
    allowedUnaryOperators = DEFAULT_ALLOWED_UNARY_OPERATORS,
    allowedBinaryOperators = DEFAULT_ALLOWED_BINARY_OPERATORS
  } = {}
) {
  function validateNodes(nodeArray) {
    nodeArray.forEach(node => {
      // check if the node type is allowed
      if (!allowedNodeTypes.includes(node.type)) {
        throw new Error(
          notOneOfSetError('node type', node.type, allowedNodeTypes)
        );
      }
      // for binary expressions, check if the operator is supported
      if (node.type === 'BinaryExpression') {
        if (!allowedBinaryOperators.includes(node.operator)) {
          throw new Error(
            notOneOfSetError(
              'binary expression operator',
              node.operator,
              allowedBinaryOperators
            )
          );
        }
      }
      // for unary expressions, check if the operator is supported
      if (node.type === 'UnaryExpression') {
        if (!allowedUnaryOperators.includes(node.operator)) {
          throw new Error(
            notOneOfSetError(
              'unary expression operator',
              node.operator,
              allowedUnaryOperators
            )
          );
        }
      }
    });
  }

  const nodeArray = Array.from(traverseAST(ast));
  validateNodes(nodeArray);
}

export default validateAST;

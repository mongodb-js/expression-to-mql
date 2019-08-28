import { isArray, isEmpty } from 'lodash';
import { notOneOfSetError, missingProperty } from './error-msg';

const TRAVERSAL_MODES = ['prefix', 'infix', 'postfix'];
const DEFAULT_TRAVERSAL_MODE = 'infix';

/**
 * tree traversal generator function. Given an AST (jsep format),
 * traverses the tree in prefix, infix or postfix mode and yields
 * for each node.
 *
 * @param  {Object}    root             an AST object as returned by jsep.
 * @param  {String}    traversalMode    one of 'prefix', 'infix', 'postfix'.
 *                                      determines if the root node is yielded
 *                                      before, in between or after its children.
 *                                      default is 'infix'.
 * @return {Generator}                  returns a generator which yields
 *                                      each node object in the given order.
 */
function* traverseAST(root, { traversalMode = DEFAULT_TRAVERSAL_MODE } = {}) {
  // validate traversal mode
  if (!TRAVERSAL_MODES.includes(traversalMode)) {
    throw new Error(
      notOneOfSetError('traversal mode', traversalMode, TRAVERSAL_MODES)
    );
  }
  // falsy trees don't yield anything
  if (!root) {
    return;
  }
  // every root must have a type
  if (!root.type) {
    throw new Error(missingProperty('tree', 'type'));
  }

  // special case handling for empty string, which also does not yield
  if (root.type === 'Compound' && isArray(root.body) && isEmpty(root.body)) {
    return;
  }

  function* binaryTraversal(node) {
    if (traversalMode === 'prefix') {
      yield node;
    }
    if (node.left) {
      yield* traversal(node.left);
    }
    if (traversalMode === 'infix') {
      yield node;
    }
    if (node.right) {
      yield* traversal(node.right);
    }
    if (traversalMode === 'postfix') {
      yield node;
    }
  }

  /**
   * traverse a UnaryExpression (e.g. -4). In postfix traversalMode, it will
   * yield the argument first, then the operator. In prefix and infix mode,
   * it will yield the operator first, then the argument.
   *
   * @param  {Object}    node      node with type UnaryExpression
   * @return {Generator}           yields the operator and argument, the order
   *                               depends on traversalMode.
   */
  function* unaryTraversal(node) {
    if (traversalMode === 'postfix') {
      yield* traversal(node.argument);
      yield node;
    } else {
      yield node;
      yield* traversal(node.argument);
    }
  }

  /**
   * traverse a MemberExpression by recursively collapsing all child
   * MemberExpressions and reconstructing the dotted field path.
   *
   * @param  {Object}    node   node with type MemberExpression
   * @return {Generator}        node with type Identifier and name as the
   *                            dotted field path, e.g.
   *                            {'type': 'Identifier', 'name': 'foo.bar.baz'}
   */
  function* memberTraversal(node) {
    const front = traversal(node.object).next().value;
    const last = node.property;
    node.type = 'Identifier';
    node.name = `${front.name}.${last.name}`;
    delete node.object;
    delete node.property;
    delete node.computed;
    yield node;
  }

  /**
   * generic traversal method which acts as a switch depending on node type.
   *
   * @param  {Object}    node  the parent node to traverse
   * @return {Generator}       yields the parent and children nodes, the order
   *                           depends on the traversalMode.
   */
  function* traversal(node) {
    switch (node.type) {
      case 'BinaryExpression':
        yield* binaryTraversal(node);
        break;
      case 'MemberExpression':
        yield* memberTraversal(node);
        break;
      case 'UnaryExpression':
        yield* unaryTraversal(node);
        break;
      default:
        yield node;
    }
  }

  yield* traversal(root);
}

export default traverseAST;
export { TRAVERSAL_MODES };

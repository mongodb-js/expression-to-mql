import { isArray, isEmpty } from 'lodash';
import { notOneOfSetError, missingProperty } from './error-msg';

const TRAVERSAL_MODES = ['prefix', 'infix', 'postfix'];
const DEFAULT_TRAVERSAL_MODE = 'infix';

/**
 * tree traversal generator function. Given an AST (jsep format),
 * traverses the tree in pre-, in- or postfix mode and yields
 * for each node. Children are referenced with "left" and "right"
 * properties.
 *
 * @param  {Object}    root            an AST object as returned by jsep.
 * @param  {String}    traversalMode   one of 'prefix', 'infix', 'postfix'.
 *                                     determines if the root node is yielded
 *                                     before, in between or after its children.
 *                                     default is 'infix'.
 * @return {Generator}                 returns a generator which yields
 *                                     each node object in the given order.
 */
function* traverseAST(root, traversalMode = DEFAULT_TRAVERSAL_MODE) {
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

  function* recursiveTraversal(node) {
    if (traversalMode === 'prefix') {
      yield node;
    }
    if (node.left) {
      yield* recursiveTraversal(node.left);
    }
    if (traversalMode === 'infix') {
      yield node;
    }
    if (node.right) {
      yield* recursiveTraversal(node.right);
    }
    if (traversalMode === 'postfix') {
      yield node;
    }
  }

  yield* recursiveTraversal(root);
}

export default traverseAST;
export { TRAVERSAL_MODES };

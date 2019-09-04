import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.includes";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.function.name";
import "core-js/modules/es.string.iterator";
import "core-js/modules/web.dom-collections.iterator";
import "regenerator-runtime/runtime";

var _marked5 =
/*#__PURE__*/
regeneratorRuntime.mark(traverseAST);

import { isArray, isEmpty } from 'lodash';
import { notOneOfSetError, missingProperty } from './error-msg';
var TRAVERSAL_MODES = ['prefix', 'infix', 'postfix'];
var DEFAULT_TRAVERSAL_MODE = 'infix';
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

function traverseAST(root) {
  var _marked,
      _marked2,
      _marked3,
      _marked4,
      _ref,
      _ref$traversalMode,
      traversalMode,
      binaryTraversal,
      unaryTraversal,
      memberTraversal,
      traversal,
      _args5 = arguments;

  return regeneratorRuntime.wrap(function traverseAST$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          traversal = function _ref5(node) {
            return regeneratorRuntime.wrap(function traversal$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.t0 = node.type;
                    _context4.next = _context4.t0 === 'BinaryExpression' ? 3 : _context4.t0 === 'MemberExpression' ? 5 : _context4.t0 === 'UnaryExpression' ? 7 : 9;
                    break;

                  case 3:
                    return _context4.delegateYield(binaryTraversal(node), "t1", 4);

                  case 4:
                    return _context4.abrupt("break", 11);

                  case 5:
                    return _context4.delegateYield(memberTraversal(node), "t2", 6);

                  case 6:
                    return _context4.abrupt("break", 11);

                  case 7:
                    return _context4.delegateYield(unaryTraversal(node), "t3", 8);

                  case 8:
                    return _context4.abrupt("break", 11);

                  case 9:
                    _context4.next = 11;
                    return node;

                  case 11:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _marked4);
          };

          memberTraversal = function _ref4(node) {
            var front, last;
            return regeneratorRuntime.wrap(function memberTraversal$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    front = traversal(node.object).next().value;
                    last = node.property;
                    node.type = 'Identifier';
                    node.name = "".concat(front.name, ".").concat(last.name);
                    delete node.object;
                    delete node.property;
                    delete node.computed;
                    _context3.next = 9;
                    return node;

                  case 9:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _marked3);
          };

          unaryTraversal = function _ref3(node) {
            return regeneratorRuntime.wrap(function unaryTraversal$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(traversalMode === 'postfix')) {
                      _context2.next = 6;
                      break;
                    }

                    return _context2.delegateYield(traversal(node.argument), "t0", 2);

                  case 2:
                    _context2.next = 4;
                    return node;

                  case 4:
                    _context2.next = 9;
                    break;

                  case 6:
                    _context2.next = 8;
                    return node;

                  case 8:
                    return _context2.delegateYield(traversal(node.argument), "t1", 9);

                  case 9:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _marked2);
          };

          binaryTraversal = function _ref2(node) {
            return regeneratorRuntime.wrap(function binaryTraversal$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(traversalMode === 'prefix')) {
                      _context.next = 3;
                      break;
                    }

                    _context.next = 3;
                    return node;

                  case 3:
                    if (!node.left) {
                      _context.next = 5;
                      break;
                    }

                    return _context.delegateYield(traversal(node.left), "t0", 5);

                  case 5:
                    if (!(traversalMode === 'infix')) {
                      _context.next = 8;
                      break;
                    }

                    _context.next = 8;
                    return node;

                  case 8:
                    if (!node.right) {
                      _context.next = 10;
                      break;
                    }

                    return _context.delegateYield(traversal(node.right), "t1", 10);

                  case 10:
                    if (!(traversalMode === 'postfix')) {
                      _context.next = 13;
                      break;
                    }

                    _context.next = 13;
                    return node;

                  case 13:
                  case "end":
                    return _context.stop();
                }
              }
            }, _marked);
          };

          _marked =
          /*#__PURE__*/
          regeneratorRuntime.mark(binaryTraversal), _marked2 =
          /*#__PURE__*/
          regeneratorRuntime.mark(unaryTraversal), _marked3 =
          /*#__PURE__*/
          regeneratorRuntime.mark(memberTraversal), _marked4 =
          /*#__PURE__*/
          regeneratorRuntime.mark(traversal);
          _ref = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : {}, _ref$traversalMode = _ref.traversalMode, traversalMode = _ref$traversalMode === void 0 ? DEFAULT_TRAVERSAL_MODE : _ref$traversalMode;

          if (TRAVERSAL_MODES.includes(traversalMode)) {
            _context5.next = 8;
            break;
          }

          throw new Error(notOneOfSetError('traversal mode', traversalMode, TRAVERSAL_MODES));

        case 8:
          if (root) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return");

        case 10:
          if (root.type) {
            _context5.next = 12;
            break;
          }

          throw new Error(missingProperty('tree', 'type'));

        case 12:
          if (!(root.type === 'Compound' && isArray(root.body) && isEmpty(root.body))) {
            _context5.next = 14;
            break;
          }

          return _context5.abrupt("return");

        case 14:
          return _context5.delegateYield(traversal(root), "t0", 15);

        case 15:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked5);
}

export default traverseAST;
export { TRAVERSAL_MODES };
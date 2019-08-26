"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(traverseAST);

function traverseAST(root) {
  return regeneratorRuntime.wrap(function traverseAST$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(root === null)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return");

        case 2:
          if (root.type) {
            _context.next = 4;
            break;
          }

          throw new Error('Unknown node type, expected property "type".');

        case 4:
          if (!(root.type === 'Compound' && (0, _lodash.isArray)(root.body) && (0, _lodash.isEmpty)(root.body))) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return");

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}

var _default = traverseAST;
exports.default = _default;
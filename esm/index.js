"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "exprToMQL", {
  enumerable: true,
  get: function get() {
    return _exprToMql.default;
  }
});
exports.default = void 0;

var _exprToMql = _interopRequireDefault(require("./expr-to-mql"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _exprToMql.default;
exports.default = _default;
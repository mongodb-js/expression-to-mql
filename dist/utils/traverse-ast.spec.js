"use strict";

var _traverseAst = _interopRequireDefault(require("./traverse-ast"));

var _chai = require("chai");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

describe('Traverse AST', function () {
  it('does not yield any values for an empty tree', function () {
    var result = _toConsumableArray((0, _traverseAst.default)(null));

    (0, _chai.expect)(result).to.be.an('array').with.lengthOf(0);
  });
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.missingProperty = exports.notOneOfSetError = void 0;

var notOneOfSetError = function notOneOfSetError(type, one, set) {
  return "Invalid ".concat(type, " \"").concat(one, "\". Supported ").concat(type, "s are: ").concat(set.join(', '), ".");
};

exports.notOneOfSetError = notOneOfSetError;

var missingProperty = function missingProperty(type, property) {
  return "Invalid ".concat(type, " format. Expected property \"").concat(property, "\".");
};

exports.missingProperty = missingProperty;
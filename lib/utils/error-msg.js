"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.missingProperty = exports.notOneOfSetError = void 0;

const notOneOfSetError = (type, one, set) => `Invalid ${type} "${one}". Supported ${type}s are: ${set.join(', ')}.`;

exports.notOneOfSetError = notOneOfSetError;

const missingProperty = (type, property) => `Invalid ${type} format. Expected property "${property}".`;

exports.missingProperty = missingProperty;
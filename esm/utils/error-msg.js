import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.join";
export var notOneOfSetError = function notOneOfSetError(type, one, set) {
  return "Invalid ".concat(type, " \"").concat(one, "\". Supported ").concat(type, "s are: ").concat(set.join(', '), ".");
};
export var missingProperty = function missingProperty(type, property) {
  return "Invalid ".concat(type, " format. Expected property \"").concat(property, "\".");
};
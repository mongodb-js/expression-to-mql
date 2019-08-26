export const notOneOfSetError = (type, one, set) =>
  `Invalid ${type} "${one}". Supported ${type}s are: ${set.join(', ')}.`;

export const missingProperty = (type, property) =>
  `Invalid ${type} format. Expected property "${property}".`;

# expression-to-mql

A node package and CLI executable to parse arithmetic expressions and convert them to MongoDB aggregation expressions.

### Features

The expression language allows the following:

- Field names (unquoted, or quoted with single or double quotes)
- Reference to nested fields using dot notation: `product.quantity`
- Literal numbers (integer or decimal)
- Operators: `+`, `-`, `*`, `/`
- Brackets for grouping `(`, `)`
- Whitespace outside of quoted strings is irrelevant

Examples of valid expressions:

- `price * quantity`
- `'total amount' * 1.1`
- `(foo.temp - 32)*5/9`

The expressions are converted to valid MongoDB Aggregation Expressions to be used in `$project` or `$addFields` stages.

### CLI usage

While the intended use is programmatic via ES6 modules or CommonJS require, it also comes with a tiny executable so that it can easily be used at the command line. To use this tool from the command line, follow these steps:

1. `npm install -g expression-to-mql`
2. `expr2mql 'foo + 1'`

Alternatively, you can check out the repository locally and run:

```
node ./bin/expr2mql.js 'foo + 1'
```

### API usage

The main function is `exprToMQL()`, which can be used as follows:

```
import exprToMQL from 'expression-to-mql';

const mql = exprToMQL('foo + 1');
console.log( JSON.stringify(mql) );
```

This would output

```
{"$sum":["$foo",1]}
```

#!/usr/bin/env node

var exprToMQL = require('../lib').default;
const docopt = require('docopt');
const packageJson = require('../package.json');

doc = `
Usage:
  expr2mql <expression>
  expr2mql -h | --help | --version

Examples:
  expr2mql '(fahrenheit * 9/5) + 32'
  expr2mql 'product.price * 1.1'
  expr2mql '-4 + 17 / 9'
`;

const args = docopt.docopt(doc, { version: packageJson.version });

try {
  const mql = exprToMQL(args['<expression>']);
  console.log(JSON.stringify(mql));
} catch (e) {
  console.error('Error:', e.message);
}

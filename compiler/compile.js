const parser = require("./parser.js");
const tokenizer = require("./tokenizer.js");
const transformer = require('./transformer.js');
const generator = require('./generator.js');

function compile(input) {
    let tokens = tokenizer(input);
    let ast = parser(tokens);
    let newAst = transformer(ast);
    let outputHTML = generator(newAst);
    return outputHTML;
};

module.exports = compile;

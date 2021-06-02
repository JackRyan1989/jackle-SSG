const fs = require('fs');
const Handlebars = require('handlebars');

function buildHTML(filename, data) {
    const source = fs.readFileSync(filename, 'utf-8').toString();
    const template =  Handlebars.compile(source);
    const output = template(data);

    return output;
}

async function main(src, dist) {
    const html = buildHTML(src, {"variableData": "Made with Handlebars and Sanity.io"});

    fs.writeFile(dist, html, function(err) {
        if (err) return console.log(err);
        console.log('HTML created.');
    });
}

main('./src/index.html', './dist/index.html')
const fs = require('fs');
const Handlebars = require('handlebars');
const client = require("./utils/SanityClient");
const blocksToHtml = require('@sanity/block-content-to-html');

function buildHTML(filename, data) {
    const source = fs.readFileSync(filename, 'utf-8').toString();
    const template =  Handlebars.compile(source);
    const output = template(data);

    return output;
}

async function getSanityData() {
    //Create the query
    const query = `{
        "about": *[_id == 'drafts.fcf01a0c-8eaa-4d4e-b3eb-a1d85fd7a1bc'][0]
    }`
    //Fetch the data
    let data = await client.fetch(query);
    //Convert the block content from the RTE to HTML
    data.about.content = blocksToHtml({
        blocks: data.about.content
    })
    return await data
}

async function main(src, dist) {
    const data = await getSanityData();
    const html = buildHTML(src, data);

    fs.writeFile(dist, html, function(err) {
        if (err) return console.log(err);
        console.log('HTML created.');
    });
}

main('./src/index.html', './dist/index.html');
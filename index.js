const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const client = require("./utils/SanityClient");
const blocksToHtml = require("@sanity/block-content-to-html");
const { source, dest, extension, query } = require('./utils/config');

function makeFileList(src) {
  //const extension = ".html";
  const dirPath = path.join(__dirname, src);
  let fileList = fs.readdirSync(dirPath, function (err, files) {
    if (err) {
      console.log(`This is an error: ${err}`);
    }
    files.filter((file) => path.extname(file).toLowerCase() === extension);
    return files;
  });
  return fileList;
}

function buildHTML(src, filename, data) {
  const dir = path.join(__dirname, src, filename);
  const source = fs.readFileSync(dir, "utf-8").toString();
  const template = Handlebars.compile(source);
  const output = template(data);
  return output;
}

async function getSanityData() {
  //Fetch the data
  let data = await client.fetch(query);
  //Convert the block content from the RTE to HTML
  data.about.bio = blocksToHtml({
    blocks: data.about.bio,
  });
  return await data;
}

async function main(src, dist) {
  const data = await getSanityData();
  const files = makeFileList(src);
  files.forEach((file) => {
    let html = buildHTML(src, file, data);
    let dir = path.join(__dirname, dist, file);
    fs.writeFile(dir, html, function (err) {
      if (err) return console.log(err);
      console.log("HTML created.");
    });
  });
}

main(source, dest);

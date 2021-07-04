const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const client = require("./utils/SanityClient");
const blocksToHtml = require("@sanity/block-content-to-html");
const { source, dest, query } = require("./utils/config");
const compile = require("./compiler/compile");

//Grab all html files:
function makeFileList(src, ext) {
  const dirPath = path.join(__dirname, src);
  let fileList = fs
    .readdirSync(dirPath, "utf8")
    .filter((file) => path.extname(file).toLowerCase() === ext);
  return fileList;
}
//Compile the HTML files using Handlebars
function buildHTML(src, filename, data) {
  const htmlDir = path.join(__dirname, src, filename);
fs.readFile(htmlDir, 'utf-8', function(err, file) {
    if (err) {
      throw err;
    }
    const template = Handlebars.compile(file);
    const hbrsOutput = template(data);
    let outputdir = path.join(__dirname, dest, filename);
    writeFile(outputdir, hbrsOutput);
  });
}

function writeFile(directory, content) {
  if (directory.split(".").pop() === "js") {
    let newHTMLDir = directory.split(".js").join(".html");
    fs.writeFile(newHTMLDir, content, function (err) {
      if (err) return console.log(err);
    });
  } 
  if ((directory.split(".").pop() === "html") ) {
    fs.writeFile(directory, content, function (err) {
      if (err) return console.log(err);
    });
  }
}

//Get the data from Sanity IO.
async function getSanityData() {
  //Fetch the data
  let data = await client.fetch(query);
  //Convert the block content from the RTE to HTML
  data.main.intro = blocksToHtml({
    blocks: data.main.intro,
  });
  data.main.description = blocksToHtml({
    blocks: data.main.description,
  });
  data.main.next = blocksToHtml({
    blocks: data.main.next,
  });
  return await data;
}

//Put it all together:
async function main(src) {
  const data = await getSanityData();
  const jsfiles = makeFileList(src, ".js");
  jsfiles.forEach((file) => {
    let directory = path.join(__dirname, src, file);
    let sourceFile = fs.readFileSync(directory, "utf-8").toString();
    let output = compile(sourceFile);
    let dir = path.join(__dirname, src, file);
    writeFile(dir, output);
  });
  const htmlfiles = makeFileList(src, ".html");
  htmlfiles.forEach((file) => {
    buildHTML(src, file, data);
   });
}

main(source);

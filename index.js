const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const client = require("./utils/SanityClient");
const blocksToHtml = require("@sanity/block-content-to-html");
const { source, dest, query } = require("./utils/config");
const compile = require("./compiler/compile");

//To do:
//Introduce the compiler and use it to generate HTML files.
//It should:
//1. Read in .js files from the src dir
//2. Compile them to a string
//3. Write the string to an html file
//4. Save the html file in the src dir - this is ok since we then filter out non-html files for when
// we compile with handlebars and add the data from Sanity IO.

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
  const dir = path.join(__dirname, src, filename);
  let source;
  try { 
     fs.accessSync(dir, fs.R_OK | fs.W_OK);
     source = fs.readFileSync(dir, 'utf-8');
   } catch (error) {
     console.error(error)
   }
  const template = Handlebars.compile(source);
  const output = template(data);
  return output;
}

function writeFile(directory, content) {
  if (directory.split(".").pop() === "js") {
    let newHTMLDir = directory.split(".js").join(".html");
    fs.writeFile(newHTMLDir, content, function (err) {
      if (err) return console.log(err);
    });
  } else {
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
async function main(src, dist) {
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
    let html = buildHTML(src, file, data);
    let dir = path.join(__dirname, dist, file);
    writeFile(dir, html);
  });
}

main(source, dest);

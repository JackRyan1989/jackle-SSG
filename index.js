const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const client = require("./utils/SanityClient");
const blocksToHtml = require("@sanity/block-content-to-html");
const { source, dest, query } = require("./utils/config");
const compile = require("./compiler/compile");

//Grab all js files:
function makeFileList(src) {
  const dirPath = path.join(__dirname, src);
  let fileList = fs
    .readdirSync(dirPath, "utf8")
    .filter((file) => path.extname(file).toLowerCase() === ".js");
  return fileList;
}

function writeFile(directory, content) {
  if (directory.split(".").pop() === "html") {
    fs.writeFile(directory, content, function (err) {
      if (err) return console.log(err);
    });
  }
}

//Get the data from Sanity IO.
async function getSanityData() {
  //Fetch the data
  let data;
  try {
    data = await client.fetch(query);
  } catch (err) {
    console.error(err);
  }
  //Convert the block content from the RTE to HTML
  data.index.intro = blocksToHtml({
    blocks: data.index.intro,
  });
  data.overview.content = blocksToHtml({
    blocks: data.overview.content,
  });
  data.hbrs.content = blocksToHtml({
    blocks: data.hbrs.content,
  });
  data.sanity.content = blocksToHtml({
    blocks: data.sanity.content,
  });
  data.netlify.content = blocksToHtml({
    blocks: data.netlify.content,
  });
  data.compiler.compiler = blocksToHtml({
    blocks: data.compiler.compiler,
  });
  data.compiler.syntax = blocksToHtml({
    blocks: data.compiler.syntax,
  });
  data.css.content = blocksToHtml({
    blocks: data.css.content,
  });
  return await data;
}

//Put it all together:
async function main(src) {
  const data = await getSanityData();
  const jsfiles = makeFileList(src);
  jsfiles.forEach((file) => {
    let inputDir = path.join(__dirname, src, file);
    let sourceFile = fs.readFileSync(inputDir, "utf-8").toString();
    let output = compile(sourceFile);
    const template = Handlebars.compile(output);
    const hbrsOutput = template(data);
    let filename = file.split(".js").join(".html");
    let outputdir = path.join(__dirname, dest, filename);
    writeFile(outputdir, hbrsOutput);
  });
}

main(source);

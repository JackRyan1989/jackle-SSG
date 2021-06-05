const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const client = require("./utils/SanityClient");
const blocksToHtml = require("@sanity/block-content-to-html");

function makeFileList(src) {
  const extension = ".html";
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

function buildHTML(filename, data) {
  const dir = path.join(__dirname, "/src/", filename);
  const source = fs.readFileSync(dir, "utf-8").toString();
  const template = Handlebars.compile(source);
  const output = template(data);
  return output;
}

//Next steps: grab data for all pages.
async function getSanityData() {
  //Create the query
  const query = `{
        "about": *[_id == 'fcf01a0c-8eaa-4d4e-b3eb-a1d85fd7a1bc'][0],
        "projects": *[_id == 'a7309525-95a1-4a2d-a8f9-650ac94a4c03'][0]
    }`;
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
    let html = buildHTML(file, data);
    let dir = path.join(__dirname, dist, file);
    fs.writeFile(dir, html, function (err) {
      if (err) return console.log(err);
      console.log("HTML created.");
    });
  });
}

main("src/", "dist/");

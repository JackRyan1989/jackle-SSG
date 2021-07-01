//Ok, now we take our new AST and build out an HTML string
//That will then get saved to a .html file.
//Another option is to create a new js file that will use
//DOM methods to create and add the correct elements with the correct
//Attributes. Not sure that's what I want right now though. That'll be much more work.

function codeGenerator(node) {
  switch (node.type) {
    case "Document":
      return node.body[2].elements.map(codeGenerator).join("\n");

    case "Element":
      if (node.name === "img" || node.name === "base" || node.name === "br" || node.name === "col" || node.name === "embed" || node.name === "hr" || node.name === "input" || node.name === "link" || node.name === "meta" || node.name === "param" || node.name === "source" || node.name === "track" || node.name === "wbr" ) {
        return `<${node.name} ${node.attributes.map(codeGenerator).join(" ")}/> ${node.cargo.map(codeGenerator).join(" ")}`;
      } else {
        return `<${node.name} ${node.attributes.map(codeGenerator).join(" ")}> ${node.cargo.map(codeGenerator).join(" ")} </${node.name}>`
      }

    case "class":
      return `class="${node.value}"`;
    case "id":
      return `id="${node.value}"`;
    case "src":
      return `src="${node.value}"`;
    case "alt":
      return `alt="${node.value}"`;
    case "cargo":
      return  node.value;
  }
}

module.exports = codeGenerator;
function parser(tokens) {
  //First, out of paranoia, confirm that we are dealing with an array. If not, barf.
  if (typeof tokens !== "object" || tokens.length < 1) {
    throw new TypeError(
      "Input is not an array, or not an array of length > 0."
    );
  }
  // Again we keep a `current` variable that we will use as a cursor.
  let current = 0;

  function walker() {
    //We start by grabbing the `current` token.
    //This is our cursor as we step through the tokens array
    let token = tokens[current];
    //Look for elements, and plop all info about them into params.
    //This will need to happen recursively so that all elements have the proper
    //params plopped in.

    //You need to check every other type to iterate properly.
    if (token.type !== "element") {
      current++;
      return {
        type: token.type.toUpperCase(),
        value: token.value,
      };
    }

    //IF check for tokens with a type of "element". This is really the only thing we care about as HTML is made
    //of elements. No functions or anything else. Any inline styling or JS will be put in as an attribute.
    if (token.type === "element") {
      // We create a base node with the type `CallExpression`, and we're going
      // to set the name as the current token's value since the next token after
      // the open parenthesis is the name of the function.
      let node = {
        type: "DOMELEMENT",
        name: token.value,
        params: [],
      };

      // We increment `current` *again* to skip the name token.
      token = tokens[++current];

      while (
        token.type !== "bracket" ||
        (token.type === "bracket" && token.value !== "}")
      ) {
        // we'll call the `walk` function which will return a `node` and we'll
        // push it into our `node.params`.
        node.params.push(walker());
        token = tokens[current];
      }
      // Finally we will increment `current` one last time to skip the closing
      // parenthesis.
      current++;

      // And return the node.
      return node;
    }
  }
  //Outside of walk function
  //Now, we're going to create our AST which will have a root which is a
  //`Document` node.
  let ast = {
    type: "Document",
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walker());
  }

  // At the end of our parser we'll return the AST.
  return ast;
}

module.exports = parser;

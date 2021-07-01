// The transformer will call the traverser with the goal of creating a
// new AST.
const traverser = require("./traverser.js");

function transformer(ast) {
  let newAst = {
    type: "Document",
    body: [
      {attributes: []}, {cargo:[]}, {elements:[]} 
    ]
  };

  // Hack to use a property named `context` on our parent nodes that we're going to push
  // nodes to their parent's `context`. Normally you would have a better
  // abstraction than this, but for our purposes this keeps things simple.
  // Just take note that the context is a reference *from* the old ast *to* the
  // new ast.
  // Not sure we want a single context here. May need two. One for attributes and one 
  // for Children elements. 
  ast._context = newAst.body;

  traverser(ast, {
    // Now we define our visitor methods:
    CLASS: {
      enter(node, parent) {
        parent._context[0].attributes.push({
          type: 'class',
          value: node.value
        })
      }
    },
    ID: {
      enter(node,parent) {
        parent._context[0].attributes.push({
          type: 'id',
          value: node.value
        })
      }
    },
    SRC: {
      enter(node,parent) {
        parent._context[0].attributes.push({
          type: 'src',
          value: node.value
        })
      }
    },
    ALT: {
      enter(node,parent) {
        parent._context[0].attributes.push({
          type: 'alt',
          value: node.value
        })
      }
    },
    CARGO: {
      enter(node, parent) {     
        parent._context[1].cargo.push({
          type: 'cargo',
          value: node.value
        })
      }
    },
    DOMELEMENT: {
      enter(node, parent) {
        let element = {
          type: "Element",
          name: node.name,
          attributes: [],
          cargo: [],
        };
        node._context = [{attributes: element.attributes}, {cargo: element.cargo}];
        if (parent.type !== "DOMELEMENT") {
          parent._context[2].elements.push(element);
        } else {
          parent._context[1].cargo.push(element);
        }
      },
    },
  });
  return newAst;
}

module.exports = transformer ;

//This program will traverse the abstract syntax tree and will 
//Visit different nodes.
//Our different node types:
// 1. Document
// 2. DOMELEMENT

function traverser(ast, visitor) {

    function traverseArray(array, parent) {
        array.forEach(child => {
            traverseNode(child, parent);
        });
    }

    function traverseNode(node, parent) {
        let methods = visitor[node.type];
        if (methods && methods.enter) {
            methods.enter(node, parent);
        }

        switch (node.type) {
            case 'Document':
                traverseArray(node.body, node);
                break;
            case 'DOMELEMENT':
                traverseArray(node.params, node);
                break;
            case "BRACKET":
            case "CLASS":
            case "CARGO":
            case "ID":
                break;
        }
        if (methods && methods.exit) {
            methods.exit(node, parent);
          }
    }
    traverseNode(ast, null);
}

module.exports = traverser;
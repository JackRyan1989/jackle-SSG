// OK, so we're gonna try to write a compiler for a shitty new way to write HTML without
// actually writing HTML.
// We need to write the following things:
// For ze Parser:
// 1. Tokenizer/Lexer --  performs lexical analysis of the file we provide it.
// 2. Syntactic analysis -- creates an abstract syntax tree out of our tokens
// For ze Transformer:
// 1. Create a new Abstract Syntax Tree from our crummy JS to HTML (using crummy JS)
// 2. Traverse the AST
// For ze Generator:
// 1. Print all the code from the AST into one long string of HTML

// ~~~~~~~~~~~~~~~ TOKENIZER ~~~~~~~~~~~~~~~
//
// What are the types that will constitute our tokens?
// The things we want to end up witha are:
// element -- e.g. h1 -> <h1></h1>
// attribute -- e.g. src(www.url.com) -> <img src="www.url.com" />
// class -- e.g. h1: { class(className) } -> <h1 class="className"></h1>
// id -- e.g. h1: { id(key) } -> <h1 id="key"></h1>
// content - NOW CARGO - JR 7/1/21 -- e.g. h1: { <This is a heading!> } -> <h1>This is a heading!</h1>
//
// So, the items that build up that output are:
// tokens = [
//      {type: 'name', value: 'h1'},
//      {type: 'colon', value: ':'},
//      {type: 'bracket', value: '{' },
//      {type: 'paren', value: '('},
//      {type: 'arrow', value: '<'},
//      etc...
//  ]
// For example, let's think through what an Abstract Syntax Tree would look like for this line of .jack code:
// section: {
//     p:{
//         class(leadText)
//         <Aliquam eu commodo sem, id mollis arcu. Nam at massa ex. In quis feugiat orci. Suspendisse placerat condimentum sapien, vitae rhoncus lectus volutpat euismod. Suspendisse tincidunt diam vitae nibh molestie, ut suscipit sapien vehicula. Nullam purus nisl, cursus vitae elit eget, tristique pellentesque tellus. In hac habitasse platea dictumst. Cras pretium velit orci, in lobortis dolor fermentum a. Cras efficitur condimentum turpis, sit amet blandit tortor ornare nec. Quisque molestie diam et eros ultrices, porta dictum magna sollicitudin. Nullam vel ex et nisi ultricies pellentesque et id elit. >
//     }
//     blockquote: {
//         class(quote)
//         <He said this!>
//     }
//     p: {
//         class(leadText)
//         <{{main.test}}>
//     }
// }
//
// AST:
//  {
//      type: 'Document',
//      body: [{
//          type: 'Element',
//          name: 'section',
//          params: [{
//              type: 'Element',
//              name: 'p',
//              params: [{
//                  type: 'Class',
//                  value: 'leadText'},
//               {
//                  type: 'Cargo',
//                  value: 'Aliquam eu commodo sem, id mollis arcu. Nam at massa ex. In quis feugiat orci. Suspendisse placerat condimentum sapien, vitae rhoncus lectus volutpat euismod. Suspendisse tincidunt diam vitae nibh molestie, ut suscipit sapien vehicula. Nullam purus nisl, cursus vitae elit eget, tristique pellentesque tellus. In hac habitasse platea dictumst. Cras pretium velit orci, in lobortis dolor fermentum a. Cras efficitur condimentum turpis, sit amet blandit tortor ornare nec. Quisque molestie diam et eros ultrices, porta dictum magna sollicitudin. Nullam vel ex et nisi ultricies pellentesque et id elit.'
//                 }]
//          }, {
//              type: 'Element',
//              name: 'blockquote',
//              params: [{type: 'Class', value: 'quote'},{ type: 'Cargo', value: 'He said this!'}]
//          },
//          {
//              type: 'Element',
//              name: 'p',
//              params: [{
//                  type: 'Class',
//                  value: 'leadText'},
//               {
//                  type: 'Cargo',
//                  value: {{main.test}}
//              }]
//          }]
//  }]
//
// Ok, so that seems like a reasonable goal. Not totally comprehensive, but for
// simpler HTML that will probably work fine. Let's see what we can do with a tokenizer function.

// First thing: take a string of code and break it down into an array of tokens.

// @param input == String
function tokenizer(input) {
  //Create a current variable that will track out position in the code:
  let current = 0;
  //A tokens array for pushing our tokens to:
  let tokens = [];

  while (current < input.length) {
    //Store the current caharacter in the input:
    let char = input[current];

    //Set up a series of if checks that will write the type and value of the token
    //to the tokens array and then increment current.
    // Chars to check for:
    // : -- not sure that colons are necessary syntax
    // (
    // )
    // {
    // }
    // <
    // >
    // Let's first check for these characters before checking for others
    // Anything after a colon is info about an HTML element.
    if (char === ":") {
      current++;
      continue;
    }

    if (char === "{") {
      tokens.push({ type: "bracket", value: "{" });
      current++;
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "bracket", value: "}" });
      current++;
      continue;
    }
    // ~~~~~~~~GRAB THE ELEMENT CARGO~~~~~~~~~~~~
    //We want to grab all of the content/cargo that will be placed within our HTML
    //tag. The double arrow indicates the start of content/cargo, and the >> indicates the end of the content.
    if (char === "[") {
      let value = "";
      // This skips the opening <<
      char = input[++current];
      while (char !== "]") {
        value += char;
        char = input[++current];
      }
      // This skips the closing >>
      char = input[++current];

      tokens.push({ type: "cargo", value });
      continue;
    }

    //Now we check for whitespace, which we will disregard when we find it:
    let whitespace = /\s/;
    if (whitespace.test(char)) {
      current++;
      continue;
    }
    //I think I need to test for the following character collections:
    //Note, I am skipping inline elements right now. I think they will be captured as content? Not sure.
    //HTML Elements (need to compile a list)
    //class
    //id
    //src
    //alt
    //target
    //rel
    //We don't necessarily want to grab the () because on their own they don't really mean anything.
    //They are just used to separate the content/cargo that follows them from the preceding keyword.
    //Test for letter:
//~~~~~~~~~~~~~~~~~~~Elements~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let letters = /[a-z0-9]/i;
    //If we find a letter, then:
    if (letters.test(char)) {
      //Grab each letter and add to a variable
      let item = "";
      let value = "";
      while (letters.test(char)) {
        item += char;
        char = input[++current];
        //Main Root
        if (item === "html") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Document Metadata
        if (item === "base") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "head" && input[current] !== 'e') {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "link") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "meta") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "style" && !letters.test(input[current])) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "title") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Sectioning root
        if (item === "body") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Content sectioning
        if (item === "address") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "article") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "aside") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "head" && input[current] === "e") {
          tokens.push({ type: "element", value: "header" });
          continue;
        }
        if (item === "main" && !letters.test(input[current])) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "h1") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "h2") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "h3") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "h4") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "h5") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "h6") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "main") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "nav") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "section") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "img") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "section") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Text Content
        if (item === "p" && !letters.test(char)) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "blockquote") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "dd" && !letters.test(char) ) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "div") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "dl") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "dt") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "figcaption") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "figure") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "hr" && !letters.test(char) ) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "li" && !letters.test(char) ) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "ol" && !letters.test(char) ) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "pre" && !letters.test(char) ) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "ul" && !letters.test(char) ) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "footer") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Image and multimedia
        if (item === "area" && !letters.test(char)) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "audio") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "map" && !letters.test(char)) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "track") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "video") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Embedded content
        if (item === "embed") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "iframe") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "object") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "param") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "picture") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "portal") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "source") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Scripting
        if (item === "canvas") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "noscript") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "script") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Demarcating edits
        if (item === "del") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "ins") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Table Content
        if (item === "caption") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "col" && !letters.test(char)) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "colgroup") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "table") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "tbody") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "td") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "tfoot") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "th" && !letters.test(char)) {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "thead") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "tr") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Forms
        if (item === "button") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "datalist") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "fieldset") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "form") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "input") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "label") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "legend") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "meter") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "optgroup") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "option") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "output") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "progress") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "select") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "textarea") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Interactive elements
        if (item === "details") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "dialog") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "menu") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "summary") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        //Web components
        if (item === "slot") {
          tokens.push({ type: "element", value: item });
          continue;
        }
        if (item === "template") {
          tokens.push({ type: "element", value: item });
          continue;
        }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Attributes:~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        if (item === "class") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          char = input[++current];
          tokens.push({ type: item, value });
          continue;
        }
        if (item === "id") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: item, value });
          continue;
        }
        if (item === "src") {
          char = input[++current];

          while (char !== ")") {
            value += char;
            char = input[++current];
          }

          tokens.push({ type: item, value });
          continue;
        }
        if (item === "alt") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: item, value });
          continue;
        }
        if (item === "target") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: item, value });
          continue;
        }
        if (item === "rel") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: item, value });
          continue;
        }
        if (item === "lang") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: item, value });
          continue;
        }
        if (item === "http-equiv") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: 'httpequiv', value });
          continue;
        }
        if (item === "content") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: item, value });
          continue;
        }
        if (item === "name") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: item, value });
          continue;
        }
        if (item === "href") {
          char = input[++current];
          while (char !== ")") {
            value += char;
            char = input[++current];
          }
          tokens.push({ type: item, value });
          continue;
        }
      }
    }
    current++;
  }
  return tokens;
}

module.exports = tokenizer;

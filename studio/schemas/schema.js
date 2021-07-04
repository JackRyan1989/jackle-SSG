// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: "default",
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // We need to mock up schemas for each page and component
    // Pages:
    // 1. Index
        // a. Meta info
        // b. Page content
    // 2. Documentation Overview
        // a. Meta info
        // b. Page content
    // 3. Handelbars Setup
        // a. Meta info
        // b. Page content
    // 4. Sanity IO Setup
        // a. Meta info
        // b. Page content
    // 5. Netlify Setup
        // a. Meta info
        // b. Page content
    // 6. Compiler Explanation
        // a. Meta info
        // b. Page content
    // 7. Jackyll Syntax
        // a. Meta info
        // b. Page content
    // 8. CSS Utility Class List
        // a. Meta info
        // b. Page content - just a list of all of the utility classes
    // Conponents:
    // 1. Left Navigation
    // 2. Footer
    // 3. Next page / Previous Page
    {
      title: "Meta Information",
      name: "meta",
      type: "document",
      fields: [
        {
          name: "charset",
          type: "string",
        },
        {
          name: "viewport",
          type: "string",
        },
        {
          name: "title",
          type: "string",
        },
        {
          name: "description",
          type: "string",
        },
        {
          name: "themeColor",
          type: "string",
        },
      ],
    },
    {
      title: "Main Document",
      name: "main",
      type: "document",
      fields: [
        {
          name: "heading",
          type: "string",
          title: "Heading",
        },
        {
          name: "intro",
          type: "array",
          title: "Introduction",
          of: [
            {
              type: "block",
            },
          ],
        },
        {
          name: "description",
          type: "array",
          title: "Description",
          of: [
            {
              type: "block",
            },
          ],
        },
        {
          name: "next",
          type: "array",
          title: "Next Steps",
          of: [
            {
              type: "block",
            },
          ],
        },
        {
          name: "externalLinks",
          title: "External links",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "text", title: "Link text", type: "string" },
                { name: "href", title: "Link url", type: "string" },
                { name: "target", title: "Target", type: "string" },
                { name: "noreferer", title: "Noreferer", type: "boolean" },
              ],
            },
          ],
        },
      ],
    },
  ]),
});

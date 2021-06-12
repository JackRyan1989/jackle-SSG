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
    /* Your types here! */
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

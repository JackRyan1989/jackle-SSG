const sanityClient = require('@sanity/client');
const client = sanityClient({
    projectId: 'og2bjuga',
    dataset: 'production',
    useCdn: true
});

module.exports = client;
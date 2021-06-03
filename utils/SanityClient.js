const sanityClient = require('@sanity/client');
const client = sanityClient({
    projectId: 'og2bjuga',
    dataset: 'production',
    apiVersion: '2021-06-02',
    useCdn: true
});

module.exports = client;
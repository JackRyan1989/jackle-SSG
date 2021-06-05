//Input folder:
const source = 'src/';
//Output folder:
const dest = 'dist/'
//Template extension:
const extension = '.html';
//Sanity IO Query:
const query = `{
    "about": *[_id == 'fcf01a0c-8eaa-4d4e-b3eb-a1d85fd7a1bc'][0],
    "projects": *[_id == 'a7309525-95a1-4a2d-a8f9-650ac94a4c03'][0]
}`;

module.exports = { source, dest, extension, query };

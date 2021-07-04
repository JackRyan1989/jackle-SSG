//Input folder:
const source = 'src/';
//Output folder:
const dest = 'dist/'
//Sanity IO Query:
const query = `{
    "meta": *[_id == '12476ba4-ba75-4984-8212-a657b0566af4'][0],
    "main": *[_id == 'd0886069-472b-41ad-ac84-8f3c3cda7372'][0]
}`;

module.exports = { source, dest, query };

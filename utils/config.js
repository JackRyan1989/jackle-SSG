//Input folder:
const source = 'src/';
//Output folder:
const dest = 'dist/'
//Sanity IO Query:
const query = `{
    "meta": *[_id == '12476ba4-ba75-4984-8212-a657b0566af4'][0],
    "index": *[_id == '20e92c3b-f7e1-4386-a02f-96d7fa3574a6'][0],
    "overview": *[_id == 'e078acfb-0581-43ae-84ae-cc65652ac962'][0],
    "hbrs": *[_id == '8f1a3b53-31c0-4a4a-ace4-39b1a76901c2'][0],
    "sanity": *[_id == '77206986-dbf1-44d8-986d-eba83e1645bc'][0],
    "netlify": *[_id == '0edbd67d-e892-4028-ad20-3f7cfaff7a7d'][0],
    "compiler": *[_id == 'c4560da7-39ab-4fe2-9c7d-46b8c0b54c3d'][0],
    "css": *[_id == '6de036ea-afc5-4863-8850-28f4a75da4b0'][0],
    "nav-links": *[_id == 'b046150b-502c-40b3-88fe-62d0f2c5e123'][0],
    "footer": *[_id == '5e4ee6c6-7614-42bc-9079-c925645cb4b6'][0],
}`;

module.exports = { source, dest, query };

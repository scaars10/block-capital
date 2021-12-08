const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath  = path.resolve(__dirname, 'contracts', 'BlockCapital.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');
const out = solc.compile(source, 1).contracts;
console.log(out);

fs.ensureDirSync(buildPath);
for(let contract in out) {
    fs.outputJsonSync (
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        out[contract]
    )
}

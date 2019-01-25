const RemixTests = require('remix-tests');
const Solc = require('solc');

function _testCallback(result) {
    try {
        process.send({ _testCallback: '_testCallback', result });
    } catch (e) {
        process.send({ error: e });
    }
}
function _resultsCallback(e, result) {
    if(e) {
        process.send({ error: e });
    }
    process.send({ _resultsCallback: '_resultsCallback', result });
}
function _finalCallback(e, result) {
    if(e) {
        process.send({ error: e });
    }
    process.send({ _finalCallback: '_finalCallback', result });
    process.exit(0);
}
function _importFileCb(e, result) {
    if(e) {
        process.send({ error: e });
    }
}

function findImports(path) {
  // TODO: We need current solc file path here for relative local import
  // path = 'github.com/ethereum/populus/docs/assets/Greeter.sol'
  process.send({ path });
}
process.on('message', (m) => {
    if (m.command === 'compile') {
        try {
            const input = m.payload;
            const output = Solc.compile(JSON.stringify(input), findImports);
            process.send({ compiled: output });
        } catch (e) {
            process.send({ error: e });
        }
    }
    if (m.command === 'runTests') {
        try {
            const sources = m.payload;
            RemixTests.runTestSources(sources, _testCallback, _resultsCallback, _finalCallback, _importFileCb);
        } catch (e) {
            process.send({ error: e });
        }
    }
});
module.exports = {};

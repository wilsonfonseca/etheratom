const RemixTests = require('remix-tests');
const Solc = require('solc');
const r = require('remix-url-resolver');
const path = require('path');
const fs = require('fs');

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
function handleLocal(pathString, filePath) {
  // if no relative/absolute path given then search in node_modules folder
  if (pathString && pathString.indexOf('.') !== 0 && pathString.indexOf('/') !== 0) {
    // return handleNodeModulesImport(pathString, filePath, pathString)
    return
  } else {
    const o = { encoding: 'UTF-8' }
    const p = pathString ? path.resolve(pathString, filePath) : path.resolve(pathString, filePath)
    const content = fs.readFileSync(p, o)
    return content
  }
}
function findImports(path) {
  // TODO: We need current solc file path here for relative local import
  // path = 'github.com/ethereum/populus/docs/assets/Greeter.sol'
  process.send({ path })
  const urlResolver = new r.RemixURLResolver()
  process.send({ urlResolver })
  const localFSHandler = [
    {
      type: 'local',
      match: (url) => { return /(^(?!(?:http:\/\/)|(?:https:\/\/)?(?:www.)?(?:github.com)))(^\/*[\w+-_/]*\/)*?(\w+\.sol)/g.exec(url) },
      handle: (match) => { return handleLocal(match[2], match[3]) }
    }
  ]
  urlResolver.resolve(path, localFSHandler)
    .then(sources => {
      process.send({ sources })
    })
    .catch(e => {
      process.send({ error: e });
    })
}
process.on('message', async(m) => {
    if (m.command === 'compile') {
        try {
            const input = m.payload;
            const output = await Solc.compileStandardWrapper(JSON.stringify(input), findImports);
            process.send({ compiled: output });
        } catch (e) {
            throw e;
        }
    }
    if (m.command === 'runTests') {
        try {
            const sources = m.payload;
            RemixTests.runTestSources(sources, _testCallback, _resultsCallback, _finalCallback, _importFileCb);
        } catch (e) {
            process.send({ error: e });
            throw e;
        }
    }
});
module.exports = {};

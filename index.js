import 'idempotent-babel-polyfill';
import { Etheratom } from './src';

module.exports = new Etheratom({
    config: atom.config,
    workspace: atom.workspace
});

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var remixPlugin = require('remix-plugin');
var ReactDOM = _interopDefault(require('react-dom'));
var atom$1 = require('atom');
require('idempotent-babel-polyfill');

class EtheratomView {
  constructor() {
    this.element = document.createElement;
    this.element = document.createElement('atom-panel');
    let att = document.createAttribute('id');
    att.value = 'etheratom-panel';
    this.element.setAttributeNode(att);
    this.element.classList.add('etheratom-panel');
    this.dispose = this.dispose.bind(this);
    this.getElement = this.getElement.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  getElement() {
    return this.element;
  }

  dispose() {
    this.destroy();
  }

  destroy() {
    return this.element.remove();
  }

}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.appManager = props.manager;
    this.appManager.ensureActivated('solidity');
  }

  render() {
    return React__default.createElement("div", {
      className: "App"
    }, React__default.createElement("h1", null, "Etheratom"));
  }

}

class EtmAppManager extends remixPlugin.AppManagerApi {
  ensureActivated(apiName) {
    // handle activation api redux state
    console.log();
  }

}

class Etheratom {
  constructor(props) {
    this.subscriptions = new atom$1.CompositeDisposable();
    this.etheratomView = new EtheratomView();
    this.modalPanel = null;
  }

  activate() {
    require('atom-package-deps').install('etheratom', true).then(() => {
      console.log('All dependencies installed, good to go');
    });

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'eth-interface:toggle': (_this => {
        return () => {
          _this.toggleView();
        };
      })(this),
      'eth-interface:activate': (_this => {
        return () => {
          _this.toggleView();
        };
      })(this)
    }));
    this.modalPanel = atom.workspace.addRightPanel({
      item: this.etheratomView.getElement(),
      visible: false
    });
    const appManager = new EtmAppManager(); // render view

    ReactDOM.render(React__default.createElement(App, {
      manager: appManager
    }), document.getElementById("etheratom-panel"));
  }

  toggleView() {
    if (this.modalPanel.isVisible()) {
      return this.modalPanel.hide();
    } else {
      return this.modalPanel.show();
    }
  }

}

module.exports = new Etheratom({
  config: atom.config,
  workspace: atom.workspace
});

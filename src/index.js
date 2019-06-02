import React from 'react';
import ReactDOM from 'react-dom';
import { EtheratomView } from './etm-view';
import { CompositeDisposable } from 'atom';
import App from './components/App';
import EtmAppManager from './etmAppManager';

export class Etheratom {
    constructor(props) {
        this.subscriptions = new CompositeDisposable();
        this.etheratomView = new EtheratomView();
        this.modalPanel = null;
    }
    activate() {
        require('atom-package-deps').install('etheratom', true)
            .then(() => {
                console.log('All dependencies installed, good to go');
            });
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'eth-interface:toggle': ((_this) => {
                return () => {
                    _this.toggleView();
                };
            })(this),
            'eth-interface:activate': ((_this) => {
                return () => {
                    _this.toggleView();
                };
            })(this)
        }));
        this.modalPanel = atom.workspace.addRightPanel({
            item: this.etheratomView.getElement(),
            visible: false
        });
        const appManager = new EtmAppManager();

        // render view
        ReactDOM.render(<App manager={appManager} />, document.getElementById("etheratom-panel"));
    }
    toggleView() {
        if (this.modalPanel.isVisible()) {
            return this.modalPanel.hide();
        } else {
            return this.modalPanel.show();
        }
    }
}

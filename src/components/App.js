import React, { Component } from "react";
class App extends Component {
    constructor(props) {
        super(props)
        this.appManager = props.manager;
        this.appManager.ensureActivated('solidity');
    }
    render() {
        return (
            <div className="App">
                <h1>Etheratom</h1>
            </div>
        )
    }
}
export default App;
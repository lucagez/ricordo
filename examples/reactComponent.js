import React, { Component } from "react";
import ReactDOM from "react-dom";
import Ricordo from "ricordo";

const C = ({ a }) => <div>hello {a}</div>;

const cached = new Ricordo(C);

class App extends Component {
  render = () => <div className="App">{cached("world")}</div>;
}

ReactDOM.render(<App />, document.querySelector("#root"));
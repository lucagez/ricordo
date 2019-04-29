import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Ricordo from 'ricordo';

const C = a => <div>hello {a}</div>;

const cached = new Ricordo(C);

class App extends Component {

  // Invoking cached function => now 'world' is a registered key
  // The next time that the function will be computed with 'world' as argument,
  // the previously created component will be returned.
  render = () => <div>{cached('world')}</div>;
}

ReactDOM.render(<App />, document.querySelector('#root'));
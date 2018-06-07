import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Part from './components/Part/Part';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {part_count: 0, parts: []};
  }
  componentDidMount() {
    global.connection.query('SELECT COUNT(*) FROM parts', (e, r) => {
        this.setState({part_count: r[0]['COUNT(*)'],});
    });
    global.connection.query('SELECT * FROM parts', (e, r) => {
      this.setState({parts: r});
    });
  }
  render() {
    var part_frames = [];
    for (var i in this.state.parts) {
      var part = this.state.parts[i];
      part_frames.push(<Part key={i} name={part.title} color={part.color} qty={part.quantity} image={part.img} />);
    }
    return (
      <div className="App">
        <h1>{this.state.part_count} Parts</h1>
        {part_frames}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

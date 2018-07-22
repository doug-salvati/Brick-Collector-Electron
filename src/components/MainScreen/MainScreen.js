import React, { Component } from 'react';
import Part from '../Part/Part';
import './MainScreen.css';
import {ipcRenderer} from 'electron';

class MainScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {part_count: -1, parts: []};
      ipcRenderer.send('getParts');
    }
    componentDidMount() {
      ipcRenderer.on('partsSent', (event, list) => {
        this.setState(list);
      });
      ipcRenderer.on('newPartSent', (event, new_part) => {
        let match;
        if (match = this.state.parts.find((elt) => elt.p_id === new_part.p_id)) {
          let modified = Object.assign({}, match, {
            quantity: match.quantity + new_part.quantity,
            loose: match.loose + new_part.loose
          });
          let new_parts = this.state.parts.slice();
          new_parts[this.state.parts.indexOf(match)] = modified;
          this.setState({parts: new_parts});
        } else {
          this.setState((old_state) => ({
            part_count: old_state.part_count + 1,
            parts: old_state.parts.concat(new_part)
          }));
        }
      });
    }
    render() {
      if (this.state.part_count < 0) {
        return <h1>Retrieving parts...</h1>;
      }
      var part_frames = [];
      for (var i in this.state.parts) {
        var part = this.state.parts[i];
        part_frames.push(<Part key={i} name={part.title} color={part.color} qty={part.quantity} image={part.img} />);
      }
      return (
        <div className="App">
          <h1>{this.state.part_count} Unique Parts</h1>
          {part_frames}
          <button id="add-part-btn" onClick={() => global.openDialog.add_part()}> Add Part... </button>
        </div>
      );
    }
  }

  export default MainScreen;
import React, { Component } from 'react';
import Part from '../Part/Part';
import './MainScreen.css';
import {ipcRenderer} from 'electron';

class MainScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {part_count: 0, parts: []};
    }
    getPartsFromDatabase() {
      global.connection.getPartsCount((e, r) => {
        this.setState({part_count: r});
      });
      global.connection.getParts((e, r) => {
        this.setState({parts: r});
      });
    }
    componentDidMount() {
      this.getPartsFromDatabase();
      ipcRenderer.on('partAdded', () => this.getPartsFromDatabase());
    }
    render() {
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
import React, { Component } from 'react';
import Part from '../Part/Part';
import PartFeature from '../Part/PartFeature';
import './MainScreen.css';
import {ipcRenderer} from 'electron';

class MainScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {part_count: -1, parts: [], featured: null};
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
      ipcRenderer.on('partDeleted', (event, old_part) => {
        const match = this.state.parts.find((elt) => elt.p_id === old_part.p_id);
        const idx = this.state.parts.indexOf(match);
        let new_parts = this.state.parts.slice();
        new_parts.splice(idx, 1);
        this.setState((old_state) => ({parts: new_parts, part_count: old_state.part_count - 1}));
      });
    }

    createOnClick(part) {
      return () => this.setState({featured: part});
    }

    createOnSave(part) {
      let copy = Object.assign({}, part);
      return (new_quantity) => {
        ipcRenderer.send('changePartQuantity', copy, new_quantity);
        this.setState({featured: null});
      }
    }

    createOnDelete(part) {
      return () => {
        const q = part.quantity;
        const deletion_quantity = q === 1 ? 'your' : q === 2 ? 'both' : `all ${q}`
        const warning = `Really delete ${deletion_quantity} ${part.title}? This cannot be undone.`
        if (confirm(warning)) {
          ipcRenderer.send('deletePart', part);
          this.setState({featured: null});
        }
      }
    }

    render() {
      if (this.state.part_count < 0) {
        return <h1 className='centered-header'>Retrieving parts...</h1>;
      }
      if (this.state.featured) {
        return <PartFeature
          part={this.state.featured}
          handleSave={this.createOnSave(this.state.featured)}
          handleDelete={this.createOnDelete(this.state.featured)}
          handleBack={() => this.setState({featured: null})}
        />;
      }
      var part_frames = [];
      for (var i in this.state.parts) {
        var part = this.state.parts[i];
        part_frames.push(<Part 
          key={i} name={part.title} color={part.color}
          qty={part.quantity} image={part.img} handleClick={this.createOnClick(part)} />);
      }
      return (
        <div className='main-screen'>
          <h1 className='centered-header'>{this.state.part_count} Unique Parts</h1>
          {part_frames}
          <button id="add-part-btn" onClick={() => global.openDialog.add_part()}> Add Part... </button>
        </div>
      );
    }
  }

  export default MainScreen;
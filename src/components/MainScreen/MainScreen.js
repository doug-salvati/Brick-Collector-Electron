import React, { Component } from 'react';
import Part from '../Part/Part';
import PartFeature from '../Part/PartFeature';
import FilterToolbar from '../common/FilterToolbar';
import './MainScreen.css';
import {ipcRenderer} from 'electron';
import ColorHex from '../../data/colors.js';

class MainScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        part_count: -1,
        parts: [],
        featured: null,
        textFilter: '',
        colorFilter: 'All Colors',
        zoomLevel: 0
      };
      ipcRenderer.send('getParts');
      this.options = [];
      for (let color in ColorHex) {
        this.options.push(color);
      }
      this.options.sort();
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
      ipcRenderer.on('zoomIn', () => {
        this.handleZoomIn();
      });
      ipcRenderer.on('zoomOut', () => {
        this.handleZoomOut();
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

    handleSearchChange = (val) => {
      this.setState({textFilter: val});
    }

    handleSelectChange = (val) => {
      this.setState({colorFilter: val});
    }

    handleZoomIn = () => {
      this.setState({zoomLevel: Math.min(this.state.zoomLevel + 1, 2)});
    }

    handleZoomOut = () => {
      this.setState({zoomLevel: Math.max(this.state.zoomLevel - 1, -2)});
    }

    filterParts() {
      if (this.state.textFilter === '' && this.state.colorFilter === 'All Colors') {
        return this.state.parts;
      }
      return this.state.parts.filter((part) => {
        const textFilter = this.state.textFilter.toLowerCase().replace(/\s/g, '');
        const text = part.title.toLowerCase().replace(/\s/g, '');
        return (
          ((textFilter === '') ? true : (text.includes(textFilter))) &&
          ((this.state.colorFilter === 'All Colors') ? true : (part.color === this.state.colorFilter))
        );
      });
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
      let part_frames = [];
      const filtered_parts = this.filterParts();
      for (let i in filtered_parts) {
        const part = filtered_parts[i];
        part_frames.unshift(<Part 
          key={i} name={part.title} color={part.color} zoom={this.state.zoomLevel}
          qty={part.quantity} image={part.img} handleClick={this.createOnClick(part)} />);
      }
      return (
        <div className='main-screen'>
          <div className='sticky-header'>
            <h1 className='centered-header'>You Own {this.state.part_count} Unique Parts</h1>
            <FilterToolbar
              handleSearchChange={this.handleSearchChange}
              handleSelectChange={this.handleSelectChange}
              handleZoomIn={this.handleZoomIn}
              handleZoomOut={this.handleZoomOut}
              options={this.options}
            />
          </div>
          <div className='partFrames'>{part_frames}</div>
          <button id="add-part-btn" onClick={() => global.openDialog.add_part()}> Add Part... </button>
        </div>
      );
    }
  }

  export default MainScreen;
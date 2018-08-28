import React, { Component } from 'react';
import PartFeature from '../../entities/Part/PartFeature';
import FilterToolbar from '../../common/FilterToolbar';
import {ipcRenderer} from 'electron';
import {registerActions, removeActions} from '../../../util/registerActions';

class SubScreen extends Component {
    constructor() {
        super();
        this.state = {
            count: -1,
            items: [],
            featured: null,
            textFilter: '',
            dropDownFilter: 'All',
            zoomLevel: 0
        };
    }
    componentDidMount() {
        this.props.fetcher();
        registerActions(ipcRenderer, this.props.actions, this);
        ipcRenderer.on('zoomIn', () => {
            this.handleZoomIn();
        });
        ipcRenderer.on('zoomOut', () => {
            this.handleZoomOut();
        });
    }

    componentWillUnmount() {
        removeActions(ipcRenderer, this.props.actions);
    }

    createOnClick(item) {
      return () => this.setState({featured: item});
    }

    handleSearchChange = (val) => {
      this.setState({textFilter: val});
    }

    handleSelectChange = (val) => {
      val = (val.includes('All') ? 'All' : val);
      this.setState({dropDownFilter: val});
    }

    handleZoomIn = () => {
      this.setState({zoomLevel: Math.min(this.state.zoomLevel + 1, 2)});
    }

    handleZoomOut = () => {
      this.setState({zoomLevel: Math.max(this.state.zoomLevel - 1, -2)});
    }

    filterItems() {
      if (this.state.textFilter === '' && this.state.dropDownFilter === 'All') {
        return this.state.items;
      }
      return this.state.items.filter((item) => {
        const textFilter = this.state.textFilter.toLowerCase().replace(/\s/g, '');
        const text = item.title.toLowerCase().replace(/\s/g, '');
        return (
          ((textFilter === '') ? true : (text.includes(textFilter))) &&
          ((this.state.dropDownFilter === 'All') ? true : (item.color === this.state.dropDownFilter))
        );
      });
    }

    render() {
      const { Feature } = this.props;

      if (this.state.count < 0) {
        return <h1 className='centered-header'>Loading...</h1>;
      }

      if (this.state.featured) {
        return <Feature
          item={this.state.featured}
          handleBack={() => this.setState({featured: null})}
        />;
      }
      let frames = [];
      const filtered = this.filterItems();
      const Entity = this.props.entity;
      for (let i in filtered) {
        const item = filtered[i];
        frames.unshift(<Entity
          key={i} name={item.title} classification={item[this.props.classificationType]} zoom={this.state.zoomLevel}
          qty={item.quantity} image={item.img} handleClick={this.createOnClick(item)} />);
        }
      return (
        <div className='main-screen'>
          <div className='sticky-header'>
            <h1 className='centered-header'>You Own {this.state.count} Unique Items</h1>
            <FilterToolbar
              handleSearchChange={this.handleSearchChange}
              handleSelectChange={this.handleSelectChange}
              handleZoomIn={this.handleZoomIn}
              handleZoomOut={this.handleZoomOut}
              options={this.props.dropDownOptions}
            />
          </div>
          <div className='partFrames'>{frames}</div>
          <button id="add-part-btn" onClick={this.props.adder}> Add... </button>
        </div>
      );
    }
  }

  export default SubScreen;
import React, { Component } from 'react';
import {ipcRenderer} from 'electron';
import Gallery from '../../common/Gallery';
import FilterToolbar from '../../common/FilterToolbar';
import Loader from '../../common/Loader/Loader';
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
        this.updateWindowDimensions();
        window.addEventListener('resize', () => this.updateWindowDimensions());
    }

    componentWillUnmount() {
      removeActions(ipcRenderer, this.props.actions);
      ipcRenderer.removeAllListeners('zoomIn');
      ipcRenderer.removeAllListeners('zoomOut');
      window.removeEventListener('resize', () => this.updateWindowDimensions());
    }

    updateWindowDimensions() {
      this.setState({ width: window.innerWidth, height: window.innerHeight });
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
          ((this.state.dropDownFilter === 'All') ? true : (item[this.props.classificationType] === this.state.dropDownFilter))
        );
      });
    }

    render() {
      const { Feature, Entity, classificationType } = this.props;

      if (this.state.count < 0) {
        return <h1></h1>;
      }

      if (this.state.featured) {
        return <Feature
          item={this.state.featured}
          handleBack={(clean) => {
            if (!clean || confirm('You will lose your changes if you continue.')) {
              this.setState({featured: null})
            }
          }}
        />;
      }
      const all = this.props.classificationType.replace(/^\w/, c => c.toUpperCase())
      return (
        <div className='main-screen'>
          <div className='stuck-to-top middle-layer solid twenty-pct'>
            <h1 className='center no-margin lg-padding-top'>You Own {this.state.count} {this.props.label}s</h1>
            <FilterToolbar
              handleSearchChange={this.handleSearchChange}
              handleSelectChange={this.handleSelectChange}
              handleZoomIn={this.handleZoomIn}
              handleZoomOut={this.handleZoomOut}
              defaultText={this.state.textFilter}
              options={this.props.dropDownOptions}
              defaultOption={this.state.dropDownFilter === 'All' ? `All ${all}s` : this.state.dropDownFilter}
              optionAll={`All ${all}s`}
            />
            <button className='top-right blank-button highlight-on-focus' onClick={this.props.adder} tabIndex="1">
              <img className='img-full' src='assets/ui_icons/add.svg' />
            </button>
          </div>
          <Gallery
            Entity={Entity}
            values={this.filterItems()}
            generateClickHandler={item => this.createOnClick(item)}
            classificationType={classificationType}
            height={this.state.height * 0.8}
            width={this.state.width}
            zoom={this.state.zoomLevel}
          />
        </div>
      );
    }
  }

  export default SubScreen;
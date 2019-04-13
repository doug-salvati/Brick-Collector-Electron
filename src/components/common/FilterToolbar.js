import React, { Component } from 'react';
import {ipcRenderer} from 'electron';
import './FilterToolbar.css';

class filterToolbar extends Component{
    constructor(props) {
        super(props);
        this.filter = React.createRef();
    }
    componentDidMount() {
        ipcRenderer.on('filter', () => {
            this.filter.current.focus();
        });
        ipcRenderer.on('dropdown', () => {
            // ref wouldn't work
            document.getElementById('filterToolbarSelect').focus();
        })
    }
    componentWillUnmount() {
        ipcRenderer.removeAllListeners('filter');
    }
    render() {
        console.log('rendering a toolbar')
        return (
            <div className='filterToolbar sm-padding'>
                <input type='text' placeholder='🔎 Filter' className='filterToolbarSearch sm-padding-side' ref={this.filter}
                    onChange={e => this.props.handleSearchChange(e.target.value)} value={this.props.defaultText}
                />
                <select className='filterToolbarSelect' id='filterToolbarSelect'
                    onChange={e => this.props.handleSelectChange(e.target.value)}
                    defaultValue={this.props.defaultOption}
                >
                    <option>{this.props.optionAll}</option>
                    {this.props.options.map((option) => <option key={option}>{option}</option>)};
                </select>
                <button className='filterToolbarZoom In no-padding' onClick={this.props.handleZoomOut}>🐭</button>
                <button className='filterToolbarZoom Out no-padding' onClick={this.props.handleZoomIn}>🐳</button>
            </div>
        );
    }
};

export default filterToolbar;
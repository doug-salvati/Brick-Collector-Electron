import React, { Component } from 'react';
import './FilterToolbar.css';

class filterToolbar extends Component{
    render() {
        return (
            <div className='filterToolbar'>
                <input type='text' placeholder='🔎 Filter' className='filterToolbarSearch'
                    onChange={e => this.props.handleSearchChange(e.target.value)}
                />
                <select className='filterToolbarSelect'
                    onChange={e => this.props.handleSelectChange(e.target.value)}
                >
                    <option>All</option>
                    {this.props.options.map((option) => <option key={option}>{option}</option>)};
                </select>
                <button className='filterToolbarZoom In' onClick={this.props.handleZoomOut}>➖</button>
                <button className='filterToolbarZoom Out' onClick={this.props.handleZoomIn}>➕</button>
            </div>
        );
    }
};

export default filterToolbar;
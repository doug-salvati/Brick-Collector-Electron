import React, { Component } from 'react';
import './FilterToolbar.css';

class filterToolbar extends Component{
    render() {
        return (
            <div className='filterToolbar sm-padding'>
                <input type='text' placeholder='🔎 Filter' className='filterToolbarSearch sm-padding-side'
                    onChange={e => this.props.handleSearchChange(e.target.value)} value={this.props.defaultText}
                />
                <select className='filterToolbarSelect'
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
import React, { Component } from 'react';
import ColorHex from '../../../data/colors.js';
import './Part.css';

class Part extends Component {
    render() {
        let image = 'assets/part_images/no_img.png';
        // Check if image is hosted locally
        if (this.props.image) {
            image = (this.props.image.includes('http')) ? this.props.image : `assets/part_images/elements/${this.props.image}`;
        }
        return (
            <span className={`part-block zoom${this.props.zoom}`}>
                <img className='part-img' src={image}
                    title={'Image of ' + (this.props.name ? this.props.name : 'Unnamed Part')}
                    alt={'Image of ' + (this.props.name ? this.props.name : 'No Name')}
                    onClick={(this.props.handleClick)} />
                <div className='part-label' onMouseOut={e => e.target.scrollLeft = 0} title={this.props.name ? this.props.name : 'No Name'}>
                    <b>&nbsp;{this.props.qty ? this.props.qty + 'x ' : ''}</b>{this.props.name ? this.props.name : 'No Name'}&nbsp;
                </div>
                <div className='part-color'
                    style={{background: (this.props.color ? ColorHex[this.props.color] : 'rgba(0,0,0,0)')}}
                    title={this.props.color ? this.props.color : 'Color Unknown'}>
                </div>
            </span>
        );
    }
}

export default Part;
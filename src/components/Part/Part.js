import React, { Component } from 'react';
import ColorHex from '../../data/colors.js';
import './Part.css';
import no_img from '../../assets/part_images/no_img.png';
const elements_dir = require.context('../../assets/part_images/elements');

class Part extends Component {
    render() {
        return (
            <span className='part-block'>
                <img className='part-img' src={this.props.image ? elements_dir('./' + this.props.image) : no_img}
                    title={'Image of ' + (this.props.name ? this.props.name : 'Unnamed Part')}
                    alt={'Image of ' + (this.props.name ? this.props.name : 'No Name')} />
                <div className='part-label' title={this.props.name ? this.props.name : 'No Name'}>
                    <b>{this.props.qty ? this.props.qty : '?'}x</b> {this.props.name ? this.props.name : 'No Name'}
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
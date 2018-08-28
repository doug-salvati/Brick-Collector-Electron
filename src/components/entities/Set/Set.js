import React, { Component } from 'react';
import Themes from '../../../data/themes.js';
import './Set.css';

const Set = (props) => {
    let image = 'assets/set_images/no_img.png';
    // Check if image is hosted locally
    if (props.image) {
        image = (props.image.includes('http')) ? props.image : `assets/set_images/sets/${props.image}`;
    }
    return (
        <span className={`set-block zoom${props.zoom}`}>
            <img className='set-img' src={image}
                title={'Image of ' + (props.name ? props.name : 'Unnamed Set')}
                alt={'Image of ' + (props.name ? props.name : 'No Name')}
                onClick={(props.handleClick)} />
            <div className='set-label' onMouseOut={e => e.target.scrollLeft = 0} title={props.name ? props.name : 'No Name'}>
                <b>&nbsp;{props.qty ? props.qty + 'x ' : ''}</b>{props.name ? props.name : 'No Name'}&nbsp;
            </div>
            <div className='set-theme'
                style={{background: (props.classification ? ColorHex[props.classification] : 'rgba(0,0,0,0)')}}
                title={props.classification ? props.classification : 'Color Unknown'}>
            </div>
        </span>
    );
}

export default Set;
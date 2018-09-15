import React from 'react';
import './Entity.css';

const Entity = (props) => {
    let image = `${props.imagepath}/../no_img.png`;
    // Check if image is hosted locally
    if (props.image) {
        image = (props.image.includes('http')) ? props.image : `${props.imagepath}/${props.image}`;
    }
    return (
        <span className={`entity-block zoom${props.zoom} ${props.className}`}>
            <img className='entity-img' src={image}
                title={'Image of ' + (props.name ? props.name : 'Unnamed Item')}
                alt={'Image of ' + (props.name ? props.name : 'Unnamed Item')}
                onClick={(props.handleClick)} />
            <div className='entity-label' onMouseOut={e => e.target.scrollLeft = 0} title={props.name ? props.name : 'No Name'}>
                <b>&nbsp;{props.number ? props.number : ''}</b>{props.name ? props.name : 'No Name'}&nbsp;
            </div>
            <div className='entity-icon'
                style={{
                    background: (props.icon || 'rgba(0,0,0,0)'),
                    backgroundSize: '100%',
                    backgroundRepeat: 'no-repeat',
                }}
                title={props.icon ? props.iconTooltip : 'Unknown'}>
            </div>
        </span>
    );
}

export default Entity;
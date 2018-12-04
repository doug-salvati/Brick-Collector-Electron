import React from 'react';
import './Entity.css';

const Entity = (props) => {
    let image = `${props.imagepath}/no_img.png`;
    // Check if image is hosted locally
    if (props.image) {
        image = (props.image.includes('http')) ? props.image : `${props.imagepath}/${props.image}`;
    }
    return (
        <div className={'localize inline-block fill-height fill-width'}>
            <span className={`entity-block ${props.className} ${props.handleClick && 'clickable'}`} onClick={(props.handleClick)}>
                <img className='entity-img img-75' src={image}
                    title={'Image of ' + (props.name ? props.name : 'Unnamed Item')}
                    alt={'Image of ' + (props.name ? props.name : 'Unnamed Item')}
                />
                <div className='entity-label sm-padding-side' onMouseOut={e => e.target.scrollLeft = 0} title={props.name ? props.name : 'No Name'}>
                    <b>&nbsp;{props.prefix}{props.number ? props.number : ''}</b>&nbsp;
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
        </div>
    );
}

export default Entity;
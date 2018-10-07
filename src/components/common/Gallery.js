import React from 'react';

const Gallery = props => {
    const galleryItems = [];
    const {Entity, values, classificationType, picker, zoom} = props;
    values.forEach((item, i) => {
        galleryItems.push(
            <div className='inline-block localize' key={i}>
                <Entity
                    name={item.title}
                    classification={item[classificationType]}
                    zoom={zoom || 1}
                    qty={item.quantity}
                    number={item.s_id}
                    image={item.img}
                />
                {picker && <input className="top-left" type="checkbox" value={i} defaultChecked />}
            </div>
        );
    });
    return galleryItems.length ? <div className="no-spacing">{galleryItems}</div> : <div>Loading...</div>
}

export default Gallery;
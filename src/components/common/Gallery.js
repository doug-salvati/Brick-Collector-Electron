import React from 'react';
import './Gallery.css';

const Gallery = props => {
    const galleryItems = [];
    const {Entity, values, classificationType, picker, zoom} = props;
    values.forEach((item, i) => {
        galleryItems.push(
            <div className='galleryItem' key={i}>
                <Entity
                    name={item.title}
                    classification={item[classificationType]}
                    zoom={zoom || 1}
                    qty={item.quantity}
                    image={item.img}
                />
                {picker && <input className="galleryCheckbox" type="checkbox" value={i} defaultChecked />}
            </div>
        );
    });
    return galleryItems.length ? <div className='gallery'>{galleryItems}</div> : <div>Loading...</div>
}

export default Gallery;
import React from 'react';
import './GalleryPicker.css';

const GalleryPicker = props => {
    const galleryItems = [];
    const {Entity, values, classificationType} = props;
    values.forEach((item, i) => {
        galleryItems.push(
            <div className='selectableEntity'>
                <Entity
                    key={i}
                    name={item.title}
                    classification={item[classificationType]}
                    zoom={1}
                    qty={item.quantity}
                    image={item.img}
                />
                <input className="gpCheckbox" type="checkbox" value={i} defaultChecked />
            </div>
        );
    });
    return galleryItems.length ? galleryItems : <div>Loading...</div>
}

export default GalleryPicker;
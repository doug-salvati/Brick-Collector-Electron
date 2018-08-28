import React from 'react';
import ColorHex from '../../../data/colors.js';
import Entity from '../Entity/Entity';

const Part = (props) => {
    const {qty, color, ...rest} = props;
    return (
        <Entity
            imagepath="assets/part_images/elements"
            number={qty ? `${qty}x ` : undefined}
            icon={color}
            icon_tooltip={ColorHex[color]}
            {...rest}
        />
    );
}

export default Part;
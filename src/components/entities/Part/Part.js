import React from 'react';
import ColorHex from '../../../data/colors.js';
import Entity from '../Entity/Entity';

const Part = (props) => {
    const {qty, classification, ...rest} = props;
    return (
        <Entity
            imagepath="assets/part_images/elements"
            number={qty ? `${qty}x ` : undefined}
            icon={ColorHex[classification]}
            iconTooltip={classification}
            {...rest}
        />
    );
}

export default Part;
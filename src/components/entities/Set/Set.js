import React from 'react';
import ThemeImages from '../../../constants/themeimages.js';
import Entity from '../Entity/Entity';

const Set = (props) => {
    const {id, classification, ...rest} = props;
    return (
        <Entity
            imagepath="/Library/Application Support/com.dsalvati.brickcollector/set_images"
            number={id}
            icon={`url(assets/${ThemeImages[classification]})`}
            iconTooltip={classification}
            className="setEntity"
            {...rest}
        />
    );
}

export default Set;
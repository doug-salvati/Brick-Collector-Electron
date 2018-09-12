import React from 'react';
import ThemeImages from '../../../data/themeimages.js';
import Entity from '../Entity/Entity';

const Set = (props) => {
    const {xid, classification, ...rest} = props;
    return (
        <Entity
            imagepath="assets/set_images/sets"
            number={xid ? `${xid.split('-')[0]} ` : undefined}
            icon={`url(assets/${ThemeImages[classification]})`}
            iconTooltip={classification}
            {...rest}
        />
    );
}

export default Set;
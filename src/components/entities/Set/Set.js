import React from 'react';
import ThemeImages from '../../../data/themeimages.js';
import Entity from '../Entity/Entity';

const Set = (props) => {
    const {set_number, theme, ...rest} = props;
    return (
        <Entity
            imagepath="assets/part_images/sets"
            number={set_number ? `${set_number} ` : undefined}
            icon={ThemeImages[theme]}
            iconTooltip={theme}
            {...rest}
        />
    );
}

export default Set;
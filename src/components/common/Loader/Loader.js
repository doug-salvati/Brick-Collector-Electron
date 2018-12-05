import React from 'react';
import PropTypes from 'prop-types';
import { pick } from '../../../util/utils';
import './Loaders.css';

const loaders = [ 'generic red', 'generic green', 'generic blue' ];

const Loader = props => {
    const loader = loaders.includes(props.variety) ? props.variety : pick(loaders);
    const classNames = props.fullscreen ? `load-fullscreen ${loader}` : loader;
    return <div className={classNames}></div>;
};

Loader.propTypes = {
    // Which loading indicator to show, defaults to random
    variety: PropTypes.string,
}

export default Loader;
export { loaders };
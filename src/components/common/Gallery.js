import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-virtualized';
import Loader from '../common/Loader/Loader';

class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.itemsPerRow = (this.props.zoom !== undefined) ? 4 - this.props.zoom  : 4 - 1;
    }

    componentWillReceiveProps(newProps) {
        this.itemsPerRow = (newProps.zoom !== undefined) ? 4 - newProps.zoom : 4 - 1;
    }

    cellRenderer({ columnIndex, key, rowIndex, style }) {
        const {Entity, values, classificationType, onSelect, prefixes, generateClickHandler} = this.props;
        const linearIndex = rowIndex * this.itemsPerRow + columnIndex;
        const item = values[linearIndex];
        return ( item &&
            <span key={key} style={style} className="localize">
                <Entity
                    name={item.title}
                    classification={item[classificationType]}
                    zoom={this.itemsPerRow}
                    qty={item.quantity}
                    id={item.id}
                    image={item.img}
                    prefix={prefixes && prefixes[linearIndex]}
                    handleClick={generateClickHandler && generateClickHandler(item)}
                />
                {onSelect && <input className="top-left" type="checkbox" value={key} defaultChecked={item.enabled} onClick={() => onSelect(item.id)}/>}
            </span>
        );
    }
    render() {
        const {width = 300, height = 300} = this.props;
        const columnWidth = width / this.itemsPerRow;
        if (this.props.loading) {
            return <Loader />;
        } else if (this.props.values.length) {
            return (
                <Grid
                    cellRenderer={arg => this.cellRenderer(arg)}
                    columnCount={this.itemsPerRow}
                    columnWidth={columnWidth}
                    height={height}
                    rowCount={Math.ceil(this.props.values.length / this.itemsPerRow)}
                    rowHeight={columnWidth}
                    width={width}
                    className="blank-button"
                    tabIndex={-1}
                />
            );
        } else {
            return <div></div>;
        }
    }
}

Gallery.propTypes = {
    // Component to render in each gallery square
    Entity: PropTypes.func,
    // Array of the values passed to each square
    values: PropTypes.array,
    // Creates a callback for when an item is clicked
    generateClickHandler: PropTypes.func,
    classificationType: PropTypes.string,
    prefixes: PropTypes.array,
    zoom: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    // Whether to render checkboxes in the squares
    picker: PropTypes.bool,
    loading: PropTypes.bool,
};

export default Gallery;
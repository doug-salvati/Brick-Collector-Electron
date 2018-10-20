import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'react-virtualized';

class Gallery extends React.Component {
    itemsPerRow = this.props.zoom ? 4 - this.props.zoom  : 4 - 1;

    cellRenderer({ columnIndex, key, rowIndex, style }) {
        const {Entity, values, classificationType, picker, prefixes} = this.props;
        const linearIndex = rowIndex * this.itemsPerRow + columnIndex;
        const item = values[linearIndex];
        return ( item &&
            <span key={key} style={style}>
                <Entity
                    name={item.title}
                    classification={item[classificationType]}
                    zoom={3}
                    qty={item.quantity}
                    number={item.s_id}
                    image={item.img}
                    prefix={prefixes && prefixes[linearIndex]}
                />
                {picker && <input className="top-left" type="checkbox" value={i} defaultChecked />}
            </span>
        );
    }
    render() {
        const {width = 300, height = 300} = this.props;
        const columnWidth = width ? width / this.itemsPerRow: 100;
        return this.props.values.length ? (
            <Grid
                cellRenderer={arg => this.cellRenderer(arg)}
                columnCount={this.itemsPerRow}
                columnWidth={columnWidth}
                height={height}
                rowCount={Math.ceil(this.props.values.length / this.itemsPerRow)}
                rowHeight={columnWidth}
                width={width}
            />
        ) : <div>Loading...</div>;
    }
}

Gallery.propTypes = {
    // Component to render in each gallery square
    Entity: PropTypes.func,
    // Array of the values passed to each square
    values: PropTypes.array,
    classificationType: PropTypes.string,
    prefixes: PropTypes.array,
    zoom: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    // Whether to render checkboxes in the squares
    picker: PropTypes.bool,
};

export default Gallery;
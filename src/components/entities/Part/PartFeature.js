import React, { Component } from 'react';
import PartFeatureActions from './PartActions';
import {ipcRenderer} from 'electron';
import EntityFeature from '../Entity/EntityFeature';
import ColorHex from '../../../constants/colors.js';
import Set from '../Set/Set';

const Detail = props => {
  const { item, count } = props;
  const fromSets = item.quantity - item.loose;
  return (
    <React.Fragment>
      <b>{fromSets}x</b> from {count} set{count > 1 && 's'}<br/>
      <b>{item.loose}x</b> loose
    </React.Fragment>
  );                             
}

const getPrefixes = sets =>
  sets.map(set => set.sets_qty > 1 ? `${set.quantity * set.sets_qty}x in ${set.sets_qty}x ` : `${set.quantity}x in `);

class PartFeature extends Component {
  render() {
    const { item } = this.props;
    const bubble = <span
      className='category-circle'
      style={{background: (item.color ? ColorHex[item.color] : 'rgba(0,0,0,0)')}}
      title={item.color ? item.color : 'Color Unknown'}
    />;
    return (
      <EntityFeature
        fetcher={id => ipcRenderer.send('getSetsContainingPart', id)}
        actions={PartFeatureActions}
        updateAction="changePartQuantity"
        deleteAction="deletePart"
        imgDir="part_images"
        Entity={Set}
        Detail={Detail}
        classificationType='color'
        entityClassificationType='theme'
        subtitle={`Element #${item.id}`}
        bubble={bubble}
        min={item.quantity - item.loose}
        getPrefixes={getPrefixes}
        /* Item and Handle-Back are passed through */
        {...this.props}
      />
    );
  }
}

export default PartFeature;
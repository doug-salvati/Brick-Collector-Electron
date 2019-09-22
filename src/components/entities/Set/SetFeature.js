import React, { Component } from 'react';
import SetFeatureActions from './SetActions';
import {ipcRenderer} from 'electron';
import EntityFeature from '../Entity/EntityFeature';
import ThemeImages from '../../../constants/themeimages';
import Part from '../Part/Part';

const Detail = props => {
    const { item, count } = props;
    return (
      <React.Fragment>
        <b>{item.id.split('-')[0]}</b> contains {count} parts.
      </React.Fragment>
    );                             
  }

class SetFeature extends Component {
  render() {
    const { item } = this.props;
    const theme_image = ThemeImages[item.theme]
        ? `assets/${ThemeImages[item.theme]}`
        : 'assets/themes/no_theme.png';
    const bubble = <img className='category-circle' title={item.theme} alt={item.theme} src={theme_image} />;
    return (
      <EntityFeature
        fetcher={id => ipcRenderer.send('getPartsInSet', id)}
        actions={SetFeatureActions}
        updateAction="changeSetQuantity"
        deleteAction="deleteSet"
        imgDir="set_images"
        Entity={Part}
        Detail={Detail}
        classificationType='theme'
        entityClassificationType='color'
        subtitle={`${item.part_count} pcs`}
        bubble={bubble}
        min={1}
        /* Item and Handle-Back are passed through */
        {...this.props}
      />
    );
  }
}

export default SetFeature;
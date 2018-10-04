import React, { Component } from 'react';
import PartsScreenActions from './PartsScreenActions';
import {ipcRenderer} from 'electron';
import ColorHex from '../../../data/colors.js';
import SubScreen from '../SubScreen/SubScreen';
import Part from '../../entities/Part/Part';
import PartFeature from '../../entities/Part/PartFeature';

class PartsScreen extends Component {
  render() {
    let options = [];
    for (let color in ColorHex) {
      options.push(color);
    }
    options.sort();
    return (
      <SubScreen
        actions={PartsScreenActions}
        fetcher={() => ipcRenderer.send('getParts')}
        adder={() => global.openDialog.add_part()}
        entity={Part}
        Feature={PartFeature}
        classificationType='color'
        dropDownOptions={options}
        label='Part'
      />
    );
  }
}

export default PartsScreen;
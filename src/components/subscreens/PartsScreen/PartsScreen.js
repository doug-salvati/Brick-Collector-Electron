import React, { Component } from 'react';
import PartsScreenActions from './PartsScreenActions';
import {ipcRenderer} from 'electron';
import ColorHex from '../../../constants/colors.js';
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
        adder={() => require('@electron/remote').getGlobal('openDialog').add_part()}
        Entity={Part}
        Feature={PartFeature}
        classificationType='color'
        dropDownOptions={options}
        label='Part'
      />
    );
  }
}

export default PartsScreen;
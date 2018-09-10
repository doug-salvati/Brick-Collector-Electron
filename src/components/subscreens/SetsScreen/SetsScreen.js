import React from 'react';
import SetsScreenActions from './SetsScreenActions';
import './SetsScreen.css';
import {ipcRenderer} from 'electron';
import Themes from '../../../data/themes';
import SubScreen from '../SubScreen/SubScreen';
import Set from '../../entities/Set/Set';
import SetFeature from '../../entities/Set/SetFeature';

const SetsScreen = (props) =>
    <SubScreen
        actions={SetsScreenActions}
        fetcher={() => ipcRenderer.send('getSets')}
        adder={() => global.openDialog.add_set()}
        entity={Set}
        Feature={SetFeature}
        classificationType='theme'
        dropDownOptions={Themes}
    />

export default SetsScreen;
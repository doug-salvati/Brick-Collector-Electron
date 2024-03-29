import React from 'react';
import SetsScreenActions from './SetsScreenActions';
import {ipcRenderer} from 'electron';
import Themes from '../../../constants/themes';
import SubScreen from '../SubScreen/SubScreen';
import Set from '../../entities/Set/Set';
import SetFeature from '../../entities/Set/SetFeature';

const SetsScreen = (props) =>
    <SubScreen
        actions={SetsScreenActions}
        fetcher={() => ipcRenderer.send('getSets')}
        adder={() => require('@electron/remote').getGlobal('openDialog').add_set()}
        Entity={Set}
        Feature={SetFeature}
        classificationType='theme'
        dropDownOptions={Themes}
        label='Set'
    />

export default SetsScreen;
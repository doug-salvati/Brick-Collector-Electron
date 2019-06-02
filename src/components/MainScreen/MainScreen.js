import React, { Component } from 'react';
import {ipcRenderer} from 'electron';
import HomeScreen from '../subscreens/HomeScreen/HomeScreen';
import MOCsScreen from '../subscreens/MOCsScreen/MOCsScreen';
import SetsScreen from '../subscreens/SetsScreen/SetsScreen';
import PartsScreen from '../subscreens/PartsScreen/PartsScreen';

class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { screen: 'home' };
    }

    componentDidMount() {
        ipcRenderer.on('goToHome', () => {
            this.setState({screen: 'home'});
        });
        ipcRenderer.on('goToMOCs', () => {
            this.setState({screen: 'mocs'});
        });
        ipcRenderer.on('goToSets', () => {
            this.setState({screen: 'sets'});
        });
        ipcRenderer.on('goToParts', () => {
            this.setState({screen: 'parts'});
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('goToHome');
        ipcRenderer.removeAllListeners('goToMOCs');
        ipcRenderer.removeAllListeners('goToSets');
        ipcRenderer.removeAllListeners('goToParts');
    }
    
    setScreen(type) {
        return () => this.setState({screen: type});
    }

    render() {
        let screen, nav = [];
        for (let type of ['home', 'mocs', 'sets', 'parts']) {
            nav.push(<button key={`nav-${type}`} className={`blank-button highlight-on-focus ${this.state.screen === type && 'nav-active'}`} onClick={this.setScreen(type)}>
                <img className='img-full' src={`assets/ui_icons/${type}.svg`}
                    title={`${type} tab`} alt={type}/>
            </button>);
        }
        screen = {
            home: <HomeScreen/>,
            mocs: <MOCsScreen/>,
            sets: <SetsScreen/>,
            parts: <PartsScreen/>
        }[this.state.screen];
        return (
            <div>
                <div className='top-middle top-layer solid glow'>
                    {nav}
                </div>
                {screen}
            </div>);
    }
}

export default MainScreen;
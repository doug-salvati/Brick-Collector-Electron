import React, { Component } from 'react';
import HomeScreen from '../subscreens/HomeScreen/HomeScreen';
import MOCsScreen from '../subscreens/MOCsScreen/MOCsScreen';
import SetsScreen from '../subscreens/SetsScreen/SetsScreen';
import PartsScreen from '../subscreens/PartsScreen/PartsScreen';
import './MainScreen.css';

class MainScreen extends Component {
    constructor(props) {
        super(props);
        this.state = { screen: 'Home' };
    }

    setScreen(type) {
        return () => this.setState({screen: type});
    }

    render() {
        let screen, nav = [];
        for (let type of ['Home', 'MOCs', 'Sets', 'Parts']) {
            nav.push(<button key={`nav-${type}`} onClick={this.setScreen(type)}>{type}</button>);
        }
        screen = {
            Home: <HomeScreen/>,
            MOCs: <MOCsScreen/>,
            Sets: <SetsScreen/>,
            Parts: <PartsScreen/>
        }[this.state.screen];
        return (<div>{nav}{screen}</div>);
    }
}

export default MainScreen;
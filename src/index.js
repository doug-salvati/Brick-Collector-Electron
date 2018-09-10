import React from 'react';
import ReactDOM from 'react-dom';
import MainScreen from './components/MainScreen/MainScreen';
import AddPart from './components/dialogs/AddPart/AddPart';
import AddSet from './components/dialogs/AddSet/AddSet';
import './index.css';

// This is essentially a router

let view = window.location.search.substr(1);
switch (view) {
  case 'parts_dialog':
    ReactDOM.render(<AddPart />, document.getElementById('root'));
    break;
  case 'sets_dialog':
    ReactDOM.render(<AddSet />, document.getElementById('root'));
    break;
  default:
    ReactDOM.render(<MainScreen />, document.getElementById('root'));
}

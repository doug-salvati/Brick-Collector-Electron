import React from 'react';
import ReactDOM from 'react-dom';
import MainScreen from './components/MainScreen/MainScreen';
import AddPart from './components/dialogs/AddPart/AddPart';
import './index.css';

let view = window.location.search.substr(1);
switch (view) {
  case 'parts_dialog':
    ReactDOM.render(<AddPart />, document.getElementById('root'));
    break;
  default:
    ReactDOM.render(<MainScreen />, document.getElementById('root'));
}

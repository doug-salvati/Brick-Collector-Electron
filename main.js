// This file is the main entry point for Electron.
// It sets up communication channels, windows, menu, etc.

const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const mysql = require('mysql');
const DatabaseAPI = require('./db/api.js').default;
const fs = require('fs');
const mysqlConfig = require('./config/mysql.config');
const menuBar = require('./src/main/menuBar');
const ipcDispatcher = require('./src/main/dispatcher');
const createDialogs = require('./src/main/dialogs');

const dbConnection = mysql.createConnection(mysqlConfig);
ipcDispatcher(DatabaseAPI(dbConnection));
global.rebrickable = fs.readFileSync(path.join(__dirname, 'src/constants/apikey.txt')).toString();
createDialogs();

app.on('ready', () => {
    dbConnection.connect();
    global.win = new BrowserWindow({width: 800, height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    global.win.loadURL(path.join('file://', __dirname, '/public/index.html'));
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuBar));
});

app.on('quit', () => {
    dbConnection.end();
});
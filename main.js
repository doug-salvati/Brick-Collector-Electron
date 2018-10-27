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
const openInDialog = require('./src/main/openInDialog');

const dbConnection = mysql.createConnection(mysqlConfig);
ipcDispatcher(DatabaseAPI(dbConnection));
global.rebrickable = fs.readFileSync('./src/data/apikey.txt').toString();

// Modal windows
global.openDialog = {
    "add_part": function() { openInDialog('/public/index.html?parts_dialog') },
    "add_set": function() { openInDialog('/public/index.html?sets_dialog') },
}

app.on('ready', () => {
    dbConnection.connect();
    global.win = new BrowserWindow({width: 800, height: 600});
    global.win.loadURL(path.join('file://', __dirname, '/public/index.html'));
    Menu.setApplicationMenu(Menu.buildFromTemplate(menuBar));
});

app.on('quit', () => {
    dbConnection.end();
});
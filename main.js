// This file is the main entry point for Electron.
// It sets up communication channels, windows, menu, etc.

const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const path = require('path');
const mysql = require('mysql');
const {systemPreferences} = require('electron');
const DatabaseAPI = require('./db/api.js').default;
const fs = require('fs');
const request = require('request');

// Don't show the 'start speaking' or 'emoji' buttons
systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true);
systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true);

// Connect to MySQL
const dbConnection = mysql.createConnection({
    host: 'localhost',
    user: 'bc_app',
    password: 'bc_pw',
    database: 'brickcollectordev'
});
const connection = DatabaseAPI(dbConnection);

// Channel for communication between windows
ipcMain.on('addPart', function(event, part) {
    const img_src = part.img;
    const img_dest = `public/assets/part_images/elements/${part.p_id}.jpg`;
    const final_part = Object.assign({}, part, {img: `${part.p_id}.jpg`});
    request.head(img_src, () => {
        request(img_src).pipe(fs.createWriteStream(img_dest)).on('close', () => {
            connection.addPart(final_part, () => {
                global.win.webContents.send('newPartSent', final_part);
            });
        });
    });
});
ipcMain.on('getParts', function(event) {
    connection.getPartsCount(function(e,r) {
        connection.getParts(function(e,s) {
            global.win.webContents.send('partsSent', {part_count: r, parts: s});
        });
    });
});
ipcMain.on('getSets', function(event) {
    connection.getSetsCount(function(e,r) {
        connection.getSets(function(e,s) {
            global.win.webContents.send('setsSent', {set_count: r, sets: s});
        });
    });
});
ipcMain.on('deletePart', function(event, part) {
    connection.deletePart(part, () => {
        global.win.webContents.send('partDeleted', part);
    });
});
ipcMain.on('changePartQuantity', function(event, part, quantity) {
    connection.changePartQuantity(part, quantity, () => {
        global.win.webContents.send('newPartSent', Object.assign({}, part, {quantity: quantity - part.quantity}));
    })
});

// Read rebrickable API key
global.rebrickable = fs.readFileSync('./src/data/apikey.txt').toString();

// Modal windows
// This needs to be at this scope so that callbacks
// are available in the menu bar, which is outside of React
global.openDialog = {
    "add_part": function() {
        let dialog = new BrowserWindow({parent: global.win, modal: true, show: false, width: 400, height: 500});
        dialog.loadURL(path.join('file://', __dirname, '/public/index.html?parts_dialog'));
        dialog.once('ready-to-show', () => dialog.show());
    },
    "add_set": function() {
        let dialog = new BrowserWindow({parent: global.win, modal: true, show: false, width: 400, height: 500});
        dialog.loadURL(path.join('file://', __dirname, '/public/index.html?sets_dialog'));
        dialog.once('ready-to-show', () => dialog.show());
    },
}

// Main window
function createWindow () {
    global.win = new BrowserWindow({width: 800, height: 600});
    global.win.loadURL(path.join('file://', __dirname, '/public/index.html'));
}

// Menu bar functions
function zoomIn() {
    global.win.webContents.send('zoomIn');
}
function zoomOut() {
    global.win.webContents.send('zoomOut');
}

// Menu bar
function setMenu() {
    const template = [
        {label: 'Brick Collector',
            submenu: [
                { role: 'about' },
                { type: 'separator'},
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator'},
                { role: 'quit'}
            ]
        },
        {label: 'Edit',
            submenu: [
                { role: 'copy' },
                { role: 'paste' }
            ]
        },
        /* {label: 'Collection',
            submenu: [
                {
                    label: 'New Set', accelerator: 'CmdOrCtrl + S',
                    click() {console.log("Add a set")}
                },
                {
                    label: 'New Part', accelerator: 'CmdOrCtrl + P',
                    click() {global.openDialog.add_part()}
                },
                {
                    label: 'New MOC', accelerator: 'CmdOrCtrl + M',
                    click() {console.log("Add a moc")}
                },
            ]

        }, */
        {label: 'View',
            submenu: [
                {
                    label: 'Home', accelerator: 'CmdOrCtrl + 1',
                    click() {console.log("go home")}
                },
                {
                    label: 'Browse Sets', accelerator: 'CmdOrCtrl + 2',
                    click() {console.log("view sets")}
                },
                {
                    label: 'Browse Parts', accelerator: 'CmdOrCtrl + 3',
                    click() {console.log("view parts")}
                },
                {
                    label: 'Browse MOCs', accelerator: 'CmdOrCtrl + 4',
                    click() {console.log("view mocs")}
                },
                { type: 'separator'},
                {
                    label: 'Zoom In', accelerator: 'CmdOrCtrl + =',
                    click() {zoomIn()}
                },
                {
                    label: 'Zoom Out', accelerator: 'CmdOrCtrl + -',
                    click() {zoomOut()}
                },
            ]

        },
        {label: 'Develop',
            submenu: [
                {role: 'toggledevtools'},
            ]
        },
        {role: 'help'}
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }

app.on('ready', () => {
    dbConnection.connect();
    createWindow();
    setMenu();
});

app.on('quit', () => {
    dbConnection.end();
});
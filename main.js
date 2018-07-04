const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const url = require('url');
const mysql = require('mysql');
const {systemPreferences} = require('electron')

systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)

// Connect to MySQL
global.connection = mysql.createConnection({
    host: 'localhost',
    user: 'bc_app',
    password: 'bc_pw',
    database: 'brickcollectordev'
});

// Open a new Electron window
global.openDialog = {
    "add_part": function() {
        let dialog = new BrowserWindow({parent: global.win, modal: true, show: false, width: 400, height: 500});
        dialog.loadURL(path.join('file://', __dirname, '/public/index.html?parts_dialog'));
        dialog.once('ready-to-show', () => dialog.show());
    }
}

function createWindow () {
    global.win = new BrowserWindow({width: 800, height: 600});
    global.win.loadURL(path.join('file://', __dirname, '/public/index.html'));
}

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
        {label: 'Collection',
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

        },
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
                }
            ]

        },
        {role: 'help', submenu: [{role: 'toggledevtools'}]}
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }

app.on('ready', () => {
    global.connection.connect();
    createWindow();
    setMenu();
});

app.on('quit', () => {
    global.connection.end();
});
const { dialog, shell } = require('electron');
const mysqldump = require('mysqldump');
const mysqlConfig = require('../../config/mysql.config');

const BrickCollector = {
    label: 'Brick Collector',
    submenu: [
        { role: 'about' },
        { type: 'separator'},
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator'},
        { role: 'quit'}
    ]
};

const File = {
    label: 'File',
    submenu: [
        {
            label: 'Export...', accelerator: 'CmdOrCtrl + E',
            click() {
                const saveOptions = {
                    buttonLabel: 'Export',
                    defaultPath: 'collection'
                }
                dialog.showSaveDialog(global.win, saveOptions, fileName => {
                    mysqldump({
                        connection: mysqlConfig,
                        dumpToFile: `${fileName}.bcc`,
                    });
                });
            }
        }
    ]
};

const Edit = {
    label: 'Edit',
    submenu: [
        { role: 'copy' },
        { role: 'paste' },
        {type: 'separator'},
        {
            label: 'Speech',
            submenu: [
                {role: 'startspeaking'},
                {role: 'stopspeaking'}
            ]
        }
    ]
};

const Collection = {
    label: 'Collection',
    submenu: [
        {
            label: 'New Set', accelerator: 'CmdOrCtrl + S',
            click() {global.openDialog.add_set()}
        },
        {
            label: 'New Part', accelerator: 'CmdOrCtrl + P',
            click() {global.openDialog.add_part()}
        },
        { type: 'separator'},
        {
            label: 'Filter', accelerator: 'CmdOrCtrl + L',
            click() {global.win.webContents.send('filter')}
        }
    ]
};

const View = {
    label: 'View',
    submenu: [
        {
            label: 'Zoom In', accelerator: 'CmdOrCtrl + =',
            click() {global.win.webContents.send('zoomIn')}
        },
        {
            label: 'Zoom Out', accelerator: 'CmdOrCtrl + -',
            click() {global.win.webContents.send('zoomOut')}
        },
    ]
};

const Develop = {
    label: 'Develop',
    submenu: [
        {role: 'toggledevtools'},
        { type: 'separator'},
        {
            label: 'Custom Part', accelerator: 'CmdOrCtrl + Shift + P',
            click() {global.openDialog.add_part_form()}
        },
        {
            label: 'Open Part Images in Finder',
            click () { shell.openExternal('file:///Users/doug/Code/electron/brick-collector/public/assets/part_images/elements') }
        }
    ]
}

const Help = {
    role: 'help',
    submenu: [
        {
            label: 'About Rebrickable API',
            click () { shell.openExternal('https://rebrickable.com/api/') }
        }
    ]
};

module.exports = [
    BrickCollector,
    File,
    Edit,
    Collection,
    View,
    Develop,
    Help
];
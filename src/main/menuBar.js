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
            label: 'Increase Quantity', accelerator: 'CmdOrCtrl + ]',
            click() {global.win.webContents.send('increaseQuantity')}
        },
        {
            label: 'Decrease Quantity', accelerator: 'CmdOrCtrl + [',
            click() {global.win.webContents.send('decreaseQuantity')}
        },
        { type: 'separator'},
        {
            label: 'Filter', accelerator: 'CmdOrCtrl + L',
            click() {global.win.webContents.send('filter')}
        },
        {
            label: 'Category', accelerator: 'CmdOrCtrl + ;',
            click() {global.win.webContents.send('dropdown')}
        }
    ]
};

const View = {
    label: 'View',
    submenu: [
        // {
        //     label: 'Home', accelerator: 'CmdOrCtrl + 1',
        //     click() {global.win.webContents.send('goToHome')}
        // },
        // {
        //     label: 'MOCs', accelerator: 'CmdOrCtrl + 2',
        //     click() {global.win.webContents.send('goToMOCs')}
        // },
        {
            label: 'Sets', accelerator: 'CmdOrCtrl + 1',
            click() {global.win.webContents.send('goToSets')}
        },
        {
            label: 'Parts', accelerator: 'CmdOrCtrl + 2',
            click() {global.win.webContents.send('goToParts')}
        },
        { type: 'separator' },
        {
            label: 'Zoom In', accelerator: 'CmdOrCtrl + =',
            click() {global.win.webContents.send('zoomIn')}
        },
        {
            label: 'Zoom Out', accelerator: 'CmdOrCtrl + -',
            click() {global.win.webContents.send('zoomOut')}
        },
        { type: 'separator' },
        {
            label: '⇱ Item In Bricklink',
            click() {global.win.webContents.send('openExternalSite', 'bricklink')}
        },
        {
            label: '⇱ Item In Rebrickable',
            click() {global.win.webContents.send('openExternalSite', 'rebrickable')}
        },
        {
            label: '⇱ Instructions',
            click() {global.win.webContents.send('openExternalSite', 'instructions')}
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
            click () { shell.openExternal('file:///Library/Application Support/com.dsalvati.brickcollector/part_images') }
        }
    ]
}

const Help = {
    role: 'help',
    submenu: [
        {
            label: 'Documentation',
            click () { shell.openExternal('https://github.com/doug-salvati/Brick-Collector/blob/master/README.md') }
        },
        {
            label: 'About Rebrickable API',
            click () { shell.openExternal('https://rebrickable.com/api/') }
        }
    ]
};

const baseMenu = [
    BrickCollector,
    File,
    Edit,
    Collection,
    View,
    Help
];

if (process.env.NODE_ENV === 'development') {
    baseMenu.push(Develop);
}

module.exports = baseMenu;

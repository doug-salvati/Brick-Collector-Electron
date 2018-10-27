const { BrowserWindow } = require('electron');
const path = require('path');

const dialogWidth = 400;
const dialogHeight = 500;

module.exports = pathName => {
    let dialog = new BrowserWindow({
        parent: global.win,
        modal: true,
        show: false,
        width: dialogWidth,
        height: dialogHeight,
        resizable: false
    });
    dialog.loadURL(path.join('file://', __dirname, '../..', pathName));
    dialog.once('ready-to-show', () => dialog.show());
};
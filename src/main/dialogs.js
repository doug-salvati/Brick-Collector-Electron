const { BrowserWindow } = require('electron');
const { mapObject } = require('../util/utils');
const path = require('path');

const dialogWidth = 400;
const dialogHeight = 500;

const dialogBoxes = {
    add_part: '/public/index.html?parts_dialog',
    add_set: '/public/index.html?sets_dialog',
    add_part_form: '/public/index.html?parts_form_dialog',
}

const openInDialog = pathName => {
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

module.exports = () => {
    global.openDialog = mapObject(dialogBoxes, (_, value) => () => openInDialog(value));
}
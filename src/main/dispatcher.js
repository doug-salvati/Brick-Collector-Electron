const { ipcMain } = require('electron');
const request = require('request');
const fs = require('fs');

const downloadImageAsync = (src, dest) => {
    request.head(src, () => {
        request(src).pipe(fs.createWriteStream(dest));
    });
};

module.exports = (connection) => {
    ipcMain.on('addPart', function(_, part) {
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
    ipcMain.on('addSet', function(_, {set, parts}) {
        // Add entry for the set
        const img_src = set.img;
        const img_dest = `public/assets/set_images/sets/${set.s_id}.jpg`;
        const final_set = Object.assign({}, set, {img: `${set.s_id}.jpg`});
        request.head(img_src, () => {
            request(img_src).pipe(fs.createWriteStream(img_dest)).on('close', () => {
                connection.addSet(final_set, () => {
                    global.win.webContents.send('newSetSent', final_set);
                });
            });
        });
        // Add parts
        for (idx in parts) {
            const part = parts[idx];
            const src = part.img;
            const dest = `public/assets/part_images/elements/${part.p_id}.jpg`;
            downloadImageAsync(src, dest);
            parts[idx].img = `${part.p_id}.jpg`;
        }
        connection.addPartsAndBridge(set, parts, () => {
            connection.getPartsCount(function(e,r) {
                connection.getParts(function(e,s) {
                    global.win.webContents.send('partsSent', {part_count: r, parts: s});
                });
            });
        })
    });
    ipcMain.on('getParts', function() {
        connection.getPartsCount(function(_,r) {
            connection.getParts(function(_,s) {
                global.win.webContents.send('partsSent', {part_count: r, parts: s});
            });
        });
    });
    ipcMain.on('getSets', function() {
        connection.getSetsCount(function(_,r) {
            connection.getSets(function(_,s) {
                global.win.webContents.send('setsSent', {set_count: r, sets: s});
            });
        });
    });
    ipcMain.on('getPartsInSet', function(_, s_id) {
        connection.getPartsInSet(s_id, function(_,r) {
            global.win.webContents.send('partsSent', r);
        });
    });
    ipcMain.on('getSetsContainingPart', function(_, p_id) {
        connection.getSetsContainingPart(p_id, function(e,r) {
            global.win.webContents.send('setsSent', r);
        })
    });
    ipcMain.on('deletePart', function(_, part) {
        connection.deletePart(part, () => {
            global.win.webContents.send('partDeleted', part);
        });
    });
    ipcMain.on('changePartQuantity', function(_, part, quantity) {
        connection.changePartQuantity(part, quantity, () => {
            global.win.webContents.send('newPartSent', Object.assign({}, part, {quantity: quantity, loose: quantity}));
        })
    });
};
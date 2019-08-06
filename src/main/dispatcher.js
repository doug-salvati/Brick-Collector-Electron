const { ipcMain } = require('electron');
const path = require('path');
const request = require('request');
const fs = require('fs');

async function downloadImagesAsync(images) {
    const imageCount = images.length;
    console.info(`[INFO] Downloading ${images.length} images.`);
    for (i in images) {
        const image = images[i];
        const count = parseInt(i) + 1;
        console.info(`[INFO] Awaiting ${image.src} (${count}/${imageCount})`);
        await downloadImage(image.src, image.dest);
    }
    console.info(`[INFO] Downloads complete.`);
}

const downloadImage = (src, dest) => {
    return new Promise(resolve => {
        request.head(src, () => {
            try {
                request(src).pipe(fs.createWriteStream(dest.substring(0, 200))).on('close', resolve);
            } catch(e) {
                console.error(`[ERROR] Image download for ${src} failed: ${e}`);
            }
        });
    })
};

module.exports = (connection) => {
    ipcMain.on('addPart', function(_, part) {
        const img_src = part.img;
        const dest_filename = img_src ? `${part.p_id}.jpg` : 'no_img.png';
        const img_dest = `public/assets/part_images/elements/${dest_filename}`;
        const final_part = Object.assign({}, part, {img: dest_filename});
        if (img_src && img_src.includes('http')) {
            request.head(img_src, () => {
                request(img_src).pipe(fs.createWriteStream(path.join(__dirname, '../..', img_dest))).on('close', () => {
                    connection.addPart(final_part, () => {
                        global.win.webContents.send('newPartSent', final_part);
                    });
                });
            });
        } else {
            connection.addPart(final_part, () => {
                global.win.webContents.send('newPartSent', final_part);
            });
        }
    });
    ipcMain.on('addSet', function(_, {set, parts}) {
        // Add entry for the set
        const img_src = set.img;
        const img_dest = `public/assets/set_images/sets/${set.s_id}.jpg`;
        const final_set = Object.assign({}, set, {img: `${set.s_id}.jpg`});
        request.head(img_src, () => {
            request(img_src).pipe(fs.createWriteStream(path.join(__dirname, '../..', img_dest))).on('close', () => {
                connection.addSet(final_set, () => {
                    global.win.webContents.send('newSetSent', final_set);
                });
            });
        });
        // Add parts
        const final_parts = [];
        const images = [];
        for (idx in parts) {
            const part = parts[idx];
            const img_src = part.img;
            const dest_filename = img_src ? `${part.p_id.replace(/\//g, '')}.jpg` : 'no_img.png';
            const img_dest = `public/assets/part_images/elements/${dest_filename}`;
            final_parts.push(Object.assign({}, part, {img: dest_filename}));
            if (img_src) {
                images.push({src: img_src, dest: path.join(__dirname, '../..', img_dest)});
            }
            parts[idx].img = `${part.p_id}.jpg`;
        }
        downloadImagesAsync(images);
        connection.addPartsAndBridge(set, final_parts, () => {
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
    ipcMain.on('deleteSet', function(_, set) {
        connection.deleteSet(set, () => {
            connection.deletePartsContainedInSetAndCleanBridge(set, () => {
                global.win.webContents.send('setDeleted', set);
            })
        })
    })
    ipcMain.on('changePartQuantity', function(_, part, quantity) {
        connection.changePartQuantity(part, quantity, () => {
            global.win.webContents.send('newPartSent', Object.assign({}, part, {quantity: quantity, loose: quantity}));
        })
    });
    ipcMain.on('changeSetQuantity', function(_, set, quantity) {
        connection.changeSetQuantity(set, quantity, () => {
            global.win.webContents.send('newSetSent', Object.assign({}, set, {quantity: quantity}));
        })
    });
};
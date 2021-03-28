import { ipcMain, dialog } from 'electron';
import fs from 'fs';
import isImage from 'is-image';
import path from 'path';
import fileSize from 'filesize';

function setMainPc(win) {
    ipcMain.on('open-directory', (event) => {
        dialog.showOpenDialog(win, {
            title: 'Seleccione la nueva ubicación',
            buttonLabel: 'Abrir ubicación',
            properties: ['openDirectory']
        }).then((dir) => {
            if (dir.canceled) return;

            loadImages(event, dir.filePaths[0]);
        });
    });

    ipcMain.on('load-default-images', (event, dir) => loadImages(event, dir));

    ipcMain.on('save-save-dialog', (event, ext) => {
        dialog.showSaveDialog(win, {
            title: 'Guardar imagen modificada',
            buttonLabel: 'Guardar imagen',
            filters: [{
                name: 'Images', extensions: [ext.substr(1)]
            }]
        }).then((file) => {
            if (file.canceled) return;

            event.sender.send('save-image', file.filePath);
        });
    });

    ipcMain.on('show-dialog', (event, info) => {
        dialog.showMessageBox(win, {
            type: info.type,
            title: info.title,
            message: info.msg
        });
    });
}

function loadImages(event, dir) {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        let images = files
            .filter(file => isImage(file))
            .map(img => {
                let pathFile = path.join(dir, img);
                let statsFile = fs.statSync(pathFile);
                return {
                    name: img,
                    src: `imp://${pathFile}`,
                    size: fileSize(statsFile.size, { round: 0 })
                }
            });

        event.sender.send('load-images', dir, images);
    });
}

module.exports = setMainPc;

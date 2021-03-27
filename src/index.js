'use strict';

import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import devtools from './devtools';
import fs from 'fs';
import isImage from 'is-image';
import path from 'path';
import fileSize from 'filesize';

let win;

if (process.env.NODE_ENV == 'development') {
    devtools();
}

app.on('before-quit', () => {
    console.log('Saliendo...');
});

app.on('ready', () => {
    win = new BrowserWindow({
        width: 840,
        height: 600,
        title: 'Hola mundo',
        center: true,
        maximizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.once('ready-to-show', () => {
        win.show()
    });

    win.on('closed', () => {
        win = null;
        app.quit();
    });

    // win.loadURL('https://devdocs.io/');
    win.loadURL(`file://${__dirname}/renderer/index.html`);
    // win.toggleDevTools();
});

ipcMain.on('open-directory', (event, arg) => {
    dialog.showOpenDialog(win, {
        title: 'Seleccione la nueva ubicación',
        buttonLabel: 'Abrir ubicación',
        properties: ['openDirectory']
    }).then((dir) => {
        console.log('el dir seleccionado', dir);

        if (dir.canceled) return;

        let directoryChoosed = dir.filePaths[0];
        fs.readdir(directoryChoosed, (err, files) => {
            if (err) throw err;

            let images = files
                .filter(file => isImage(file))
                .map(img => {
                    let pathFile = path.join(directoryChoosed, img);
                    let statsFile = fs.statSync(pathFile);
                    return {
                        name: img,
                        src: `file://${pathFile}`,
                        size: fileSize(statsFile.size, { round: 0 })
                    }
                });
            
            event.sender.send('load-images', images);
        });
    });
});

'use strict';

import { app, BrowserWindow, ipcMain } from 'electron';
import devtools from './devtools';

if (process.env.NODE_ENV == 'development') {
    devtools();
}

app.on('before-quit', () => {
    console.log('Saliendo...');
});

app.on('ready', () => {
    let win = new BrowserWindow({
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

ipcMain.on('ping', (event, arg) => {
    console.log(`se recibió ping - ${arg}`);
    event.sender.send('pong', new Date());
});

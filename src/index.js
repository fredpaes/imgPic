'use strict';

import { app, BrowserWindow } from 'electron';
import devtools from './devtools';
import handleErrors from './handle-errors';
import setMainPc from './ipcMainEvents';

global.win;

if (process.env.NODE_ENV == 'development') {
    devtools();
}

app.on('before-quit', () => {
    console.log('Saliendo...');
});

app.on('ready', () => {
    global.win = new BrowserWindow({
        width: 840,
        height: 600,
        title: 'Hola mundo',
        center: true,
        maximizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
    });

    setMainPc(global.win);
    handleErrors(global.win);

    global.win.once('ready-to-show', () => {
        global.win.show()
    });

    global.win.on('closed', () => {
        global.win = null;
        app.quit();
    });

    // global.win.loadURL('https://devdocs.io/');
    global.win.loadURL(`file://${__dirname}/renderer/index.html`);
    // global.win.toggleDevTools();
});

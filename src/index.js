'use strict';

import { app, BrowserWindow, Tray, globalShortcut, protocol } from 'electron';
import devtools from './devtools';
import handleErrors from './handle-errors';
import setMainPc from './ipcMainEvents';
import os from 'os';
import path from 'path';

global.win;
global.tray;

if (process.env.NODE_ENV == 'development') {
    devtools();
}

app.on('before-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('ready', () => {
    protocol.registerFileProtocol('imp', (request, callback) => {
        const url = request.url.substr(6);
        callback({ path: path.normalize(url) })
    })

    global.win = new BrowserWindow({
        width: 840,
        height: 600,
        title: 'ImgPics',
        center: true,
        maximizable: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'assets', 'icons', 'main-icon.png')
    });

    globalShortcut.register('CommandOrControl+Alt+p', () => {
        global.win.show();
        global.win.focus();
    })

    setMainPc(global.win);
    handleErrors(global.win);

    global.win.once('ready-to-show', () => {
        global.win.show()
    });

    global.win.on('closed', () => {
        global.win = null;
        app.quit();
    });

    let icon = os.platform() === 'win32'
        ? path.join(__dirname, 'assets', 'icons', 'tray-icon.ico')
        : path.join(__dirname, 'assets', 'icons', 'tray-icon.png');

    global.tray = new Tray(icon);
    global.tray.setToolTip('ImgPics');
    global.tray.on('click', () => {
        global.win.isVisible() ? global.win.hide() : global.win.show();
    });

    // global.win.loadURL('https://devdocs.io/');
    global.win.loadURL(`file://${__dirname}/renderer/index.html`);
    // global.win.toggleDevTools();
});

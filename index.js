'use strict';

const { app, BrowserWindow } = require('electron');

app.on('before-quit', () => {
    console.log('Saliendo...');
});

app.on('ready', () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Hola mundo',
        center: true,
        maximizable: false
    });

    win.on('move', () => {
        const position = win.getPosition();
        console.log(`La posición de la ventana es ${position}`);
    });

    win.on('closed', () => {
        win = null;
        app.quit();
    });
});

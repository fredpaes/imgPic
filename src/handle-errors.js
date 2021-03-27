import { dialog } from 'electron';

function relaunchApp(win) {
    dialog.showMessageBox(win, {
        type: 'error',
        title: 'ImageApp',
        message: 'Ocurrió un error inesperado, se reiniciará el aplicativo'
    }, () => {
        app.relaunch();
        app.exit(0);
    });
}

function setUpErrors(win) {
    win.webContents.on('crashed', () => {
        relaunchApp(win);
    });

    win.on('unresponsive', () => {
        dialog.showMessageBox(win, {
            type: 'warning',
            title: 'ImageApp',
            message: 'Un proceso esta tardando demasiado'
        })
    });

    process.on('uncaughtException', (err) => {
        relaunchApp(win);
    });
}

module.exports = setUpErrors;

import { ipcRenderer, remote } from 'electron';
import { addImagesEvent, selectFirstImage } from './images-ui';
import path from 'path';
import { saveImage } from './filters';
import os from 'os';
import settings from 'electron-settings';

async function setIpc() {
    if (settings.has('directory')) {
        ipcRenderer.send('load-default-images', await settings.get('directory'));
    }

    ipcRenderer.on('load-images', (event, dir, images) => {
        clearImages();
        loadImages(images);
        addImagesEvent();
        selectFirstImage();
        settings.set('directory', dir);
        document.getElementById('directory-footer').innerHTML = dir;
    });

    ipcRenderer.on('save-image', (event, file) => saveImage(file, (err) => {
        if (err) return showDialog('error', 'ImageApp', err.message);
        return showDialog('info', 'ImageApp', 'La imagen fue guardada');
    }));
}

function openDirectory() {
    ipcRenderer.send('open-directory');
}

function clearImages() {
    const oldImages = document.querySelectorAll('li.list-group-item');
    oldImages.forEach(oldImage => oldImage.parentNode.removeChild(oldImage));
}

function loadImages(images) {
    const imagesList = document.querySelector('ul.list-group');

    images.forEach(image => {
        let imageTemplate = `
        <li class="list-group-item">
            <img class="media-object pull-left" src="${image.src}" height="32">
            <div class="media-body">
                <strong>${image.name}</strong>
                <p>${image.size}</p>
            </div>
        </li>`;

        imagesList.insertAdjacentHTML('beforeend', imageTemplate);
    });
}

function saveFile() {
    const image = document.getElementById('image-displayed').dataset.original;
    const imageExtension = path.extname(image);
    ipcRenderer.send('save-save-dialog', imageExtension);
}

function showDialog(type, title, msg) {
    ipcRenderer.send('show-dialog', { type, title, msg });
}

function openPreferences() {
    const browserWindow = remote.BrowserWindow;
    const mainWindow = remote.getGlobal('win');

    const preferencesWindow = new browserWindow({
        width: 400,
        height: 300,
        title: 'Preferencias',
        center: true,
        modal: true,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    if (os.platform() !== 'win32') {
        preferencesWindow.setParentWindow(mainWindow);
    }
    preferencesWindow.once('ready-to-show', () => {
        preferencesWindow.show();
        preferencesWindow.focus();
    });

    preferencesWindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`);
}

module.exports = {
    setIpc,
    openDirectory,
    saveFile,
    openPreferences
};

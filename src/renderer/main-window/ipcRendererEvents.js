import { ipcRenderer, remote, clipboard } from 'electron';
import { addImagesEvent, selectFirstImage } from './images-ui';
import path from 'path';
import { saveImage } from './filters';
import os from 'os';
import settings from 'electron-settings';
import clientCloudUp from 'cloudup-client';
import crypto from 'crypto-js';

const token = 'SECRET_TOKEN';

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

        document.getElementById('image-displayed').dataset.filtered = file;
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

async function uploadImage() {
    let imageNodo = document.getElementById('image-displayed').src;
    let image = imageNodo.dataset.filtered ? imageNodo.dataset.filtered : imageNodo.src;
    image = image.replace('file://', '');
    let fileName = path.basename(image);

    if (settings.has('cloudup.user') && settings.has('cloudup.password')) {
        let password = await settings.get('cloudup.password');
        let user = await settings.get('cloudup.user');
        let decrypt = crypto.AES.decrypt(password, token);
        let decrypted = decrypt.toString(crypto.enc.Utf8);

        const client = clientCloudUp({
            user,
            password: decrypted
        });

        const stream = client.stream({ title: `ImgPics - ${fileName}` });
        stream.file(image).save((err) => {
            if (err) {
                showDialog('error', 'ImgPics', 'Verifique su conexión y/o credenciales de CloudUp');
            } else {
                clipboard.writeText(stream.url);
                showDialog('info', 'ImgPics', `Imagen cargada con éxito - ${stream.url}, el enlace se copió al portapapeles`);
            }
        });
    } else {
        showDialog('error', 'ImgPics', 'Por favor complete las preferencias');
    }
}

function pasteImage() {
    const image = clipboard.readImage();
    const data = image.toDataURL();
    if (data.indexOf('data:image/png;base64') !== -1 && !image.isEmpty()) {
        let mainImage = document.getElementById('image-displayed');
        mainImage.src = data;
        mainImage.dataset.original = data;
    } else {
        showDialog('error', 'ImgPics', 'No hay una imagen válida en portapapeles');
    }
}

module.exports = {
    setIpc,
    openDirectory,
    saveFile,
    openPreferences,
    uploadImage,
    pasteImage
};

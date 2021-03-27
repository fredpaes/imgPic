import { ipcRenderer } from 'electron';
import { addImagesEvent, selectFirstImage } from './images-ui';
import path from 'path';
import { saveImage } from './filters'

function setIpc() {
    ipcRenderer.on('load-images', (event, images) => {
        clearImages();
        loadImages(images);
        addImagesEvent();
        selectFirstImage();
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

module.exports = {
    setIpc,
    openDirectory,
    saveFile
};

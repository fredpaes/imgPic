import { ipcRenderer } from 'electron';
import { addImagesEvent, selectFirstImage } from './images-ui';

function setIpc() {
    ipcRenderer.on('load-images', (event, images) => {
        clearImages();
        loadImages(images);
        addImagesEvent();
        selectFirstImage();
    });
}

function openDirectory() {
    ipcRenderer.send('open-directory')
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

module.exports = {
    setIpc,
    openDirectory
};

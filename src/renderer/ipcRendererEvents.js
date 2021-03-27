import { ipcRenderer } from 'electron';

function setIpc() {
    ipcRenderer.on('load-images', (event, images) => {
        clearImages();
        loadImages(images);
        addImageEvent();
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

function addImageEvent() {
    const thumbs = document.querySelectorAll('li.list-group-item');

    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].addEventListener('click', function () {
            changeImage(this);
        });
    }
}

function changeImage(nodo) {
    let selected = document.querySelector('li.selected');
    if (selected) {
        selected.classList.remove('selected');
    }
    if (nodo) {
        nodo.classList.add('selected');
        document.getElementById('image-displayed').src = nodo.querySelector('img').src;
    }
}

function selectFirstImage() {
    const image = document.querySelector('li.list-group-item:not(.hidden');
    changeImage(image);
}

module.exports = {
    setIpc,
    openDirectory
};

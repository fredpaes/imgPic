import url from 'url';
import path from 'path';
import applyFilter from './filters';

function addImagesEvent() {
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

function selectEvent() {
    const select = document.getElementById('filter_picker');

    select.addEventListener('change', function () {
        applyFilter(this.value, document.getElementById('image-displayed'));
    })
}

function searchImagesEvent() {
    const searchBox = document.getElementById('search-box');

    searchBox.addEventListener('keyup', function () {
        const regex = new RegExp(this.value.toLowerCase(), 'gi');
        const thumbs = document.querySelectorAll('li.list-group-item img');

        if (this.value.length) {
            for (let i = 0; i < thumbs.length; i++) {
                const fileUrl = url.parse(thumbs[i].src);
                const fileName = path.basename(fileUrl.pathname);

                if (fileName.match(regex)) {
                    thumbs[i].parentNode.classList.remove('hidden');
                } else {
                    thumbs[i].parentNode.classList.add('hidden');
                }
            }
        } else {
            for (let i = 0; i < thumbs.length; i++) {
                thumbs[i].parentNode.classList.remove('hidden');
            }
        }
        selectFirstImage();
    });
}

module.exports = {
    addImagesEvent,
    changeImage,
    selectFirstImage,
    selectEvent,
    searchImagesEvent
}
import { openDirectory, setIpc, saveFile, openPreferences, uploadImage, pasteImage } from './main-window/ipcRendererEvents';
import { addImagesEvent, searchImagesEvent, selectEvent, print } from './main-window/images-ui';
import createMenu from './main-window/menu';

window.addEventListener('load', () => {
    setIpc();
    addImagesEvent();
    searchImagesEvent();
    selectEvent();
    buttonEvent('open-directory', openDirectory);
    buttonEvent('open-preferences', openPreferences);
    buttonEvent('save-button', saveFile);
    buttonEvent('print-button', print);
    buttonEvent('upload-button', uploadImage);
    buttonEvent('paste-button', pasteImage);
});

function buttonEvent(id, func) {
    const buttonById = document.getElementById(id);

    buttonById.addEventListener('click', func);
}

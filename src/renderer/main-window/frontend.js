import { openDirectory, setIpc, saveFile, openPreferences, uploadImage } from './main-window/ipcRendererEvents';
import { addImagesEvent, searchImagesEvent, selectEvent, print } from './main-window/images-ui';

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
});

function buttonEvent(id, func) {
    const buttonById = document.getElementById(id);

    buttonById.addEventListener('click', func);
}

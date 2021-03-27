import { openDirectory, setIpc, saveFile } from './ipcRendererEvents';
import { addImagesEvent, searchImagesEvent, selectEvent } from './images-ui';

window.addEventListener('load', () => {
    setIpc();
    addImagesEvent();
    searchImagesEvent();
    selectEvent();
    buttonEvent('open-directory', openDirectory);
    buttonEvent('save-button', saveFile);
});

function buttonEvent(id, func) {
    const buttonById = document.getElementById(id);

    buttonById.addEventListener('click', func);
}

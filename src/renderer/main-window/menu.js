import { remote } from 'electron';
import { openDirectory, saveFile, openPreferences, uploadImage, pasteImage } from './ipcRendererEvents';
import { print } from './images-ui';

function createMenu() {
    const template = [
        {
            label: 'Archivo',
            submenu: [
                {
                    label: 'Abrir ubicación',
                    click() { openDirectory() }
                },
                {
                    label: 'Guardar imagen',
                    click() { saveFile() }
                },
                {
                    label: 'Preferencias',
                    click() { openPreferences() }
                },
                {
                    label: 'Cerrar',
                    role: 'quit'
                }
            ]
        },
        {
            label: 'Edición',
            submenu: [
                {
                    label: 'Imprimir',
                    click() { print() }
                },
                {
                    label: 'Subir a CloudUp',
                    click() { uploadImage() }
                },
                {
                    label: 'Pegar imagen',
                    click() { pasteImage() }
                }
            ]
        }
    ];

    const menu = remote.Menu.buildFromTemplate(template);
    remote.menu.setApplicationMenu(menu);
}

module.exports = createMenu;

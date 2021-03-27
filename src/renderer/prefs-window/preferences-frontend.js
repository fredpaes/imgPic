import { remote, ipcRenderer } from 'electron';
import settings from 'electron-settings';
import crypto from 'crypto-js';

const token = 'SECRET_TOKEN';

window.addEventListener('load', async () => {
    cancelButton();
    saveButton();

    if (settings.has('cloudup')) {
        let password = await settings.get('cloudup.password');
        let decrypt = crypto.AES.decrypt(password, token);
        let decrypted = decrypt.toString(crypto.enc.Utf8);

        document.getElementById('cloudup-user').value = await settings.get('cloudup.user');
        document.getElementById('cloudup-password').value = decrypted;
    }
});

function cancelButton() {
    const cancelButton = document.getElementById('cancel-button');

    cancelButton.addEventListener('click', () => {
        const prefsWindow = remote.getCurrentWindow()
        prefsWindow.close();
    });
}

function saveButton() {
    const saveButton = document.getElementById('save-button');
    const prefsForm = document.getElementById('preferences-form');

    saveButton.addEventListener('click', async () => {
        if (prefsForm.reportValidity()) {
            let encrypted = crypto.AES.encrypt(document.getElementById('cloudup-password').value, token).toString();

            await settings.set('cloudup', {
                user: document.getElementById('cloudup-user').value,
                password: encrypted
            });

            const prefsWindow = remote.getCurrentWindow()
            prefsWindow.close();
        } else {
            ipcRenderer.send('show-dialog', {
                type: 'error',
                title: 'ImgPics',
                msg: 'Por favor complete los campos requeridos'
            });
        }
    });
}

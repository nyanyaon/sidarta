/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { createApp } from 'vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import App from './template/App.vue';
import BukuTanah from './template/index/BukuTanah.vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faFilePdf } from '@fortawesome/free-solid-svg-icons';

library.add(faUser, faFilePdf);

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: '/', component: App },
        { path: '/bukutanah', component: BukuTanah },
    ]
});

const app = createApp({});
app.component('Fa', FontAwesomeIcon);
app.use(router);
app.mount('#app');


interface PreloadComm {
    authSave: (username: string, password: string) => void;
    authStart: (headless: boolean) => void;
    folderSelect: () => void;
    botGetBukuTanahOption: () => void;
    authVerify: (otp: string) => void;
    authToken: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    authError: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    folderSelected: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    bukutanahWaitData: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    authSuccess: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
}

declare global {
    interface Window {
        COMM: PreloadComm;
    }

    interface HTMLElement {
        value: string;
        src: string;
    }

    interface Element {
        src: string;
    }

    interface EventTarget {
        value: string;
    }
}

// window.COMM.authWaitForToken((event, data) => {
//     document.getElementById('login').style.display = "none";
//     document.getElementById('otp').style.display = "flex";

//     document.getElementById('token').innerText = `Harap Periksa Email: ${data[0].to}`;
// });

// window.COMM.authError(() => {
//     document.getElementById('info').innerText = 'Username atau password salah!';
//     document.getElementById('info').style.display = 'block';
// });


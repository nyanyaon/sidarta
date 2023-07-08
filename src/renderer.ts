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
import SuratUkur from './template/index/SuratUkur.vue';
import ValidasiPersil from './template/index/ValidasiPersil.vue';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faFilePdf, faPowerOff, faDownload, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FileInterface } from './app/Fileman';

library.add(faUser, faFilePdf, faPowerOff, faDownload, faXmark);

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
        { path: '/', component: App },
        { path: '/bukutanah', component: BukuTanah },
        { path: '/suratukur', component: SuratUkur },
        { path: '/validasipersil', component: ValidasiPersil },
    ]
});

const app = createApp({});
app.component('Fa', FontAwesomeIcon);
app.use(router);
app.mount('#app');


interface PreloadComm {
    appCheckBrowser: () => boolean;
    authLogout: () => void;
    appOpenExternal: (url: string) => void;
    authSave: (username: string, password: string) => Promise<boolean>;
    authVerify: (otp: string, kantor: string) => Promise<boolean>;
    authStart: (headless: boolean) => void;
    folderSelect: (tipeDok: string) => void;
    fileSelect: () => void;
    databaseCheck: (col: string, nama: string) => Promise<boolean>;
    databaseGetAll: (col: string) => Promise<any[]>;
    botGetOption: () => void;
    botStartBukuTanah: (kecamatan: string, kecamatanId: string, desa: string, files: FileInterface[], loc: string) => void;
    botStartSuratUkur: (kecamatan: string, kecamatanId: string, desa: string, files: FileInterface[], loc: string) => void;
    botStartValidasiPersil: (user: string, pass: string, kabupatenId: string, kecamatanId: string, desaId: string, fileLoc: string) => void;
    authToken: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    authError: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    folderSelected: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    fileSelected: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    botValidasiStatus: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    appWaitDataOpt: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    authSuccess: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    authHideOTP: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    appUpdateDialog: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
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


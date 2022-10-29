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

import './index.css';
import { createApp } from 'vue';
import App from './template/App.vue';

const app = createApp(App)

app.mount('#app');


interface PreloadComm {
    authSave: (username: string, password: string) => void;
    authStart: (headless: boolean) => void;
    // authVerify: (otp: string) => void;
    // authWaitForToken: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
    authError: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
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
}

// window.COMM.authWaitForToken((event, data) => {
//     document.getElementById('login').style.display = "none";
//     document.getElementById('otp').style.display = "flex";

//     document.getElementById('token').innerText = `Harap Periksa Email: ${data[0].to}`;
// });

window.COMM.authError(() => {
    document.getElementById('info').innerText = 'Username atau password salah!';
    document.getElementById('info').style.display = 'block';
});

window.COMM.authSuccess((event, data) => {
    document.getElementById('login').style.display = "none";
    const loginSuccessSection = document.getElementById('login-success');
    const otpSection = document.getElementById('otp');


    loginSuccessSection.style.display = 'flex';
    otpSection.style.display = 'none';

    loginSuccessSection.innerText = data[0];
});


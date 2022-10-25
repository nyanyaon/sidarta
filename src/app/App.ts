import { app, BrowserWindow, ipcMain } from 'electron';
import { Auth } from './Auth';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export default class App {
    private static mainWindow: Electron.BrowserWindow;
    private static application: Electron.App = app;
    private static ipc: Electron.IpcMain = ipcMain;

    private static onClosed() {
        App.mainWindow = null;
    }
    
    static send(event: string, ...data: any[]) {
        App.mainWindow.webContents.send(event, data);
    }

    private static onReady() {
        // Create the browser window.
        App.mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
            webPreferences: {
                preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            },
        });

        // and load the index.html of the app.
        App.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        App.mainWindow.on('closed', App.onClosed);
        Auth.start();
    }

    static start() {
        App.application.on('window-all-closed', App.onWindowAllClosed);
        App.application.whenReady().then(() => {
            App.onReady();
        });
        
        App.ipc.handle('auth-save', async (event, ...args) => {await Auth.save(args[0], args[1])});
        App.ipc.handle('auth-start', () => {Auth.start()});
        App.ipc.handle('auth-verify', (event, ...data) => {Auth.verify(data[0])});
    }

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') App.application.quit();
        
    }

    static exit() {
        App.application.quit();
    }
}
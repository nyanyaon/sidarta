import { app, BrowserWindow } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class App {
    private mainWindow: Electron.BrowserWindow;
    private application: Electron.App;

    constructor() {
        this.application = app;
    }

    private onActivate() {
        if (BrowserWindow.getAllWindows().length === 0) {
            this.onReady();           
        }
    }

    private onReady() {
        // Create the browser window.
        this.mainWindow = new BrowserWindow({
            height: 600,
            width: 800,
            webPreferences: {
                preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            },
        });

        // and load the index.html of the app.
        this.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    }

    start() {
        this.application.on('window-all-closed', this.onWindowAllClosed);
        this.application.on('ready', this.onReady);
        this.application.on('activate', this.onActivate);
    }

    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            this.application.quit();
        }
    }

    exit() {
        this.application.quit();
    }
}
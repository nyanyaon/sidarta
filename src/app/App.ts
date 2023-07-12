import { session, BrowserWindow, ipcMain, dialog, Menu, shell, MenuItemConstructorOptions, autoUpdater, Notification, nativeImage } from 'electron';
import { AuthSSO } from './AuthSSO';
import * as fs from 'fs';
import { BukuTanahBot } from './BukuTanahBot';
import { Fileman } from './Fileman';
import { Database } from './db/Database';
import { UploadSuratUkurBot } from './UploadSuratUkurBot';
import { Browser } from 'puppeteer';
import { Bot } from './Bot';
import { ValidasiPersilBot } from './ValidasiPersilBot';
import { UpdatePersilBot } from './UpdatePersilBot';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export default class App {
    static mainWindow: Electron.BrowserWindow;
    public static application: Electron.App;
    static BrowserWindow: any;
    private static ipc: Electron.IpcMain = ipcMain;
    static bot: Browser;
    static sso: AuthSSO;
    static updateExecution: NodeJS.Timer;

    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') App.application.quit();
    }

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
            icon: '../logo.ico',
            webPreferences: {
                preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            },
        });

        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    'Content-Security-Policy': ['script-src \'self\' https://www.googletagmanager.com \'unsafe-inline\' \'unsafe-eval\'']
                }
            })
        });



        const template: MenuItemConstructorOptions[] = [
            // { role: 'fileMenu' }
            {
                label: 'Sistem',
                submenu: [
                    { role: 'quit', label: 'Keluar' },
                    { role: 'toggleDevTools' },
                ]
            },
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        // and load the index.html of the app.
        App.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
        App.mainWindow.on('closed', App.onClosed);
    }

    static start(app: Electron.App, browserWindow: typeof BrowserWindow) {
        App.BrowserWindow = browserWindow;
        App.application = app;
        App.application.on('window-all-closed', App.onWindowAllClosed);
        App.application.whenReady().then(() => {
            App.onReady();
        });

        if (App.application.isPackaged) {
            const server = 'https://update.electronjs.org';
            const feed = `${server}/nyanyaon/sidarta/${process.platform}-${process.arch}/${App.application.getVersion()}`;

            autoUpdater.setFeedURL({ url: feed });

            autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
                const dialogOpts = {
                    type: 'info',
                    buttons: ['Restart'],
                    title: 'Application Update',
                    message: process.platform === 'win32' ? releaseNotes : releaseName,
                    detail:
                        'A new version has been downloaded. Restart the application to apply the updates.'
                };

                dialog.showMessageBox(dialogOpts).then((returnValue) => {
                    if (returnValue.response === 0) autoUpdater.quitAndInstall();
                });
            });

            autoUpdater.on('update-available', () => {
                clearInterval(App.updateExecution);

                const notif = new Notification({
                    title: "Update Available",
                    body: "We will donwload it for you",
                    icon: nativeImage.createFromPath("../template/img/logo.png"),
                });
        
                notif.addListener("click", async ev => {
                    await shell.openExternal('https://nyanyaonn.my.id/');
                });
        
                notif.show();

                App.send('app:update', {
                    isUpdate: true,
                    msg: 'There\'s update!'
                });
            });

            autoUpdater.once('update-not-available', () => {
                App.send('app:update', {
                    isUpdate: true,
                    msg: 'Updated to last version'
                });
            });

            autoUpdater.on('error', (message) => {
                App.send('app:update', {
                    isUpdate: true,
                    msg: 'Update error',
                })
            });

            App.updateExecution = setInterval(() => {
                autoUpdater.checkForUpdates();
            }, 60 * 1000);
        }

        //COMM
        App.ipc.handle('app:checkBrowser', (event, ...args) => {
            try {
                const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"

                if (fs.existsSync(EDGE_PATH)) {
                    return true;
                }
            } catch (err) {
                console.log(err);
                return false;
            }
        });

        App.ipc.handle('auth:logout', async (event, ...args) => {
            console.log("Logout");
        });
        App.ipc.handle('app:openExternal', async (event, ...args) => { await shell.openExternal(args[0]) });
        App.ipc.handle('bot:getOption', async (event, ...args) => {
            const bot = new Bot();
            const upopt = await bot.getOptions();

            App.send('app:dataopt', upopt);
        });
        App.ipc.handle('bot:startBukuTanah', async (event, ...args) => {
            const bot = new BukuTanahBot();
            await bot.start(args[0], args[1], args[2], args[3], args[4]);
        });
        App.ipc.handle('bot:startUploadSuratUkur', async (event, ...args) => {
            const bot = new UploadSuratUkurBot();
            bot.start(args[0], args[1], args[2], args[3]);
        });
        App.ipc.handle('bot:startValidasiPersil', async (event, ...args) => {
            const bot = new ValidasiPersilBot();
            await bot.start(args[0], args[1], args[2], args[3], args[4], args[5]);
        });
        App.ipc.handle('bot:startUpdatePersil', async (event, ...args) => {
            const bot = new UpdatePersilBot();
            const user = args[0];
            const pass = args[1];
            const listtype = args[2];
            const kabupatenId = args[3];
            const kecamatanId = args[4];
            const desaId = args[5];
            const fileLoc = args[6];

            if(listtype == 'persilid') {
                bot.startPersilId(user, pass, fileLoc);
                return; 
            }
        });
        App.ipc.handle('folder:select', (event, ...args) => {
            dialog.showOpenDialog(App.mainWindow, {
                properties: ['openDirectory'],
            }).then(async (result) => {
                if (result.canceled) return;

                const files = new Fileman(fs.readdirSync(result.filePaths[0]), args[0]).extract();

                App.send('folder:selected', result.filePaths[0], files);
            }).catch(err => {
                console.log(err);
            });
        });

        App.ipc.handle('file:select', (event, ...args) => {
            dialog.showOpenDialog(App.mainWindow, {
                properties: ['openFile'],
                filters: [
                    { name: 'CSV', extensions: ['csv'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            }).then(async (result) => {
                if (result.canceled) return;

                console.log(result.filePaths);
                App.send('file:selected', result.filePaths[0]);
            }).catch(err => {
                console.log(err);
            });
        });

        App.ipc.handle('database:check', async (event, ...args) => {
            const db = new Database();
            await db.connect();

            const col = db.getCollection(args[0]);

            const data = await col.findOne({
                nama: args[1]
            });

            if (data !== null) return true;

            return false;
        });

        App.ipc.handle('database:getAll', async (event, ...args) => {
            const db = new Database();
            await db.connect();

            const col = db.getCollection(args[0]);

            const data = await col.find({}).toArray();

            return data;
        });

        App.ipc.handle('auth:save', async (event, ...args) => {
            App.sso = new AuthSSO();
            App.sso.save(args[0], args[1]);
        });
        App.ipc.handle('auth:start', (event, ...args) => { new AuthSSO().start(args[0]) });
        App.ipc.handle('auth:verify', (event, ...data) => {
            App.sso.verify(data[0], data[1]);
        });
    }

    private static getFiles(err: NodeJS.ErrnoException, files: string[]) {
        console.log(files)
    }
}
import { BrowserWindow, ipcMain, dialog, Menu, shell, MenuItemConstructorOptions } from 'electron';
import { AuthSSO } from './AuthSSO';
import * as fs from 'fs';
import { BukuTanahBot } from './BukuTanahBot';
import { FileInterface, Fileman } from './Fileman';
import { Database } from './db/Database';
import { SuratUkurBot } from './SuratUkurBot';
import { getEdgePath } from 'edge-paths'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export default class App {
    static mainWindow: Electron.BrowserWindow;
    public static application: Electron.App;
    static BrowserWindow: any;
    private static ipc: Electron.IpcMain = ipcMain;

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

        const template: MenuItemConstructorOptions[] = [
            // { role: 'fileMenu' }
            {
                label: 'Sistem',
                submenu: [
                    { role: 'quit', label: 'Keluar' },
                    { role: 'toggleDevTools' },
                ]
            },
            {
                role: 'help',
                label: 'Bantuan',
                submenu: [
                    {
                        label: 'Tentang',
                        click: async () => {
                            await shell.openExternal('https://github.com/nyanyaon');
                        }
                    },
                    {
                        label: 'Pelajari',
                        click: async () => {
                            await shell.openExternal('https://sidarta.nyanyaon.my.id');
                        }
                    },
                ]
            }
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

        //COMM
        App.ipc.handle('app:checkBrowser', (event, ...args) => {
            try {
                const EDGE_PATH: string = getEdgePath();

                if (fs.existsSync(EDGE_PATH)) {
                    return true;
                }
            } catch (err) {
                console.log(err);
                return false;
            }
        });

        App.ipc.handle('auth:logout', async (event, ...args) => {
            fs.unlink('./cookies.json', (err) =>{
                console.log(err);
            });
        });
        App.ipc.handle('app:openExternal', async (event, ...args) => { await shell.openExternal(args[0]) });
        App.ipc.handle('auth:save', async (event, ...args) => { await new AuthSSO().save(args[0], args[1]) });
        App.ipc.handle('auth:start', (event, ...args) => { new AuthSSO().start(args[0]) });
        App.ipc.handle('bot:getOption', async (event, ...args) => {
            const bot = new BukuTanahBot();
            const upopt = await bot.getOptions();

            App.send('app:dataopt', upopt);
        });
        App.ipc.handle('bot:startBukuTanah', async (event, ...args) => {
            const bot = new BukuTanahBot();
            await bot.start(args[0], args[1], args[2], args[3], args[4]);
        });
        App.ipc.handle('bot:startSuratUkur', async (event, ...args) => {
            const bot = new SuratUkurBot();
            await bot.start(args[0], args[1], args[2], args[3], args[4]);
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

        App.ipc.handle('auth:verify', (event, ...data) => { new AuthSSO().verify(data[0], data[1]) });
    }

    private static getFiles(err: NodeJS.ErrnoException, files: string[]) {
        console.log(files)
    }
}
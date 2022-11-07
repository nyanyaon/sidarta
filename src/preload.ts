// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { FileInterface } from './app/Fileman';

contextBridge.exposeInMainWorld('COMM', {
    authSave: (username: string, password: string) => ipcRenderer.invoke('auth:save', username, password),
    authVerify: (otp: string) => ipcRenderer.invoke('auth:verify', otp),
    authStart: (headless: boolean) => ipcRenderer.invoke('auth:start', headless),
    folderSelectBT: () => ipcRenderer.invoke('folder:selectBT'),
    databaseCheck: (col: string, nama: string) => ipcRenderer.invoke('database:check', col, nama),
    databaseGetAll: (col: string) => ipcRenderer.invoke('database:getAll', col),
    botGetOption: () => ipcRenderer.invoke('bot:getOption'),
    botStartBukuTanah: (kecamatan: string, desa: string, files: FileInterface[], loc: string) => ipcRenderer.invoke('bot:startBukuTanah', kecamatan, desa, files, loc),
    authError: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth-error', callback),
    authSuccess: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth:success', callback),
    folderSelected: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('folder:selected', callback),
    appWaitDataOpt: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('app:dataopt', callback),
    authToken: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth:token', callback),
});
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import type { FileInterface } from './app/Fileman';

contextBridge.exposeInMainWorld('COMM', {
    appOpenExternal: (url: string) => ipcRenderer.invoke('app:openExternal', url),
    appCheckBrowser: () => ipcRenderer.invoke('app:checkBrowser'),
    authLogout: () => ipcRenderer.invoke('auth:logout'),
    authSave: (username: string, password: string) => ipcRenderer.invoke('auth:save', username, password),
    authVerify: (otp: string, kantor: string) => ipcRenderer.invoke('auth:verify', otp, kantor),
    authStart: (headless: boolean) => ipcRenderer.invoke('auth:start', headless),
    databaseCheck: (col: string, nama: string) => ipcRenderer.invoke('database:check', col, nama),
    databaseGetAll: (col: string) => ipcRenderer.invoke('database:getAll', col),
    botGetOption: () => ipcRenderer.invoke('bot:getOption'),
    botStartBukuTanah: (kecamatan: string, kecamatanId: string, desa: string, files: FileInterface[], loc: string) => ipcRenderer.invoke('bot:startBukuTanah', kecamatan, kecamatanId, desa, files, loc),
    botStartUploadSuratUkur: (user: string, pass: string, files: FileInterface[], loc: string) => ipcRenderer.invoke('bot:startUploadSuratUkur', user, pass, files, loc),
    botStartValidasiPersil: (user: string, pass: string, kabupatenId: string, kecamatanId: string, desaId: string, fileLoc: string) => ipcRenderer.invoke('bot:startValidasiPersil', user, pass, kabupatenId, kecamatanId, desaId, fileLoc),
    botStartUpdatePersil: (user: string, pass: string, listtype: string, kabupatenId: string, kecamatanId: string, desaId: string, fileLoc: string) => ipcRenderer.invoke('bot:startUpdatePersil', user, pass, listtype, kabupatenId, kecamatanId, desaId, fileLoc),
    authError: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth-error', callback),
    authSuccess: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth:success', callback),
    folderSelect: (tipeDok: string) => ipcRenderer.invoke('folder:select', tipeDok),
    fileSelect: () => ipcRenderer.invoke('file:select'),
    folderSelected: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('folder:selected', callback),
    fileSelected: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('file:selected', callback),
    botStatusHandler: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('bot:statushandler', callback),
    appWaitDataOpt: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('app:dataopt', callback),
    authToken: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth:token', callback),
    authHideOTP: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth:hideOTP', callback),
    appUpdateDialog: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('app:updateDialog', callback),
});
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('COMM', {
    authSave: (username: string, password: string) => ipcRenderer.invoke('auth:save', username, password),
    authVerify: (otp: string) => ipcRenderer.invoke('auth:verify', otp),
    authStart: (headless: boolean) => ipcRenderer.invoke('auth:start', headless),
    folderSelect: () => ipcRenderer.invoke('folder:select'),
    botGetBukuTanahOption: () => ipcRenderer.invoke('bot:getbukutanahoption'),
    botStartBukuTanah: (kecamatan: string, desa: string) => ipcRenderer.invoke('bot:startBukuTanah', kecamatan, desa),
    authError: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth-error', callback),
    authSuccess: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth:success', callback),
    folderSelected: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('folder:selected', callback),
    bukutanahWaitData: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('bukutanah:dataopt', callback),
    authToken: (callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => ipcRenderer.on('auth:token', callback),
});
import { app, BrowserWindow } from 'electron';
import App from "./app/App";


// Handle creating/removing shortcuts on Windows when installing/uninstalling.

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

App.start(app, BrowserWindow);
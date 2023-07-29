import { app, BrowserWindow} from 'electron';
import App from "./app/App";

process.env.GOOGLE_API_KEY = 'AIzaSyAuwWs0PK3xt9qr6KXuyjMuVZeo959dONE'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

App.start(app, BrowserWindow);
import { App } from "./app/App";

const app = new App();
// Handle creating/removing shortcuts on Windows when installing/uninstalling.

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.exit();
}

app.start();
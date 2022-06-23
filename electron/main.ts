import { BrowserWindow, app, dialog, ipcMain } from "electron";
import { join } from "path";
import { Auth, refresh } from "../src";

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.webContents.openDevTools();
  mainWindow.loadFile("index.html");
  return mainWindow;
};

// Open the DevTools.
// mainWindow.webContents.openDevTools()
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const window = createWindow();
  const authenticate = async () => {
    const auth = await Auth();
    console.log(auth);
    const refreshData = await refresh(auth);
    console.log("refresh", refreshData);

    dialog.showMessageBox({
      message: `
      Logged as: ${auth.name}
    `,
    });
  };
  authenticate();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

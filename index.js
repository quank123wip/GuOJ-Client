// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, shell} = require('electron')
const path = require('path')
const contextMenu = require('electron-context-menu');

contextMenu({
	prepend: (defaultActions, params, browserWindow) => [
		{
			label: 'Search Baidu for “{selection}”',
			// Only show it when right-clicking text
			visible: params.selectionText.trim().length > 0,
			click: () => {
				shell.openExternal(`https://baidu.com/s?ie=UTF-8&wd=${encodeURIComponent(params.selectionText)}`);
			}
		}
	]
});
function createWindow() {
  // Create the browser window.
  Menu.setApplicationMenu(null)
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL('https://uoj.ac')


  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    event.preventDefault();
    shell.openExternal(item.getURL());
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


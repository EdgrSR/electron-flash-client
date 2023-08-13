const { app, BrowserWindow, BrowserView, ipcMain } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) app.quit();

const flash = {
    win32: 'pepflashplayer.dll',
    darwin: 'PepperFlashPlayer.plugin',
    linux: 'libpepflashplayer.so',
};

if (app.isPackaged) {
    app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, '..', '..', 'app.asar.unpacked/lib/flash/' + flash[process.platform]));
} else {
    app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, '..', 'lib/flash/' + flash[process.platform]));
}
app.commandLine.appendSwitch('ignore-certificate-errors');

const icon = {
    win32: '.ico',
    darwin: '.icns',
    linux: '.png',
};

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        backgroundColor: '#212529',
        width: 800,
        height: 600,
        minWidth: 350,
        minHeight: 200,
        icon: path.join(__dirname, '..', 'lib/icon/app' + icon[process.platform]),
        autoHideMenuBar: true,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    const view = new BrowserView({
        backgroundColor: '#212529',
        webPreferences: {
            plugins: true,
            contextIsolation: true,
        },
    });

    mainWindow.setBrowserView(view);

    view.setBounds({ x: 0, y: 71, width: 800, height: 529 });
    view.setAutoResize({ width: true, height: true, horizontal: true, vertical: false });

    view.webContents.on('new-window', (event) => {
        event.preventDefault();
    });

    view.webContents.on('did-navigate', (event, url) => {
        mainWindow.webContents.executeJavaScript(`document.getElementById('url-input').value = '${url}';`);
    });

    ipcMain.on('load', (event, arg) => {
        view.webContents.loadURL(arg);
    });

    ipcMain.on('forward', () => {
        if (view.webContents.canGoForward()) view.webContents.goForward();
    });

    ipcMain.on('back', () => {
        if (view.webContents.canGoBack()) view.webContents.goBack();
    });

    ipcMain.on('reload', () => {
        view.webContents.reload();
    });

    ipcMain.on('minimize', () => {
        mainWindow.isMinimized() ? mainWindow.restore() : mainWindow.minimize();
    });

    ipcMain.on('maximize', () => {
        mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
    });

    ipcMain.on('quit', () => {
        app.quit();
    });
}

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
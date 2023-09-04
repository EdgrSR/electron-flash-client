delete require('electron').nativeImage.createThumbnailFromPath;

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

ipcMain.on('load', (event, url) => {
    BrowserWindow.getFocusedWindow().getBrowserView().webContents.loadURL(url);
});

ipcMain.on('forward', () => {
    if (BrowserWindow.getFocusedWindow().getBrowserView().webContents.canGoForward()) BrowserWindow.getFocusedWindow().getBrowserView().webContents.goForward();
});

ipcMain.on('back', () => {
    if (BrowserWindow.getFocusedWindow().getBrowserView().webContents.canGoBack()) BrowserWindow.getFocusedWindow().getBrowserView().webContents.goBack();
});

ipcMain.on('reload', () => {
    BrowserWindow.getFocusedWindow().getBrowserView().webContents.reload();
});

ipcMain.on('minimize', () => {
    BrowserWindow.getFocusedWindow().isMinimized() ? BrowserWindow.getFocusedWindow().restore() : BrowserWindow.getFocusedWindow().minimize();
});

ipcMain.on('maximize', () => {
    BrowserWindow.getFocusedWindow().isMaximized() ? BrowserWindow.getFocusedWindow().restore() : BrowserWindow.getFocusedWindow().maximize();
});

ipcMain.on('close', () => {
    BrowserWindow.getFocusedWindow().close();
});

const icon = {
    win32: '.ico',
    darwin: '.icns',
    linux: '.png',
};

const createWindow = (url) => {
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

    view.setBounds({ x: 0, y: 71, width: mainWindow.getBounds().width, height: mainWindow.getBounds().height - 71 });

    mainWindow.on('resize', () => {
        view.setBounds({ x: 0, y: 71, width: mainWindow.getBounds().width, height: mainWindow.getBounds().height - 71 });
    });

    mainWindow.on('maximize', () => {
        view.setBounds({ x: 0, y: 71, width: mainWindow.getBounds().width - 16, height: mainWindow.getBounds().height - 87 });
    });

    view.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        createWindow(url);
    });

    view.webContents.on('did-navigate', (event, url) => {
        mainWindow.webContents.executeJavaScript(`document.getElementById('url-input').value = '${url}';`);
    });

    if (url) {
        view.webContents.loadURL(url);
    }
}

app.on('ready', () => {
    createWindow();
});

app.on('web-contents-created', (e, webContents) => {
    webContents.on('will-redirect', (e, url) => {
        if (/^file:/.test(url)) e.preventDefault();
    });

    webContents.on('select-bluetooth-device', (event, devices, callback) => {
        event.preventDefault();
        callback('');
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
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

let windows = [];

ipcMain.on('load', (event, url) => {
    windows.forEach(window => {
        if (window.mainWindow.isFocused()){
            window.view.webContents.loadURL(url);
        }
    });
});

ipcMain.on('forward', () => {
    windows.forEach(window => {
        if (window.mainWindow.isFocused()){
            if (window.view.webContents.canGoForward()) window.view.webContents.goForward();
        }
    });
});

ipcMain.on('back', () => {
    windows.forEach(window => {
        if (window.mainWindow.isFocused()){
            if (window.view.webContents.canGoBack()) window.view.webContents.goBack();
        }
    });
});

ipcMain.on('reload', () => {
    windows.forEach(window => {
        if (window.mainWindow.isFocused()){
            window.view.webContents.reload();
        }
    });
});

ipcMain.on('minimize', () => {
    windows.forEach(window => {
        if (window.mainWindow.isFocused()){
            window.mainWindow.isMinimized() ? window.mainWindow.restore() : window.mainWindow.minimize();
        }
    });
});

ipcMain.on('maximize', () => {
    windows.forEach(window => {
        if (window.mainWindow.isFocused()){
            window.mainWindow.isMaximized() ? window.mainWindow.restore() : window.mainWindow.maximize();
        }
    });
});

ipcMain.on('close', () => {
    windows.forEach(window => {
        if (window.mainWindow.isFocused()){
            window.mainWindow.close();
            windows.splice(windows.indexOf(window), 1);
        }
    });
});

const icon = {
    win32: '.ico',
    darwin: '.icns',
    linux: '.png',
};

class Window {
    constructor(url) {
        this.mainWindow = new BrowserWindow({
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

        this.mainWindow.loadFile(path.join(__dirname, 'index.html'));

        this.view = new BrowserView({
            backgroundColor: '#212529',
            webPreferences: {
                plugins: true,
                contextIsolation: true,
            },
        });

        this.mainWindow.setBrowserView(this.view);

        this.view.setBounds({ x: 0, y: 71, width: this.mainWindow.getBounds().width, height: this.mainWindow.getBounds().height - 71 });

        this.mainWindow.on('resize', () => {
            this.view.setBounds({ x: 0, y: 71, width: this.mainWindow.getBounds().width, height: this.mainWindow.getBounds().height - 71 });
        });

        this.mainWindow.on('maximize', () => {
            this.view.setBounds({ x: 0, y: 71, width: this.mainWindow.getBounds().width - 16, height: this.mainWindow.getBounds().height - 87 });
        });

        this.view.webContents.on('new-window', (event, url) => {
            event.preventDefault();
            windows.push(new Window(url));
        });

        this.view.webContents.on('did-navigate', (event, url) => {
            this.mainWindow.webContents.executeJavaScript(`document.getElementById('url-input').value = '${url}';`);
        });

        if (url) {
            this.view.webContents.loadURL(url);
        }
    }
}

app.on('ready', () => {
    windows.push(new Window());
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
    if (BrowserWindow.getAllWindows().length === 0) new Window();
});
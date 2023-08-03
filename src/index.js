const { app, BrowserWindow } = require('electron');
const path = require('path');

if (require('electron-squirrel-startup')) {
    app.quit();
}

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
        width: 800,
        height: 600,
        icon: path.join(__dirname, '..', 'lib/icon/icon' + icon[process.platform]),
        autoHideMenuBar: true,
        webPreferences: {
            plugins: true,
            contextIsolation: true
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
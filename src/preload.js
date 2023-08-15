const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('action', {
    load: (url) => {
        ipcRenderer.send('load', url);
    },
    forward: () => {
        ipcRenderer.send('forward');
    },
    back: () => {
        ipcRenderer.send('back');
    },
    reload: () => {
        ipcRenderer.send('reload');
    },
    minimize: () => {
        ipcRenderer.send('minimize');
    },
    maximize: () => {
        ipcRenderer.send('maximize');
    },
    close: () => {
        ipcRenderer.send('close');
    },
});
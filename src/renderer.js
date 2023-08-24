const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const forwardButton = document.getElementById('forward');
const backButton = document.getElementById('back');
const reloadButton = document.getElementById('reload');
const minimizeButton = document.getElementById('minimize');
const maximizeButton = document.getElementById('maximize');
const closeButton = document.getElementById('close');

urlInput.addEventListener("dragstart", function(event) {
    event.preventDefault();
});

urlForm.addEventListener('submit', (event) => {
    event.preventDefault();
    urlInput.blur();
    let url = urlInput.value.trim();
    if (url !== '') {
        if (!url.includes('://')) url = 'https://' + url;
        window.action.load(url);
    }
});

forwardButton.addEventListener('click', () => {
    window.action.forward();
});

backButton.addEventListener('click', () => {
    window.action.back();
});

reloadButton.addEventListener('click', () => {
    window.action.reload();
});

minimizeButton.addEventListener('click', () => {
    window.action.minimize();
});

maximizeButton.addEventListener('click', () => {
    window.action.maximize();
});

closeButton.addEventListener('click', () => {
    window.action.close();
});
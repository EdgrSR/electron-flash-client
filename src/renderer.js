const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const forwardButton = document.getElementById('forward');
const backButton = document.getElementById('back');
const reloadButton = document.getElementById('reload');
const minimizeButton = document.getElementById('minimize');
const maximizeButton = document.getElementById('maximize');
const closeButton = document.getElementById('close');

urlForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const url = urlInput.value.trim();
    if (url !== '' && urlInput.checkValidity()) window.action.load(url);
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
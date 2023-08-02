const loadWebsite = (event) => {
    event.preventDefault();
    const inputElement = document.getElementById('urlinput');
    const websiteUrl = inputElement.value.trim();
    if (websiteUrl !== '' && inputElement.checkValidity()) {
        window.location.href = websiteUrl;
    }
}
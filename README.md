<p align="center">
  <img alt="electron-flash-client" width="200px" src="src/assets/img/icon.webp">
</p>

# Electron Flash Client

A simple tool to access websites with Flash Player content

<img alt="screenshot" width="600px" src="screenshot-1.png">

## Installation

Download the installer from the [latest release](../../releases/latest) and run it. It will be installed at ***AppData/Local*** with a desktop shortcut

## Packaging

Install ***NodeJS***, clone the project, test it and package using ***Electron Forge***

***NOTE***: You should install and configure the maker that fits your needs, the only requirement is to have ***lib/flash*** unpacked from ***asar***

```shell
$ npm i
$ npm start
$ npm run make
```

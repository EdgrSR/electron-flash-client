module.exports = {
  packagerConfig: {
    executableName: "Electron Flash Client",
    icon: "lib/icon/app",
    electronVersion: "11.0.0",
    asar: {
      unpackDir: "lib/flash",
    },
    ignore: [
      "lib/flash/libpepflashplayer.so",
      "lib/flash/PepperFlashPlayer.plugin",
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: "lib/icon/app.ico"
      },
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};

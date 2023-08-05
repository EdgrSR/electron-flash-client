module.exports = {
  packagerConfig: {
    executableName: "Electron Flash Client",
    icon: "lib/icon/icon",
    electronVersion: "11.0.0",
    asar: {
      unpackDir: "lib/flash",
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: "lib/icon/icon.ico"
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

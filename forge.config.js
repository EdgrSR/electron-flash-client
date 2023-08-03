module.exports = {
  packagerConfig: {
    executableName: "Electron Flash Client",
    icon: "lib/icon/icon",
    asar: {
      unpackDir: "lib/flash",
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};

const {
  installNodeHeaders,
  rebuildNativeModules,
  shouldRebuildNativeModules } = require('electron-rebuild');
const pathToElectron = require('electron');
const childProcess = require('child_process');

console.log('Rebuilding native modules...');

shouldRebuildNativeModules(pathToElectron)
  .then(shouldRebuild => {
    if(!shouldRebuild) {
      console.log('Native modules ready.');
      return;
    }

    const electronVersion = childProcess.execSync(`${pathToElectron} --version`, {
      encoding: 'utf8',
    }).match(/v(\d+\.\d+\.\d+)/)[1];

    return void installNodeHeaders(electronVersion, 'https://atom.io/download/atom-shell')
      .then(() => rebuildNativeModules(electronVersion,
                                       `${__dirname}/../node_modules`,
                                       '--build-from-source'));
  })
  .then(() => {
    console.log('Rebuilding finished.');
  })
  .catch(e => {
    console.error('Rebuilding failed:');
    console.error(e.stack);
  });

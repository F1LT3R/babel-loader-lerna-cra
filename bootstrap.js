#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');

const webpackReplacementPath = path.join(__dirname, 'webpack.config.replacement.js');

const strap = 'babel-lerna-loader-cra:';

const log = (msg, data) => {
    console.log(strap, msg, data || '');
}

log('bootstraping...');

const config = require(path.join(__dirname, 'loadConfig'))();

log('config =', config);

const webpackConfigPath = (dir, type) => {
    return path.join(dir, `node_modules/react-scripts/config/webpack.config.${type}.js`);
}

const webpackBackupPath = (dir, type) => {
    return path.join(dir, `node_modules/react-scripts/config/backup.webpack.config.${type}.js`);
}

const prettyAppPath = uglyPath => 
    path.parse(path.relative(config.lernaRoot, uglyPath)).dir
    .replace(/^packages\//, '')
    .replace(/\/node_modules\/react-scripts\/config/, '');

const prettyFile = uglyPath => path.parse(uglyPath).base;

const linkOverride = (reactAppDir, type) => {
    const configFile = webpackConfigPath(reactAppDir, type);
    const configBackup = webpackBackupPath(reactAppDir, type);
    
    if (fs.existsSync(configBackup)) {
        // Backup already exists, copy cancelled.
    } else {
        log(`copying: ${prettyAppPath(configFile)}/... ${prettyFile(configFile)} => ${prettyFile(configBackup)}`);
        fs.copySync(configFile, configBackup, {overwrite: false});
    }

    log(`copying: ${prettyAppPath(configFile)}/... ${prettyFile(webpackReplacementPath)} => ${prettyFile(configFile)}`);

    if (fs.existsSync(configFile)) {
        try {
            fs.removeSync(configFile);
        } catch (error) {
            throw new Error('The symlink could not be removed!');
        }
    }

    fs.copySync(webpackReplacementPath, configFile, {overwrite: true});

    console.log();
}

config.apps.forEach(reactAppDir => {
    linkOverride(reactAppDir, 'dev');
    linkOverride(reactAppDir, 'prod');
});

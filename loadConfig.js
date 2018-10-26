const path = require('path');
const glob = require('glob');

module.exports = () => {
    const lernaRoot = require(path.join(__dirname, 'getLernaRoot'))();
    const lernaPackageJson = require(path.join(lernaRoot, 'package.json'));
    
    const settings = lernaPackageJson['babel-loader-lerna-cra'];
    const appsGlob = path.join(lernaRoot, settings.apps);
    const importsGlob = path.join(lernaRoot, settings.imports);
    
    const config = {
        lernaRoot,
        settings,
        apps: glob.sync(appsGlob),
        imports: glob.sync(importsGlob),
    };

    return config;
};

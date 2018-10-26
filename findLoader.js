module.exports = (webpackConfig, reactAppSrcDir) => {
    let loaderToOverride;

    webpackConfig.module.rules.forEach(rule => {
        if (!Reflect.has(rule, 'oneOf')) {
            return false;
        }

        rule.oneOf.forEach(loader => {
            if (!Reflect.has(loader, 'test')) {
                return false;
            }

            if (!loader.test.toString().includes('(js|mjs|jsx)')) {
                return false;
            }

            if (loader.include !== reactAppSrcDir) {
                return false;
            }

            if (!loader.loader.includes('node_modules/babel-loader')) {
                return false;
            }

            loaderToOverride = loader;
        });
    });

    return loaderToOverride;
};

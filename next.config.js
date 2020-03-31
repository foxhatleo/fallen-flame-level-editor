const path = require("path");

module.exports = {
    webpack: (config, {buildId, dev, isServer, defaultLoaders}) => {
        config["resolve"]["modules"].push(path.resolve(__dirname));
        return config;
    },
    target: "serverless",
    useFileSystemPublicRoutes: true,
};

const webpack = require('webpack');

module.exports = {
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
        };
        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
            })
        );
        return config;
    },
};

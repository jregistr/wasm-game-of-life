const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

const dist = path.resolve(__dirname, "dist");

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'bundle.js',
        path: dist,
    },
    devServer: {
        contentBase: dist,
        port: 8080
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: "index.html", to: "index.html"},
                {from: "bootstrap.js", to: "bootstrap.js"}
            ]
        })
    ]
};

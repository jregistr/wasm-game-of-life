const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

const dist = path.resolve(__dirname, "dist");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");
const wasmRustDir = path.resolve(__dirname, "wasm-rust");

module.exports = {
    entry: './bootstrap.js',
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
            ]
        }),
        new WasmPackPlugin({
            crateDirectory: wasmRustDir,
            args: "--log-level warn",
            outDir: path.join(wasmRustDir, "pkg"),
            extraArgs: ""
        })
    ]
};

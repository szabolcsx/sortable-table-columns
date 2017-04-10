var isDevBuild = process.argv.indexOf('--env.prod') < 0;
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require("autoprefixer")({ browsers: ["last 3 versions", "> 1%"] });
var bundleOutputDir = './dist';
module.exports = {
    devtool: isDevBuild ? 'inline-source-map' : false,
    entry: { 'main': './App/boot.tsx' },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    output: {
        path: path.join(__dirname, bundleOutputDir),
        filename: 'ssd.min.js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: /App/,
                loader: 'babel-loader'
            },
            {
                test: /\.js(x?)$/,
                include: /App/,
                loader: 'babel-loader'
            },
            {
                test: /\.tsx?$/,
                include: /App/,
                loader: 'ts-loader', options: { silent: true }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: () => [autoprefixer]
                            }
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                loader: 'url-loader', options: { limit: 25000 }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                plugins: () => [autoprefixer]
                            }
                        },
                        "sass-loader"
                    ]
                })
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "file-loader"
            }
        ]
    },
    plugins: isDevBuild ? [
        new ExtractTextPlugin({
            filename: "ssd.bundle.css",
            disable: false,
            allChunks: true
        })
    ] : [
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                sourcemap: false,
                minimize: true
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                }
            }),
            new ExtractTextPlugin({
                filename: "ssd.bundle.css",
                disable: false,
                allChunks: true
            })
        ],
};
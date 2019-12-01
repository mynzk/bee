const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },

                    {
                        loader: 'css-loader',
                        options: {
                            modules: true, // 开启了CSS Module功能，避免类名冲突问题
                            localIdentName: '[name]-[local]',
                        },
                    },

                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins() {
                                return [autoprefixer];
                            },
                        },
                    },

                    {
                        loader: 'sass-loader',
                    },
                ],
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
        alias: {
            '@components': path.resolve(__dirname, 'src/components'),
            '@styles': path.resolve(__dirname, 'src/styles'),
        },
    },
    output: {
        path: path.resolve(__dirname, '/dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({ template: path.join(__dirname, './src/index.html') }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        host: '127.0.0.1',  // 我们可以允许我们用任意方式进行访问（127.0.0.1，localhost, 本机ip）
        port: '8888',
        contentBase: './dist',
        hot: true,
        open: true
    }
};

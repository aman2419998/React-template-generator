const path = require( 'path' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const BUILD_DIR_PATH = path.resolve( __dirname, 'dist' );
const EXPRESSIONS = {
    JSX: /\.jsx?$/,
    CSS: /\.css$/i,
    SCSS: /\.s[ac]ss$/i
}

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[contenthash].js',
        path: BUILD_DIR_PATH,
        publicPath: '/'
    },
    mode: process.env.NODE_ENV,
    devServer: {
        static: BUILD_DIR_PATH,
        historyApiFallback: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            }
        }
    },
    module: {
        rules: [
            {
                test: EXPRESSIONS.JSX,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [ '@babel/preset-env', '@babel/preset-react' ],
                        plugins: [ [ '@babel/plugin-transform-runtime' ] ]
                    }
                }
            },
            {
                test: EXPRESSIONS.CSS,
                use: [ MiniCssExtractPlugin.loader, "css-loader" ],
            },
            {
                test: EXPRESSIONS.SCSS,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin( {
            template: './public/index.html'
        } ),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin()
    ],
    devtool: 'source-map'
}
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    config.minimizer = [
        new CSSMinimizerPlugin(),
        new TerserPlugin(),
    ]
};

const cssLoaders = (extra) => {
    const loaders = [{
        loader: MiniCSSExtractPlugin.loader,
        options: {}
    },
        'css-loader'];

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
};

const babelOptions = preset => {
    const options = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    };

    if (preset) {
        options.presets.push(preset);
    }

    return options;
}

const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }];

    return loaders;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './pages/main/index.js'],
        quiz: ['@babel/polyfill', './pages/quiz/quiz.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            images: path.resolve(__dirname, 'src/assets/images/'),
        },
    },
    optimization: optimization(),
    devServer: {
        static: {
            directory: path.resolve(__dirname, './dist'),
        },
        compress: true,
        port: 8080,
        open: true
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './pages/main/index.html',
            filename: 'index.html',
            chunks: ['main'],
        }),
        new HTMLWebpackPlugin({
            template: './pages/quiz/quiz.html',
            filename: 'quiz.html',
            chunks: ['quiz'],
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, './src/assets/images/rs_school_js.svg'),
                to: path.resolve(__dirname, 'dist/rs_school_js.svg')
            }]
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, './src/assets/audio/error.mp3'),
                to: path.resolve(__dirname, 'dist/error.mp3')
            }]
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, './src/assets/audio/win.mp3'),
                to: path.resolve(__dirname, 'dist/win.mp3')
            }]
        }),
        new MiniCSSExtractPlugin({
            filename: '[name].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders(),
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                type: 'asset/resource',
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: jsLoaders(),
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader'
            }
        ]
    }
}
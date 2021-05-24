const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPartialsPlugin = require('html-webpack-partials-plugin')
const autoprefixer = require('autoprefixer');





const deleteExpansion = (str) => {
    const idx = str.indexOf('.')
    return str.slice(0, idx)
}

const getFileName = (expans, path) => {
    const arr = []
    fs.readdirSync(path).forEach(folder => {
        const file = fs.readdirSync(`${path}/${folder}`).filter(file => file.includes(expans))
        arr.push(deleteExpansion(...file))
    })
    return arr
}

const getHtmlTemplates = () => {
    const templateFileNames = getFileName('.html', './src/templates')
    const plugins = templateFileNames.map(fileName => {
        return new HtmlWebpackPartialsPlugin({
            path: path.join(__dirname, `./src/templates/${fileName}/${fileName}.html`),
            location: fileName,
            template_filename: '*',
        })
    })
    return plugins
}

const getHtmlWebpackPlugin = () => {
    const htmlFileNames = getFileName('.html', './src/pages')
    const plugins = htmlFileNames.map(fileName => {
        return new HTMLWebpackPlugin({
            template: `./pages/${fileName}/${fileName}.html`,
            filename: `pages/${fileName}/${fileName}.html`,
            minify: {
                removeComments: isProd,
                collapseWhitespace: isProd
            },
            chunks: [ 'global', fileName ],
            chunksSortMode: 'manual',
        })
    })
    return plugins
}

const getEntryObj = () => {
    const obj = {}
    const jsFileNames = getFileName('.js', './src/pages')
    jsFileNames.forEach(file => {
        obj[file] = ['@babel/polyfill', `./pages/${file}/${file}.js`]
    })
    obj.global = ['@babel/polyfill', './js/index.js']
    return obj
}




const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.[hash].${ext}` : `bundle.${ext}`

const jsLoaders = () => {
    const loaders = [
        {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-class-properties']
            }
        }
    ]
    if (isDev) {
        //loaders.push('eslint-loader')
    }
    return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: getEntryObj(),
    output: {
        filename: 'pages/[name]/[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
    devtool: isDev ? 'source-map' : false,
    devServer: {
        port: 3000,
        hot: isDev
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            title: 'Webpack 4 Starter',
            template: './index.html',
            inject: true,
            minify: {
              removeComments: true,
              collapseWhitespace: false,
            },
            chunks: []
          }),
        ...getHtmlWebpackPlugin(),
        ...getHtmlTemplates(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/assets'),
                    to: path.resolve(__dirname, 'dist/assets')
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: `./pages/[name]/[name].css`,
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            reloadAll: true
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                        }
                    },
                    {
                        loader: `postcss-loader`,
                        options: {
                            plugins: () => [require('autoprefixer')]
                          }
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            }
        ],
    }
}

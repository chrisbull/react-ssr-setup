import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import getCSSModuleLocalIdent from 'react-dev-utils/getCSSModuleLocalIdent';
const generateSourceMap = process.env.OMIT_SOURCEMAP === 'true' ? false : true;

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// temporary wrapper function around getCSSModuleLocalIdent until this issue is resolved:
// https://github.com/webpack-contrib/css-loader/pull/965
const getLocalIdentWorkaround = (
    context: any,
    localIdentName: any,
    localName: any,
    options: any
) => {
    if (options && options.context === null) {
        options.context = undefined;
    }
    return getCSSModuleLocalIdent(context, localIdentName, localName, options);
};

const babelLoader = {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    loader: require.resolve('babel-loader'),
    options: {
        plugins: [
            [
                require.resolve('babel-plugin-named-asset-import'),
                {
                    loaderMap: {
                        svg: {
                            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
                        },
                    },
                },
            ],
        ],
        cacheDirectory: true,
        cacheCompression: process.env.NODE_ENV === 'production',
        compact: process.env.NODE_ENV === 'production',
    },
};

const cssModuleLoaderClient = {
    test: cssModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        {
            loader: require.resolve('css-loader'),
            options: {
                localsConvention: 'camelCase',
                modules: {
                    // getLocalIdent: getCSSModuleLocalIdent,
                    getLocalIdent: getLocalIdentWorkaround,
                },
                importLoaders: 1,
                sourceMap: generateSourceMap,
                // localIdentName: '[name]__[local]--[hash:base64:5]',
                // getLocalIdent: getCSSModuleLocalIdent,
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
    ],
};

const cssLoaderClient = {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        require.resolve('css-loader'),
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
    ],
};

const cssModuleLoaderServer = {
    test: cssModuleRegex,
    use: [
        {
            loader: require.resolve('css-loader'),
            options: {
                onlyLocals: true,
                localsConvention: 'camelCase',
                importLoaders: 1,
                modules: {
                    // getLocalIdent: getCSSModuleLocalIdent,
                    getLocalIdent: getLocalIdentWorkaround,
                },
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
    ],
};

const cssLoaderServer = {
    test: cssRegex,
    exclude: cssModuleRegex,
    use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
};

const sassModuleLoaderClient = {
    test: sassModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        {
            loader: require.resolve('css-loader'),
            options: {
                localsConvention: 'camelCase',
                modules: {
                    // getLocalIdent: getCSSModuleLocalIdent,
                    getLocalIdent: getLocalIdentWorkaround,
                },
                importLoaders: 3,
                sourceMap: generateSourceMap,
                // localIdentName: '[name]__[local]--[hash:base64:5]',
                // getLocalIdent: getCSSModuleLocalIdent,
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        {
            loader: require.resolve('resolve-url-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        {
            loader: require.resolve('sass-loader'),
            options: {
                sourceMap: true,
            },
        },
    ],
};

const sassLoaderClient = {
    test: sassRegex,
    exclude: sassModuleRegex,
    use: [
        require.resolve('css-hot-loader'),
        MiniCssExtractPlugin.loader,
        require.resolve('css-loader'),
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        {
            loader: require.resolve('resolve-url-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        {
            loader: require.resolve('sass-loader'),
            options: {
                sourceMap: true,
            },
        },
    ],
};

const sassModuleLoaderServer = {
    test: sassModuleRegex,
    use: [
        {
            loader: require.resolve('css-loader'),
            options: {
                onlyLocals: true,
                localsConvention: 'camelCase',
                importLoaders: 3,
                modules: {
                    // getLocalIdent: getCSSModuleLocalIdent,
                    getLocalIdent: getLocalIdentWorkaround,
                },
            },
        },
        {
            loader: require.resolve('postcss-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        {
            loader: require.resolve('resolve-url-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        {
            loader: require.resolve('sass-loader'),
            options: {
                sourceMap: true,
            },
        },
    ],
};

const sassLoaderServer = {
    test: sassRegex,
    exclude: sassModuleRegex,
    use: [
        MiniCssExtractPlugin.loader,
        require.resolve('css-loader'),
        {
            loader: require.resolve('resolve-url-loader'),
            options: {
                sourceMap: generateSourceMap,
            },
        },
        {
            loader: require.resolve('sass-loader'),
            options: {
                sourceMap: true,
            },
        },
    ],
};

const urlLoaderClient = {
    test: /\.(png|jpe?g|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options: {
        limit: 2048,
        name: 'assets/[name].[hash:8].[ext]',
    },
};

const urlLoaderServer = {
    ...urlLoaderClient,
    options: {
        ...urlLoaderClient.options,
        emitFile: false,
    },
};

const fileLoaderClient = {
    exclude: [/\.(js|jsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
            },
        },
    ],
};

const fileLoaderServer = {
    exclude: [/\.(js|tsx|ts|tsx|css|mjs|html|ejs|json)$/],
    use: [
        {
            loader: require.resolve('file-loader'),
            options: {
                name: 'assets/[name].[hash:8].[ext]',
                emitFile: false,
            },
        },
    ],
};

export const client = [
    {
        oneOf: [
            babelLoader,
            cssModuleLoaderClient,
            cssLoaderClient,
            sassModuleLoaderClient,
            sassLoaderClient,
            urlLoaderClient,
            fileLoaderClient,
        ],
    },
];

export const server = [
    {
        oneOf: [
            babelLoader,
            cssModuleLoaderServer,
            cssLoaderServer,
            sassModuleLoaderServer,
            sassLoaderServer,
            urlLoaderServer,
            fileLoaderServer,
        ],
    },
];

export default { client, server };

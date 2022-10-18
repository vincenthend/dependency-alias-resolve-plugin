const path = require('path')
// const { ESBuildMinifyPlugin } = require('esbuild-loader')
const { AliasResolvePlugin } = require('resolve-plugin')


module.exports = {
    mode: "development",
    entry: {
        main: "./src/index.ts"
    },
    output: {
        clean: true,
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            src: path.resolve(__dirname, 'src')
        },
        plugins: [
            new AliasResolvePlugin()
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'tsx',  // Or 'ts' if you don't need tsx
                    target: 'es2015',
                    tsconfigRaw: require('./tsconfig.json')
                }
            },
            {
                test: /\.jsx?$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'jsx',  // Or 'ts' if you don't need tsx
                    target: 'es2015',
                }
            },
                
        ]
    },
    // optimization : {
    //     minimizer: [
    //         new ESBuildMinifyPlugin({
    //             target: 'es2015'  // Syntax to compile to (see options below for possible values)
    //         })
    //     ]
    // }
}
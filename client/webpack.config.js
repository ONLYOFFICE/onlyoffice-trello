/*
* (c) Copyright Ascensio System SIA 2022
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
const path = require("path");
const fs = require("fs");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CopyPlugin = require("copy-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        require("dotenv").config({ path: `${__dirname}/.env` });
    }
    const analyzer = parseInt(process.env.ENABLE_BUNDLE_ANALYZER, 10) || 0 === 1;
    return {
        output: {
            path: resolveApp("dist"),
            filename: "[name]-[contenthash].js",
            library: "react",
            clean: true,
        },
        entry: {
            global: resolveApp(path.join("src", "global.ts")),
            index: resolveApp(path.join("src", "index.tsx")),
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "babel-loader",
                    exclude: [/(node_modules)/],
                    options: {
                        cacheDirectory: true,
                    },
                },
                {
                    test: /\.js$/,
                    use: ["source-map-loader"],
                    enforce: "pre",
                    exclude: /(node_modules)/,
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ["sass-loader"],
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                    },
                },
            ],
        },
        devtool: !env.WEBPACK_BUILD ? "source-map" : undefined,
        plugins: [
            new webpack.EnvironmentPlugin([
                "BACKEND_HOST",
                "POWERUP_NAME",
                "POWERUP_APP_KEY",
            ]),
            new MiniCssExtractPlugin(),
            new CopyPlugin({
                patterns: [
                    { from: path.join(__dirname, 'src', 'i18n', 'locales') },
                    { from: path.join(__dirname, 'public', '64.png') },
                    { from: path.join(__dirname, 'public', '144.png') },
                ]
            }),
            analyzer && new BundleAnalyzerPlugin(),
            new HtmlWebpackPlugin({
                chunks: ["global", "index"],
                template: "public/index.html",
                favicon: "public/favicon.png",
                filename: "index.html",
            }),
            !env.WEBPACK_BUILD && new webpack.HotModuleReplacementPlugin(),
        ].filter(Boolean),
        optimization: !env.WEBPACK_BUILD
            ? {
                  minimize: true,
                  usedExports: "global",
                  splitChunks: {
                      chunks: "async",
                      minSize: 50000,
                      maxSize: 244000,
                      minChunks: 1,
                      maxAsyncRequests: 30,
                      maxInitialRequests: 30,
                      cacheGroups: {
                          defaultVendors: {
                              test: /[\\/]node_modules[\\/]/,
                              priority: -10,
                              reuseExistingChunk: true,
                          },
                          default: {
                              minChunks: 2,
                              priority: -20,
                              reuseExistingChunk: true,
                          },
                      },
                  },
              }
            : undefined,
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".css"],
            alias: {
                "components": path.resolve(__dirname, "src/components"),
                "types": path.resolve(__dirname, "src/types"),
                "root": path.resolve(__dirname, "src/"),
                "public": path.resolve(__dirname, "public/"),
            },
        },
        mode: env.WEBPACK_BUILD ? "production" : "development"
    };
};

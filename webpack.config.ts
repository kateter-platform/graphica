import * as path from "path";
import { Configuration } from "webpack";

const config: Configuration = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "MyLibrary",
    libraryTarget: "umd",
    globalObject: "this",
    auxiliaryComment: "Graphica v2",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            configFile: "tsconfig.json", // Specify the path to your tsconfig.json file
            transpileOnly: true, // Enable faster transpilation by skipping type checking
            allowTsInNodeModules: true, // Allows importing TypeScript files from node_modules
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  mode: "production",
};

export default config;

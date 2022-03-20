import path from "path";

import TerserPlugin from "terser-webpack-plugin";
import { Configuration } from "webpack";
import merge from "webpack-merge";

import commonConfig, { getEnvFileValues } from "./webpack.common";

const prodConfig: Configuration = {
  mode: "production",

  entry: {
    index: path.resolve(__dirname, "src/index.tsx"),
    [getEnvFileValues().WORKER_NAME ?? ""]: path.resolve(
      __dirname,
      "src/worker.ts"
    ),
  },

  output: {
    filename: "[name].min.js",
    path: path.resolve(__dirname, "dist"),
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    nodeEnv: process.env.NODE_ENV,
  },
};

// eslint-disable-next-line import/no-default-export
export default merge(commonConfig, prodConfig);

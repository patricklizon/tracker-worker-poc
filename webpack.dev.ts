import childProcess from "child_process";
import path from "path";

import HtmlWebpackPlugin from "html-webpack-plugin";
import { Configuration as WebpackConfig } from "webpack";
import { Configuration as WebpackDevServerConfig } from "webpack-dev-server";
import merge from "webpack-merge";

import commonConfig, { getEnvFileValues } from "./webpack.common";

type Configuration = WebpackConfig & { devServer: WebpackDevServerConfig };

const proxyReq = (function appendToken() {
  let token: string;
  let tokenExpires: number;
  let error = false;
  return (req: any) => {
    if (!error) {
      if (!tokenExpires || new Date().getTime() > tokenExpires) {
        try {
          const buffer = childProcess.execSync("iptiq-cli -target d", {
            stdio: "pipe",
          });
          token = buffer.toString().trim();
          const tokenSlice = token.split(".")[1];
          if (!tokenSlice) throw new Error("kek");
          tokenExpires =
            JSON.parse(Buffer.from(tokenSlice, "base64").toString("ascii"))
              .exp * 1000;
          // eslint-disable-next-line no-console
          console.log("token updated");
        } catch {
          error = true;
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      req.setHeader("x-iptiq-cli", `Bearer ${token}`);
    }
  };
})();

const devConfig: Configuration = {
  mode: "development",

  entry: {
    example: path.resolve(
      __dirname,
      `examples/${getEnvFileValues().EXAMPLE ?? "simple"}.tsx`
    ),
    [getEnvFileValues().WORKER_NAME ?? ""]: path.resolve(
      __dirname,
      "src/worker.ts"
    ),
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },

  devServer: {
    compress: true,
    historyApiFallback: true,
    port: 8001,
    open: true,
    hot: true,
    liveReload: false,
    proxy: {
      "/quotation/v1/event/frontend/": {
        changeOrigin: true,
        target: getEnvFileValues().API_URL ?? "",
        onProxyReq: proxyReq,
      },
    },
  },

  devtool: "cheap-module-source-map",

  plugins: [
    new HtmlWebpackPlugin({
      cache: true,
      filename: "index.html",
      title: "hello universe",
      template: path.resolve(__dirname, "index.html"),
      publicPath: "/",
    }),
  ],
};

// eslint-disable-next-line import/no-default-export
export default merge(commonConfig, devConfig);

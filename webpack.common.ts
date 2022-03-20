import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import { Configuration, DefinePlugin } from "webpack";

const commonConfig: Configuration = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },

  module: {
    rules: [
      {
        test: /\.(mjs|js|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: { loader: "swc-loader" },
      },
    ],
  },

  plugins: [new DefinePlugin(getEnvKeys())],
};

export function getEnvFileValues() {
  const env = dotenv.config().parsed;
  const baseEnvPath = "/.env";
  const extension = env?.ENV ? "." + env.ENV : "";
  const envPath = path.join(__dirname, baseEnvPath + extension);
  const envFilePath = fs.existsSync(envPath) ? envPath : baseEnvPath;
  return dotenv.config({ path: envFilePath }).parsed ?? {};
}

function getEnvKeys(): Record<string, string> {
  const fileEnv = getEnvFileValues();

  return Object.entries(fileEnv).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      acc[`process.env.${key}`] = JSON.stringify(value);
      return acc;
    },
    {}
  );
}

// eslint-disable-next-line import/no-default-export
export default commonConfig;

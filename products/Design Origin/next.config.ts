import type { NextConfig } from "next";
import path from "node:path";

type WebpackRule = {
  test?: RegExp | { test?: (value: string) => boolean };
  exclude?: RegExp;
  use?: string[];
  oneOf?: WebpackRule[];
};

const svgRule: WebpackRule = {
  test: /\.svg$/i,
  use: ["@svgr/webpack"],
};

function excludeSvgFromRules(rules: WebpackRule[]) {
  for (const rule of rules) {
    if (rule.test?.test?.(".svg")) {
      rule.exclude = /\.svg$/i;
    }

    if (rule.oneOf) {
      excludeSvgFromRules(rule.oneOf);
    }
  }
}

const nextConfig: NextConfig = {
  transpilePackages: ["@fai/ui"],
  turbopack: {
    root: path.resolve(process.cwd(), "../.."),
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    const rules = config.module.rules as WebpackRule[];
    const firstOneOf = rules.find((rule) => rule.oneOf)?.oneOf;

    excludeSvgFromRules(rules);

    if (firstOneOf) {
      firstOneOf.unshift(svgRule);
    } else {
      rules.unshift(svgRule);
    }

    return config;
  },
};

export default nextConfig;

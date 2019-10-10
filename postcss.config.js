const prod = process.env.NODE_ENV === "production";
const purgecss = require("@fullhuman/postcss-purgecss");
const purgeSvelte = require("purgecss-from-svelte");

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  plugins: [
    require("postcss-import")(),
    require("postcss-preset-env")({
      browsers: "last 2 versions"
    }),
    require("tailwindcss")("./tailwind.config.js"),
    require("postcss-extend")(),
    require("autoprefixer")(),
    ...(prod
      ? [
          purgecss({
            content: ["**/*.svelte", "**/*.html"],
            css: ["**/*.css"],
            extractors: [
              {
                extractor: purgeSvelte,
                extensions: ["svelte"]
              },
              {
                extractor: TailwindExtractor,
                extensions: ["html"]
              }
            ]
          }),
          require("cssnano")({ preset: "default" })
        ]
      : [])
  ]
};

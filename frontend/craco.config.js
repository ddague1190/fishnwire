module.exports = {
  eslint: null,
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.externals = {
        Config: JSON.stringify(require("./config.prod.js")),
      };
      return webpackConfig;
    },
  },
  style: {
    postcssOptions: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
    // sass: {
    //   loaderOptions: {
    //     additionalData: `
    //         @import "src/sass/_variables.scss";
    //         @import "src/sass/_base.scss";
    //         @import "src/sass/_mixins.scss";
    //       `,
    //   },
    // },
  },
};

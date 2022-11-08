const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Baumkataster",
    themeColor: "#8dd0ba",
    icons: {
      favicon32: 'img/favicon/favicon-32x32.png',
      favicon16: 'img/favicon/favicon-16x16.png',
      appleTouchIcon: 'img/favicon/apple-icon-152x152.png',
      msTileImage: 'img/favicon/ms-icon-144x144.png'
    }
  }
})

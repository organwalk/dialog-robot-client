const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // configureWebpack: {
  //   resolve: {
  //     fallback: {
  //       fs: false,
  //       path: require.resolve("path-browserify")
  //     }
  //   }
  // },
  transpileDependencies: true,
  devServer:{
    proxy:{
      '/api':{
        target:'https://www.ecpan.cn/platform',
        ws:true,
        changeOrigin:true,
        secure:true,
        pathRewrite:{
          '^/api':''//重写路径
        }
      }
    }
  }
})

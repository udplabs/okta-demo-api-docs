const { description } = require('../../package')
require('dotenv').config()
const webpack = require('webpack')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'okta-demo-api',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    lastUpdated: 'Last Updated',
    nav: [
      {
        text: 'API',
        link: '/swagger/',
      },
      {
        text: 'Postman',
        link: '/postman/'
      },
      {
        text: 'Github',
        link: 'https://github.com/udplabs/okta-demo-api'
      }

    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ],


  /**
   * dotenv is not available inside Vuepress so was added as dependency
   * The following takes everything from .env file and makes it available to all components
   * Solution taken from: https://stackoverflow.com/questions/53669076/how-do-i-use-configurewebpack-to-make-custom-variables-available-to-components
   */
  configureWebpack: (config) => {
    return { plugins: [
      new webpack.EnvironmentPlugin({ ...process.env })
    ]}
  }  
}

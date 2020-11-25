const { override, fixBabelImports, addLessLoader, addBabelPlugins } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#00843d',
      '@layout-header-background': '#003418',
      '@menu-dark-submenu-bg': '#002712',
      'layout-trigger-background': '#002712',
    },
  }),
  addBabelPlugins([
    'root-import',
    {
      rootPathPrefix: '~',
      rootPathSuffix: 'src',
    },
  ])
)

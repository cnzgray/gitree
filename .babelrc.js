const plugins = [
  '@babel/plugin-proposal-optional-chaining',
  [
    'component',
    {
      libraryName: 'element-ui',
      styleLibraryName: 'theme-chalk'
    }
  ]
]
const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      modules: false,
      targets: {
        // https://jamie.build/last-2-versions
        browsers: ['> 0.25%', 'not ie 11', 'not op_mini all']
      }
    }
  ]
]

module.exports = {
  plugins,
  presets
}

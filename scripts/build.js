const path = require('path')
const fs = require('fs-extra')
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');
const { red, run } = require('./utils')

const name = require('minimist')(process.argv.slice(2)).name

function main(target) {
  if (!target) {
    red('请指定将要打包的项目')
    return
  }

  const pkgDir = path.resolve(__dirname, '..', 'packages', target)

  run('npx', [
      'webpack',
      '--config', 
      './scripts/webpack.prod.js', 
      '--progress',
      '--env',
      `target=${target}`
    ]
  )

  const extractorConfig = ExtractorConfig.loadFileAndPrepare(path.resolve(pkgDir, 'api-extractor.json'))
  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: true,
    showVerboseMessages: true
  })

  if (!extractorResult.succeeded) {
    red(`API Extractor completed with ${extractorResult.errorCount} errors` +
    ` and ${extractorResult.warningCount} warnings`)
  }

  fs.removeSync(path.resolve(pkgDir, 'dist', 'src'))
}

if (name) main(name)

module.exports = main

const path = require('path')
const fs = require('fs-extra')
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

  const re = /((?:import|export)\s+.+\s+from\s+['"])(.+)(['"])/mg

  const sym = 'src'
  const rep = './src/'
  const symS = 'src/'
  const bashPath = path.resolve(pkgDir, 'dist');

  const files = require("glob").sync("./src/**/*.d.ts", { cwd: bashPath, absolute: true })
  let changed = false;
  files.forEach(f => {
    changed = false;
    const source = fs.readFileSync(f, { encoding: 'utf8' })
    const replaced = source.replace(re, (str, a, b, c) => {
      if (b !== sym && !b.startsWith(symS)) return str;
      changed = true;
      const dir = path.dirname(f)
      let target = path.resolve(dir, path.normalize(path.relative(dir, bashPath) + '/' + b.replace(sym, rep)))
      if (target.startsWith('/')) target = '.' + target
      let rel = path.relative(dir, target)
      if (!rel.startsWith('.')) rel = './' + rel
      if (path.sep !== '/') rel = rel.replace(/\\/g, '/');
      return a + rel + c;
    })
    if (changed) {
      fs.writeFileSync(f, replaced, { encoding: 'utf8' })
    }
  })

  // const extractorConfig = ExtractorConfig.loadFileAndPrepare(path.resolve(pkgDir, 'api-extractor.json'))
  // const extractorResult = Extractor.invoke(extractorConfig, {
  //   localBuild: true,
  //   showVerboseMessages: true
  // })

  // if (!extractorResult.succeeded) {
  //   red(`API Extractor completed with ${extractorResult.errorCount} errors` +
  //   ` and ${extractorResult.warningCount} warnings`)
  // }

  // fs.removeSync(path.resolve(pkgDir, 'dist', 'src'))
}

if (name) main(name)

module.exports = main

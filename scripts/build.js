const path = require('path')
const fs = require('fs-extra')
const glob = require('glob')
const sass = require('sass')
const postcss = require('postcss')
const { error, run } = require('./utils')

const name = require('minimist')(process.argv.slice(2)).name

function main(target) {
  if (!target) {
    error('请指定将要打包的项目')
    return
  }

  const pkgDir = path.resolve(__dirname, '..', 'packages', target)
  const srcDir = path.resolve(pkgDir, 'src')
  const libDir = path.resolve(pkgDir, 'lib')
  const distDir = path.resolve(pkgDir, 'dist')

  fs.removeSync(distDir)
  fs.removeSync(libDir)

  process.env.NODE_ENV = 'production'

  run('npx', [
      'webpack',
      '--config', 
      './scripts/webpack.prod.js', 
      '--progress',
      '--env',
      `target=${target}`
    ]
  )

  if (path.resolve(srcDir, 'index.lite.ts')) {
    run('npx', [
        'webpack',
        '--config', 
        './scripts/webpack.prod.js', 
        '--progress',
        '--env',
        `target=${target}`,
        'lite=true'
      ]
    )
  }

  run('npx', [
    'tsc',
    '--project',
    path.resolve(pkgDir, 'tsconfig.json')
  ])

  const hasCss = fs.existsSync(path.resolve(srcDir, 'styles/index.scss'))

  if (!hasCss) return

  glob.sync('./src/**/*.scss', { cwd: pkgDir, absolute: true }).forEach(f => {
    const { css } = sass.renderSync({
      file: f,
      sourceMap: false,
    })
    const text = css.toString()
    if (text) {
      postcss([require('autoprefixer')])
        .process(text, { from: f, map: false })
        .then(res => {
          if (res.css) {
            fs.outputFileSync(
              path.resolve(libDir, path.relative(srcDir, f)).replace(/\.scss$/, '.css'),
              res.css
            )
          }
        })
    }
  })

  const importScssRe = /import ['"].+?\.scss['"];?/mg
  glob.sync("./lib/**/*.d.ts", { cwd: pkgDir, absolute: true }).forEach(f => {
    const text = fs.readFileSync(f, 'utf8')
    fs.writeFileSync(f, text.replace(importScssRe, ''))
  })

  const cssImportRe = /(import\s*['"].+?\.)scss(['"])/mg
  glob.sync("./lib/**/*.js", { cwd: pkgDir, absolute: true }).forEach(f => {
    const text = fs.readFileSync(f, 'utf8')
    fs.writeFileSync(f, text.replace(cssImportRe, '$1css$2'))
  })
}

if (name) main(name)

module.exports = main

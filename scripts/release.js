const semver = require('semver')
const fs = require('fs-extra')
const path = require('path')
const { prompt } = require('enquirer')
const pkg = require('../package.json')
const { error, info, run, success } = require('./utils')
const build = require('./build')

const packagesDir = path.resolve(__dirname, '..', 'packages')

async function main() {
  info(`\n当前版本 v${pkg.version}\n`)

  const { inc } = await prompt({
    type: 'select',
    name: 'inc',
    message: 'Select release type',
    choices: ['patch', 'minor', 'major']
  })

  semver.inc(pkg.version, inc)

  const version = semver.inc(pkg.version, inc)
  if (!semver.valid(version)) {
    error(`${version} 版本号不合法`)
    return
  }

  const { yes } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${version}. Confirm?`
  })

  if (!yes) return

  info('\nRunning lint...')
  run('yarn', ['lint'])

  info('\nRunning tests...')
  run('yarn', ['test'])

  info('\nBuilding all packages...')
  buildPackages()

  info('\nUpdating versions...')
  updateVersions(version)

  run(`yarn`, ['changelog'])

  info('\nPublishing packages...')
  publishPackages()

  info('\nPushing to GitHub...')
  run('git', ['add', '-A'])
  run('git', ['commit', '-m', `release: v${version}`])
  run('git', ['tag', `v${version}`])
  run('git', ['push', 'origin', `refs/tags/v${version}`])
  run('git', ['push'])

  success('\nRelease success\n')
}

function getValidPkgDirs() {
  return fs.readdirSync(packagesDir).filter(d => {
    try {
      return !require(path.resolve(packagesDir, d, 'package.json')).private
    } catch(e) {
      return false
    }
  })
}

function buildPackages() {
  getValidPkgDirs().forEach(d => build(d))
}

function updateVersions(version) {
  getValidPkgDirs().forEach(d => {
    const f = path.resolve(packagesDir, d, 'package.json')
    const p = require(f)
    p.version = version
    fs.writeJsonSync(f, p, { spaces: 2 })
  })
  pkg.version = version
  fs.writeJsonSync(path.resolve(__dirname, '../package.json'), pkg, { spaces: 2 })
}

function publishPackages() {
  getValidPkgDirs().forEach(d => {
    info(`\nPublishing ${d}\n`)
    run('npm', ['publish'], { cwd: path.resolve(packagesDir, d) })
  })
}

main()

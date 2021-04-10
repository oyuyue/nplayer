const path =require('path')
const chalk = require('chalk');
const execa = require('execa');

function run(file, args, opts) {
  return execa.sync(file, args, { stdio: 'inherit', ...opts }).stdout
}

function error(text) {
  console.error(chalk.red(text))
}

function success(text) {
  console.log(chalk.green(text))
}

function info(text) {
  console.log(chalk.cyan(text))
}

function getPkgDir(target) {
  return path.resolve(__dirname, '..', 'packages', target)
}

module.exports = {
  error,
  success,
  info,
  run,
  getPkgDir
}

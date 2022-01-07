const exec = require('@actions/exec')
const { execSync } = require('child_process')

async function main(pathsToSearch = '') {
  throwsForInvalidPaths(pathsToSearch)

  return hasChanged(pathsToSearch)
}

function throwsForInvalidPaths(pathsToSearch) {
  if (pathsToSearch && typeof pathsToSearch === 'string') return
  throw new Error('pathsToSearch needs to be a string')
}

function getCWD() {
  const { GITHUB_WORKSPACE = '.', SOURCE = '.' } = process.env
  return `${GITHUB_WORKSPACE}/${SOURCE}`
}

async function hasChanged(pathsToSearch) {
  const paths = pathsToSearch.split(' ')

  //  --quiet: exits with 1 if there were differences (https://git-scm.com/docs/git-diff)
   
  const lastCommitParent = execSync('git rev-parse HEAD^@').toString()
        .trim()
        .split('\n')
        .at(-1)
  
  const result = await exec.exec('git', [
    'diff',
    lastCommitParent,
    'HEAD',
    '--',
    ...paths,
  ], {
    cwd: getCWD()
  })

  const pathsChanged = result.length > 0

  return pathsChanged
}

module.exports = main

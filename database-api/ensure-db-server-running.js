const util = require('util')
const exec = util.promisify(require('child_process').exec)
const { execSync } = require('child_process')
const execOptionsInit = { shell: '/bin/bash' }


function print(input) {
  process.stdout.write(input)
}


async function ensureDatabaseServerOn() {

  const shellPath = {
    gnuLinux: '/bin/bash',
    macOS:    '/usr/local/bin/bash',
  }
  const checkMySQL = {
    gnuLinux: 'systemctl status mysql',
    macOS:    'mysql.server status',
  }
  const startMySQL = {
    gnuLinux: 'systemctl start mysql',
    macOS:    'mysql.server start',
  }

  try {

    let baseSystem =
      await exec('uname -s', execOptionsInit).then(out => out.stdout.trimEnd())

    let os
    switch (baseSystem) {
      case 'Linux':     // Linux kernel
        os = 'gnuLinux' // GNU/Linux
        break
      case 'Darwin':    // Darwin core OS
        os = 'macOS'    // MacOS
        break
      default:
        throw new Error(
          'Error in OS code, or operating system not accounted for.'
        )
    }

    const shell = shellPath[os]
    const check = checkMySQL[os]
    const start = startMySQL[os]
    const checkCode = `${check} >/dev/null; echo $?`

    const execOptions = { shell }
    const execSyncOptions = { shell, stdio: 'ignore' }

    let exitCode =
      await exec(checkCode, execOptions).then(out => out.stdout.trimEnd())

    if (exitCode === '0') {
      print('The MySQL server is already running; no need to start it.\n\n')
    }
    else {
      print('MySQL server not currently running, so starting now...\n')
      try {
        execSync(start, execSyncOptions)
      }
      catch (err) {
        throw new Error('The MySQL server did not successfully start.')
      }
      print('The MySQL server successfully started.\n')
      // No need to test:
      // print('Checking status for readyness to connect.')
      // exitCode =
      //   await exec(checkCode, execOptions).then(out => out.stdout.trimEnd())
      // while (exitCode !== '0') {
      //   print('.')
      //   await exec('sleep 0.5s', execOptions)
      //   exitCode =
      //     await exec(checkCode, execOptions).then(out => out.stdout.trimEnd())
      // }
      // print('\nReady to connect.\n\n')
    }

  }
  catch (err) {
    throw new Error(`Failure to ensure database server is running: ${err}`)
  }

}


module.exports = ensureDatabaseServerOn
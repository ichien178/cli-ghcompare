import {Command, flags} from '@oclif/command'
import {exec} from 'child_process'

class Ghcompare extends Command {
  static description = `Opens a GitHub compare URL for the current repository in your default browser.

It takes two arguments: a head commit/branch and a base commit/branch.`;

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'head', required: false}, {name: 'base', required: false}];

  static examples = [
    '$ ghcompare main develop',
    '$ ghcompare my-feature-branch main',
    '$ ghcompare a1b2c3d 9f8e7g6',
  ];

  async getGitBranches(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      exec('git branch', (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }

        if (stderr) {
          this.log(`git branch stderr: ${stderr}`)
        }

        const branches = stdout.split('\n').map(branch => branch.replace('*', '').trim()).filter(branch => branch.length > 0)
        resolve(branches)
      })
    })
  }

  async run() {
    const gitRemoteOriginUrl = require('git-remote-origin-url')
    const GitUrlParse = require('git-url-parse')
    const open = require('open')

    const {args} = this.parse(Ghcompare)

    const gitSshUrl = await gitRemoteOriginUrl()
    // eslint-disable-next-line new-cap
    const gitHttpsUrl = GitUrlParse(gitSshUrl).toString('https').replace('.git', '')

    let head = args.head
    let base = args.base

    if (!head || !base) {
      const {default: inquirer} = await import('inquirer')
      const branches = await this.getGitBranches()
      const responses = await (inquirer as any).prompt([
        {
          name: 'head',
          message: 'Select a head branch',
          type: 'list',
          choices: branches,
          default: head,
        },
        {
          name: 'base',
          message: 'Select a base branch',
          type: 'list',
          choices: branches,
          default: base,
        },
      ])
      head = responses.head
      base = responses.base
    }

    // open browser
    const compareGitHubUrl = `${gitHttpsUrl}/compare/${base}...${head}`
    this.log(`open URL by defaultBrowser: ${compareGitHubUrl}`)
    await open(compareGitHubUrl)
  }
}

export = Ghcompare;

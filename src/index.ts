import {Command, flags} from '@oclif/command'

class Ghcompare extends Command {
  static description = `Opens a GitHub compare URL for the current repository in your default browser.

It takes two arguments: a head commit/branch and a base commit/branch.`;

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'head'}, {name: 'base'}];

  static examples = [
    '$ ghcompare main develop',
    '$ ghcompare my-feature-branch main',
    '$ ghcompare a1b2c3d 9f8e7g6',
  ];

  async run() {
    const gitRemoteOriginUrl = require('git-remote-origin-url')
    const GitUrlParse = require('git-url-parse')
    const open = require('open')

    const {argv} = this.parse(Ghcompare)

    const gitSshUrl = await gitRemoteOriginUrl()
    // eslint-disable-next-line new-cap
    const gitHttpsUrl = GitUrlParse(gitSshUrl).toString('https').replace('.git', '')

    if (argv.length !== 2) {
      this.error('Please provide two arguments: a head and a base. For example: ghcompare my-feature-branch main')
    }

    // open browser
    const compareGitHubUrl = `${gitHttpsUrl}/compare/${argv[1]}...${argv[0]}`
    this.log(`open URL by defaultBrowser: ${compareGitHubUrl}`)
    await open(compareGitHubUrl)
  }
}

export = Ghcompare;

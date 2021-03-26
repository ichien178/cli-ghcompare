import {Command, flags} from '@oclif/command'

class Ghcompare extends Command {
  static description = 'open github compare Url link.';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'startCommitIdOrBranchName'}, {name: 'endCommitIdOrBranchName'}];

  async run() {
    const gitRemoteOriginUrl = require('git-remote-origin-url')
    const GitUrlParse = require('git-url-parse')
    const open = require('open')

    const {argv} = this.parse(Ghcompare)

    const gitSshUrl = await gitRemoteOriginUrl()
    // eslint-disable-next-line new-cap
    const gitHttpsUrl = GitUrlParse(gitSshUrl).toString('https').replace('.git', '')

    if (argv.length !== 2) {
      this.error('please set 2 arguments. For example, ghcompare <first> <second>')
    }

    // open browser
    const compareGitHubUrl = `${gitHttpsUrl}/compare/${argv[0]}...${argv[1]}`
    this.log(`open URL by defaultBrowser: ${compareGitHubUrl}`)
    await open(compareGitHubUrl)
  }
}

export = Ghcompare;

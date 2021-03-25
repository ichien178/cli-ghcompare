import {Command, flags} from '@oclif/command'

class Ghcompare extends Command {
  static description = 'describe the command here';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'startCommitId'}, {name: 'endCommitId'}];

  async run() {
    const gitRemoteOriginUrl = require('git-remote-origin-url')
    const GitUrlParse = require('git-url-parse')
    const open = require('open')

    const {argv} = this.parse(Ghcompare)

    const gitSshUrl = await gitRemoteOriginUrl()
    // eslint-disable-next-line new-cap
    const gitHttpsUrl = GitUrlParse(gitSshUrl).toString('https').replace('.git', '')

    this.log(`${argv[0]}`)
    this.log(`${argv[1]}`)
    this.log(gitHttpsUrl)
    await open(`${gitHttpsUrl}/compare/${argv[0]}...${argv[1]}`)
  }
}

export = Ghcompare;

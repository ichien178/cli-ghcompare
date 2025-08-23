import {Command, flags} from '@oclif/command'

class Ghcompare extends Command {
  static description = `Opens a GitHub compare URL for the current repository in your default browser.

Takes one or two arguments.
- With one argument, it compares the given base branch to the current branch.
- With two arguments, it compares the head branch to the base branch.`;

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
  };

  static args = [{name: 'headOrBase'}, {name: 'base', required: false}];

  static examples = [
    '$ ghcompare develop # Compares develop...current-branch',
    '$ ghcompare my-feature-branch main',
    '$ ghcompare a1b2c3d 9f8e7g6',
  ];

  async run() {
    const gitRemoteOriginUrl = require('git-remote-origin-url')
    const GitUrlParse = require('git-url-parse')
    const open = require('open')
    const {execSync} = require('child_process')

    const {argv} = this.parse(Ghcompare)

    const gitSshUrl = await gitRemoteOriginUrl()
    // eslint-disable-next-line new-cap
    const gitHttpsUrl = GitUrlParse(gitSshUrl).toString('https').replace('.git', '')

    if (argv.length === 0 || argv.length > 2) {
      this.error('Please provide one or two arguments. See `ghcompare --help`')
    }

    let head: string
    let base: string

    if (argv.length === 1) {
      base = argv[0]
      try {
        head = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
      } catch (error) {
        this.error('Could not determine current git branch. Are you in a git repository?', {exit: 1})
      }
    } else { // length is 2
      head = argv[0]
      base = argv[1]
    }

    // open browser
    const compareGitHubUrl = `${gitHttpsUrl}/compare/${base}...${head}`
    this.log(`open URL by defaultBrowser: ${compareGitHubUrl}`)
    await open(compareGitHubUrl)
  }
}

export = Ghcompare;

import {expect, test} from '@oclif/test'
import * as proxyquire from 'proxyquire'
import * as sinon from 'sinon'

interface OclifError extends Error {
  oclif: {
    exit: number;
  };
}

const cmdWithMocks = (remoteUrl: string) => {
  return proxyquire('../src', {
    'git-remote-origin-url': () => Promise.resolve(remoteUrl),
    open: sinon.stub(),
  })
}

describe('ghcompare', () => {
  // Test case for missing arguments
  test
  .stderr()
  .do(() => {
    const cmd = cmdWithMocks('git@github.com:user/repo.git') // URL must be valid for parser
    return cmd.run([])
  })
  .catch(error => {
    const oclifError = error as OclifError
    expect(oclifError.message).to.contain('Please provide two arguments')
    expect(oclifError.oclif.exit).to.equal(2)
  })
  .it('fails when no arguments are provided')

  // Test case for successful run
  test
  .stdout()
  .do(() => {
    const cmd = cmdWithMocks('git@github.com:1coin178/cli-ghcompare.git')
    return cmd.run(['my-feature', 'main'])
  })
  .it('opens the correct GitHub compare URL', ctx => {
    const expectedUrl = 'https://github.com/1coin178/cli-ghcompare/compare/main...my-feature'
    expect(ctx.stdout).to.contain(`open URL by defaultBrowser: ${expectedUrl}`)
  })

  // Test case with different arguments
  test
  .stdout()
  .do(() => {
    const cmd = cmdWithMocks('git@github.com:user/repo.git')
    return cmd.run(['a1b2c3d', 'f9e8d7c'])
  })
  .it('handles commit SHAs as arguments', ctx => {
    const expectedUrl = 'https://github.com/user/repo/compare/f9e8d7c...a1b2c3d'
    expect(ctx.stdout).to.contain(`open URL by defaultBrowser: ${expectedUrl}`)
  })

  // Test that 'open' is called
  test
  .stdout()
  .it('calls the open library with the correct url', async () => {
    const openStub = sinon.stub()
    const cmd = proxyquire('../src', {
      'git-remote-origin-url': () => Promise.resolve('git@github.com:user/repo.git'),
      open: openStub,
    })
    await cmd.run(['head', 'base'])
    const expectedUrl = 'https://github.com/user/repo/compare/base...head'
    expect(openStub.calledOnceWith(expectedUrl)).to.be.true
  })
})

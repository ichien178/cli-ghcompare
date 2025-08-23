# ghcompare

A simple CLI tool that opens a GitHub compare URL for the current repository in your default browser.

## Installation

```sh
npm install -g @1coin178/github-compare
```

## Usage

The command takes two arguments: the `HEAD` and `BASE` of the comparison. These can be branch names or commit SHAs.

```sh
ghcompare <head> <base>
```

The tool will open a URL like `https://github.com/user/repo/compare/base...head` in your browser.

### Examples

- Compare a feature branch to `main`:
  ```sh
  ghcompare my-feature-branch main
  ```

- Compare two commits:
  ```sh
  ghcompare a1b2c3d 9f8e7g6
  ```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on how to set up your development environment.

## How it works

The tool automatically detects the GitHub repository URL from your local git repository's `origin` remote.

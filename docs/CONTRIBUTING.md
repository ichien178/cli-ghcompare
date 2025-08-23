# Contributing

This document outlines the steps for setting up your local development environment to contribute to this project.

## Development Setup

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/1coin178/cli-ghcompare.git
    cd cli-ghcompare
    ```

2.  **Install dependencies:**

    We recommend using `yarn` for dependency management.

    ```sh
    yarn install
    ```

    Alternatively, you can use `npm`:

    ```sh
    npm install
    ```

3.  **Build the project:**

    The project is written in TypeScript and needs to be compiled into JavaScript. The build process is handled automatically when you install dependencies, but you can also run it manually:

    ```sh
    npm run prepack
    ```
    This will compile the source files from `src` into the `lib` directory.

## Running Locally

To run the CLI with your local changes without installing it globally, use the `bin/run` script:

```sh
./bin/run <head> <base>
```

For example:
```sh
./bin/run my-feature-branch main
```

## Running Tests

To run the test suite, use the following command:

```sh
npm test
```
This command will run all tests located in the `test` directory.

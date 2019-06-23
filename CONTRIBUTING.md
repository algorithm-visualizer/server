# Contributing

> #### Table of Contents
> - [Running Locally](#running-locally)
> - [Directory Structure](#directory-structure)

Are you a first-timer in contributing to open source? [These guidelines](https://opensource.guide/how-to-contribute/#how-to-submit-a-contribution) from GitHub might help!

## Running Locally

1. Fork this repository.

2. Clone your forked repo to your machine.

    ```bash
    git clone https://github.com/<your-username>/server.git    
    ```

3. Install [Docker](https://docs.docker.com/install/), if not done already.

4. Create `.env.local` in the project root:
    ```bash
    # By putting dummy values, GitHub sign in will not work locally
    GITHUB_CLIENT_ID = dummy
    GITHUB_CLIENT_SECRET = dummy

    # By putting dummy values, extracting visualizing commands will not work locally (except for JavaScript).
    AWS_ACCESS_KEY_ID = dummy
    AWS_SECRET_ACCESS_KEY = dummy
    ```

5. Install dependencies, and run the server.

    ```bash
    cd server

    npm install
    
    npm run watch
    ```
    
6. Open [`http://localhost:8080/`](http://localhost:8080/) in a web browser.

## Directory Structure

- [**src/**](src) contains source code. 
    - [**config/**](src/config) contains configuration files.
    - [**controllers/**](src/controllers) routes and processes incoming requests.
    - [**middlewares/**](src/middlewares) contains Express middlewares.
    - [**models/**](src/models) manages algorithm visualizations and their hierarchy.
    - [**tracers/**](src/tracers) build visualization libraries and compiles/runs code.
    - [**utils/**](src/utils) contains utility files.

**NOTE** that for JavaScript, it builds a web worker rather than a docker image. Once a browser fetches the web worker, it will submit users' code to the web worker locally, instead of submitting to the remote server, to extract visualizing commands.

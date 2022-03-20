# Data lake event &middot; POC

POC of implementing iptiq's event tracker as a web Worker.

## Table of content

- [Prerequisites](#Prerequisites)
- [Setup](#Setup)

## Prerequisites

- [Node](https://nodejs.org/en/) - version specified in [.nvmrc](/.nvmrc) file.
- [npm](https://www.npmjs.com/) - usually comes with node.

_It's recommended to use node version manger (ie. [fnm](https://github.com/Schniz/fnm)), for easier switching between different projects._

## Setup

```sh
# Create environmental variables
cp .env.example .env

# Install dependencies
npm ci

# Start dev server
npm start
```

### Loading example

Set env variable `EXAMPLE` to the name of one of the [examples](./examples/) file.

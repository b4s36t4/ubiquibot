# `@ubiquity/bounty-bot` the "UbiquiBot"

This bot facilitates the Ubiquity Bounty System.

## Overview

- This bot is designed to exist as a GitHub Action.
- The code must be compiled using `@vercel/ncc` because all the dependencies (e.g. `node_modules`) must be included and committed on the repository for the GitHub Actions runner to use.

## Development

The best way to start is by opening two terminal instances.

- In one instance, run `tsc --watch`
- In the other instance, run `yarn start:local:watch`
- This will compile the TypeScript code and run the bot locally.

At this point you can make changes to the repository on GitHub (e.g. add a bounty) and the bot should react.

![ubiquibot-pfp-1-cropped](https://user-images.githubusercontent.com/4975670/208798418-bded56b2-1474-407b-8ae3-6342e503f437.png)

![Talent Protocol](https://raw.githubusercontent.com/talentprotocol/mvp/master/app/packs/images/logo.png)

# Talent Protocol
> Support talent you believe in and be rewarded when they succeed.

Talent Protocol is a decentralized platform where talent can create a personal token, and where supporters can make angel investments in someone's career to become a part of their journey.

## Installing / Getting started

Talent Protocol web app is based on Ruby on Rails and React. You'll need to have:

- Ruby 2.7.3
- Node.js 16.4.2
- PostgreSQL 12
- ImageMagick +6

Alternatively you can run it using Docker.

Install the project dependencies and then:

```shell
bundle install
yarn install
bin/rails s
```

This will start the rails server on `localhost:3000`, if you want hot-reloading you can also run `bin/webpack-dev-server`.

### Initial Configuration

For the initial configuration all you need is to setup your database

```shell
bin/rails db:create
bin/rails db:migrate
```

We provide a rake task to setup some initial data in the application.

```shell
bin/rails dev:prime
```

### Git approach

Our developments are made in feature branches. In order to create a feature branch you should create a new one from the `dev` branch.

We also recommend you to setup our pre-commit hook. In order to do that you just need to run once:

`cp .githooks/pre-commit .git/hooks`

After that `make lint` will run before each commit for the staged files.

## Links

- Project homepage: https://talentprotocol.com
- Twitter: https://twitter.com/talentprotocol
- LinkedIn: https://linkedin.com/company/talentprotocol/

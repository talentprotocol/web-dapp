![Talent Protocol](https://raw.githubusercontent.com/talentprotocol/mvp/master/app/packs/images/logo.png)

# Talent Protocol
> Support talent you believe in and be rewarded when they succeed.

Talent Protocol is a decentralized platform where talent can create a personal token, and where supporters can make angel investments in someone's career to become a part of their journey.

## Installing / Getting started

Talent Protocol web app is based on Ruby on Rails and React, you'll need to have ruby (2.7.3), node (16.4.2) and postgresql (v12) installed to run it or docker.

Install the project dependencies:

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
## Links

- Project homepage: https://talentprotocol.com
- Twitter: https://twitter.com/talentprotocol
- LinkedIn: https://linkedin.com/company/talentprotocol/

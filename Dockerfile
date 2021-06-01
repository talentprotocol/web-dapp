# syntax=docker/dockerfile:1

# Add node and ruby
FROM node:14.16.1-alpine as node-builder
FROM ruby:2.7.3-alpine as ruby-builder

# Add Yarn repository
RUN apk add --no-cache alpine-sdk tzdata postgresql-client postgresql-dev git build-base file yarn libcurl curl

# Add gemfile and install dependencies
ADD Gemfile* ./tmp/
ADD package.json yarn.lock ./tmp/
WORKDIR /tmp
RUN gem install bundler -v 2.1.4
RUN bundle install
RUN yarn install

# Set working directory
ENV mvp /mvp
RUN mkdir $mvp
WORKDIR $mvp

RUN ln -s /tmp/node_modules

ADD . ./

EXPOSE 3000

# Configure the main process to run when running the image
CMD ["bundle", "exec", "foreman", "start", "-f", "Procfile.dev"]
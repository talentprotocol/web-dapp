# syntax=docker/dockerfile:1

FROM node:16.4.2-alpine AS node
FROM ruby:2.7.3-alpine

# Add node to ruby base image
COPY --from=node /usr/lib /usr/lib
COPY --from=node /usr/local/share /usr/local/share
COPY --from=node /usr/local/lib /usr/local/lib
COPY --from=node /usr/local/include /usr/local/include
COPY --from=node /usr/local/bin /usr/local/bin

# Add dependencies
RUN apk add --no-cache alpine-sdk tzdata postgresql-client postgresql-dev \
	git build-base file yarn libcurl curl imagemagick-dev python3 gcompat

# Add gemfile and install dependencies
ADD Gemfile* ./tmp/
ADD package.json yarn.lock ./tmp/
WORKDIR /tmp
RUN bundle install
RUN yarn install

# Set working directory
ENV mvp /mvp
RUN mkdir $mvp
WORKDIR $mvp

RUN ln -s /tmp/node_modules

ADD . ./

EXPOSE 3000

CMD ["sh", "-c", "<<EOF \
bundle exec rails db:create && \
bundle exec rails db:migrate && \
bundle exec rails dev:prime && \
bundle exec rails races:setup_first_race && \
bin/webpacker-dev-server & \
bundle exec rails s -b 0.0.0.0"]
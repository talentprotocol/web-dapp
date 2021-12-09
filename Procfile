web: bundle exec rails s -p $PORT
worker: bundle exec sidekiq -e production -C config/sidekiq.yml
release: bundle exec rake db:migrate

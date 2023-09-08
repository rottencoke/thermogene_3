#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rake db:migrate

# tempura db構築
require "./lib/assets/tempura/ruby/import_csv.rb"
ImportCsv.execute(model: Tempura, file_name: "./db/csv_data/200617_TEMPURA")
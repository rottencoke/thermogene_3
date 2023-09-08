#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rake assets:precompile
bundle exec rake assets:clean
bundle exec rake db:migrate

# TEMPURA DB構築
chmod +x run-import-csv.sh
./run-import-csv.sh
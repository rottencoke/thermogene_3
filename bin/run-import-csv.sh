#!/bin/bash

# Railsアプリケーションの環境変数を設定
export RAILS_ENV=production  

# Rubyスクリプトを実行
ruby -r "./lib/assets/tempura/ruby/import_csv.rb" -r "./app/models/tempura.rb" -r "./app/models/application_record.rb" -e "ImportCsv.execute(model: Tempura, file_name: './db/csv_data/200617_TEMPURA')"

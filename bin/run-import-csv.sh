#!/bin/bash

# TEMPURA DBの構築
# Rubyコードの実行
ruby -r "./lib/assets/tempura/ruby/import_csv.rb" -e "ImportCsv.execute(model: Tempura, file_name: '../db/csv_data/200617_TEMPURA')"
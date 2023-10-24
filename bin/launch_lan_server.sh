#!/bin/bash

# 本番環境のデータベースの作成
bin/rails db:create RAILS_ENV=production

# migrationの追加があった場合必要
bin/rails db:migrate RAILS_ENV=production

# asset（css, image）の追加があった場合必要
bin/rails assets:precompile RAILS_ENV=production

# 本番環境で8080番でサーバーを起動
bin/rails server -e production -b 0.0.0.0 -p 8080
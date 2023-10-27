#!/bin/bash

# 本番環境のデータベースの作成等の処理
## DISABLE_DATABASE_ENVIRONMENT_CHECK=1はすでにあるデータベースを削除するという意味
# bin/rails db:setup RAILS_ENV=production DISABLE_DATABASE_ENVIRONMENT_CHECK=1

# migrationの追加があった場合必要
RAILS_ENV=production bin/rails db:migrate

# asset（css, image）の追加があった場合必要
RAILS_ENV=production bin/rails assets:precompile

# 本番環境で8000番でサーバーを起動
bin/rails server -e production -b 0.0.0.0 -p 8000
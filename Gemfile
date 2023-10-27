source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.2"

gem "rails", "~> 7.0.4"
gem "sprockets-rails" # The original asset pipeline for Rails
gem "puma", "~> 5.0" # Use the Puma web server
gem "importmap-rails" # Use JavaScript with ESM import maps
gem "turbo-rails" # Hotwire's SPA-like page accelerator
gem "stimulus-rails" # Hotwire's modest JavaScript framework
gem "jbuilder" # Build JSON APIs with ease
gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ] # Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "bootsnap", require: false # Reduces boot times through caching; required in config/boot.rb
gem 'bootstrap', '~> 5.3', '>= 5.3.1' # bootstrap 5 -23/06/30 assetのエラー解決のためアプデ -23/10/25
gem 'execjs', '~> 2.8.1' # ExecJS Ruby内でjsを実行 -23/06/30
gem 'mini_racer', platforms: :ruby # Javascriptのランタイム導入 -23/06/30
gem 'pg', '~> 1.5', '>= 1.5.3' # PostgreSQL、Renderへのデプロイ用 -23/07/28
gem "activerecord-import" # CSVファイルの内容をTempuraテーブルに移すために導入 -23/08/07
gem 'spring', '~> 4.1', '>= 4.1.1' # Railsプロジェクトのpreloadする、$spring stopでフリーズ解消するため導入 -23/08/17
gem 'sassc-rails'


group :development, :test do
    # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
    gem "debug", platforms: %i[ mri mingw x64_mingw ]
end

group :development do
    # Use console on exceptions pages [https://github.com/rails/web-console]
    gem "web-console"
end

group :test do
    # Use system testing [https://guides.rubyonrails.org/testing.html#system-testing]
    gem "capybara"
    gem "selenium-webdriver"
    gem "webdrivers"
end
# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"

# javascriptファイル読み込み
pin "show_rare_codons", to: "functions/show_rare_codons/main.js"
pin "rare_codons", to: "functions/show_rare_codons/rare_codons.js"
pin "text_color", to: "functions/show_rare_codons/text_color.js"
pin "get_blastn_result", to: "functions/get_data/get_blastn_result.js"
pin "get_result", to: "functions/get_data/get_result.js"
pin "get_search_id", to: "functions/get_data/get_search_id.js"
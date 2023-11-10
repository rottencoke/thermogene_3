# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"

# javascriptファイル読み込み
## apis/
pin "get_blastn_result", to: "functions/apis/get_blastn_result.js"
pin "get_tblastn_result", to: "functions/apis/get_tblastn_result.js"
pin "get_result", to: "functions/apis/get_result.js"
pin "get_search_id", to: "functions/apis/get_search_id.js"
pin "get_search", to: "functions/apis/get_search.js"
pin "get_tempura", to: "functions/apis/get_tempura.js"

## state
pin "state", to: "functions/state/state.js"

## utils/show_rare_codons/
pin "show_rare_codons", to: "functions/utils/show_rare_codons/main.js"
pin "rare_codons", to: "functions/utils/show_rare_codons/rare_codons.js"
pin "text_color", to: "functions/utils/show_rare_codons/text_color.js"

## view/searches/
pin "searches", to: "functions/views/searches/main.js"
pin "render_condition", to: "functions/views/searches/render_condition.js"
pin "render_results", to: "functions/views/searches/render_results.js"
pin "render_result_table", to: "functions/views/searches/render_result_table.js"
pin "render_alignment", to: "functions/views/searches/render_alignment.js"
pin "render_sort_control", to: "functions/views/searches/render_sort_control.js"
pin "show_if_there", to: "functions/views/searches/show_if_there.js"

## utils/sort_results/
pin "control_sort", to: "functions/utils/sort_results/main.js"
pin "sort_results_by_bit_score", to: "functions/utils/sort_results/sort_results_by_bit_score.js"

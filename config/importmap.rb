# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"

# javascriptファイル読み込み
## apis/
pin "get_search_id", to: "functions/apis/get_search_id.js"
pin "get_search", to: "functions/apis/get_search.js"
pin "get_result", to: "functions/apis/get_result.js"
pin "get_blastn_result", to: "functions/apis/get_blastn_result.js"
pin "get_tblastn_result", to: "functions/apis/get_tblastn_result.js"
pin "get_tempura", to: "functions/apis/get_tempura.js"

## state/
pin "state", to: "functions/state/state.js"

## storage/
pin "control_result_list", to: "functions/storage/control_result_list.js"
pin "control_setting", to: "functions/storage/control_setting.js"

## utils/show_rare_codons/
pin "show_rare_codons", to: "functions/utils/show_rare_codons/main.js"
pin "rare_codons", to: "functions/utils/show_rare_codons/rare_codons.js"
pin "text_color", to: "functions/utils/show_rare_codons/text_color.js"

## utils/show_binding_site/
pin "show_binding_sites", to: "functions/utils/show_binding_sites/main.js"

## view/searches/
pin "searches", to: "functions/views/searches/main.js"
### view/searches/render_condition/
pin "render_condition", to: "functions/views/searches/render_condition/render_condition.js"
### view/searches/render_result/
pin "render_results", to: "functions/views/searches/render_result/render_results.js"
pin "render_result", to: "functions/views/searches/render_result/render_result.js"
pin "render_alignment", to: "functions/views/searches/render_result/render_alignment.js"
pin "render_multi_alignment", to: "functions/views/searches/render_result/render_multi_alignment.js"
pin "show_if_there", to: "functions/views/searches/render_result/show_if_there.js"
### view/searches/render_utils/
pin "render_sort_control", to: "functions/views/searches/render_utils/render_sort_control.js"
pin "render_filter_control", to: "functions/views/searches/render_utils/render_filter_control.js"
pin "render_setting", to: "functions/views/searches/render_utils/render_setting.js"

## view/release_note/
pin "render_release_notes", to: "functions/views/release_note/main.js"
pin "release_info", to: "functions/views/release_note/release_info.js"

## utils/sort_results/
pin "control_modal_sort", to: "functions/utils/sort_results/main.js"
pin "sort_results_by_blast_param", to: "functions/utils/sort_results/sort_results_by_blast_param.js"
pin "sort_results_by_tempura_param", to: "functions/utils/sort_results/sort_results_by_tempura_param.js"

## utils/filter_results/
pin "control_modal_filter", to: "functions/utils/filter_results/main.js"
pin "filter_results", to: "functions/utils/filter_results/filter_results.js"

## utils/settings/
pin "settings", to: "functions/utils/settings/main.js"

## utils/link_to_home/
pin "open_home_page", to: "functions/utils/link_to_home/main.js"

## utils/utils/
pin "sleep", to: "functions/utils/utils/sleep.js"

## view/icons/
pin "icons", to: "functions/views/icons/icons.js"
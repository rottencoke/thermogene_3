// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// 自作javascriptファイルの保存
import { show_rare_codons } from "show_rare_codons";
import { render_searches } from "searches";
import { control_sort } from "control_sort";
import { control_filter } from "control_filter";
import { render_results } from "render_results";
await render_searches();
await render_results();
show_rare_codons();
await control_sort();
await control_filter();
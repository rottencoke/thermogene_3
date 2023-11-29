// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

// 自作javascriptファイルの保存
import { show_rare_codons } from 'show_rare_codons';
import { render_searches } from 'searches';
import { control_modal_sort } from 'control_modal_sort';
import { control_modal_filter } from 'control_modal_filter';
import { render_results } from 'render_results';
import { control_setting } from 'settings';
import { load_setting } from 'control_setting';
import { get_state_auto_save_apply } from 'state';

// 設定の読み込み、画面の描画にも使う情報があるから一番最初に読み込む
load_setting();

// 検索条件の読み込み
await render_searches();

// 検索結果を別で読み込むことで他の部分を先に描画できる
await render_results();

// レアコドンの表示
show_rare_codons();

// ソートの設定モーダルを動かせるように
await control_modal_sort();

// フィルターの設定モーダルを動かせるように
await control_modal_filter();

// 設定のモーダルを動かせるように
control_setting();
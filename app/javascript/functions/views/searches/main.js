import { render_condition } from 'render_condition';
import { render_sort_control } from 'render_sort_control';
import { render_filter_control } from 'render_filter_control';
import { render_setting } from 'render_setting';

import { show_rare_codons } from 'show_rare_codons';
import { control_modal_sort } from 'control_modal_sort';
import { control_modal_filter } from 'control_modal_filter';
import { render_results } from 'render_results';
import { control_setting } from 'settings';
import { load_setting } from 'control_setting';

export async function render_searches() {

    // 設定の読み込み、画面の描画にも使う情報があるから一番最初に読み込む
    load_setting();

    // 検索結果は別で読み込んで、表示が遅れても他は表示できるようにする
    const html_root = /*html*/`
        ${await render_condition()}
        <hr>
        <div id="utils_control_area" class="container" style="display: flex;">
            ${await render_sort_control()}
            ${await render_filter_control()}
            ${render_setting()}
        </div>
        <div id="search_result_area" class="container"></div>
    `;

    // htmlに挿入
    document.querySelector('main').innerHTML = html_root;

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

}
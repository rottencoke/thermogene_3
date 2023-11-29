// condition_table
import { render_condition } from 'render_condition';
import { render_sort_control } from 'render_sort_control';
import { render_filter_control } from 'render_filter_control';
import { render_setting } from 'render_setting';

export async function render_searches() {

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
    `

    // htmlに挿入
    document.querySelector('main').innerHTML = html_root;

}
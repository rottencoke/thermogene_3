// condition_table
import { render_condition } from "render_condition";
import { render_sort_control } from "render_sort_control";
import { render_filter_control } from "render_filter_control";

export async function render_searches() {

    const html_root = /*html*/`
        ${await render_condition()}
        <hr>
        <div id="utils_control_area" class="container" style="display: flex;">
            ${await render_sort_control()}
            ${await render_filter_control()}
        </div>
        <div id="search_result_area" class="container"></div>
    `

    // htmlに挿入
    document.querySelector('main').innerHTML = html_root;

}

window.render_searches = render_searches;
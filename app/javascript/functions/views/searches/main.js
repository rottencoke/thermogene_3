// condition_table
import { render_condition } from "render_condition";
import { render_sort_control } from "render_sort_control";

export async function render_searches() {

    const html_root = /*html*/`
        <main>
            ${await render_condition()}
            <hr>
            ${await render_sort_control()}
            <div id="search_result_area" class="container"></div>
        </main>
    `

    // htmlに挿入
    document.getElementById('root').innerHTML = html_root;

}

window.render_searches = render_searches;
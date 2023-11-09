// condition_table
import { render_condition } from "render_condition";
import { render_results } from "render_results";

export async function render_searches() {

    console.timeStamp("render_searches");

    const root = /*html*/`
        <main>
            ${await render_condition()}
            <hr>
            ${await render_results()}
        </main>
    `

    // htmlに挿入
    document.getElementById('root').innerHTML = root;

}

window.render_searches = render_searches;
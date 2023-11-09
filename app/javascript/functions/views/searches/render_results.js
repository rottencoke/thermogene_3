import { sort_results_by_bit_score_in_descending_order } from 'sort_results';
import { render_result_table } from 'render_result_table';
import { render_alignment } from 'render_alignment';

// 結果全体
export async function render_results() {
    console.log("test in condition table");

    // bit_scoreを降順でソートしたobjectを取得
    // obj_bit_score_sorted = { blastn_result_id : [], tblastn_result_id : [], tempura_id : [] }の形式
    const obj_bit_score_sorted = await sort_results_by_bit_score_in_descending_order();
    console.dir(obj_bit_score_sorted);

    // tempuraで繰り返して、result_tableを作成する
    /// blastはどっちかわからんからややこしい
    // ソートして得られた配列のarr_tempura_idを取り出す
    const arr_tempura_id_sorted = obj_bit_score_sorted.arr_tempura_id;

    // result_table()で得られるHTML構文を入れる
    let html_results = ``;

    // arr_tempura_id_sortedの長さ分繰り返す
    for (const [index, tempura_id] of arr_tempura_id_sorted.entries()) {

        // result_table()を使ってhtmlを作っていく
        html_results += /*html*/`

            <div class="flex container">
                ${await render_result_table(obj_bit_score_sorted, index)}
                ${await render_alignment(obj_bit_score_sorted, index)}
            </div>
            <hr>
        `;

    }

    html_results = /*html*/`
        <div id="search_result_area" class="container">
            <div class="my-3">
                Hit数:${arr_tempura_id_sorted.length}
            </div>
            ${html_results}
        </div>
    `

    return html_results;
}
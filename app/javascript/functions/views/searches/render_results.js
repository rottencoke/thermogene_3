import { sort_results_by_bit_score_in_descending_order, sort_results_by_bit_score_in_ascending_order } from 'sort_results_by_bit_score';
import { render_result_table } from 'render_result_table';
import { render_alignment } from 'render_alignment';
import { get_state_sort } from "state";

// 結果全体
export async function render_results() {

    try {

        // 要素取得
        const element_search_result_area = document.getElementById('search_result_area');

        // bit_scoreを降順でソートしたobjectを取得
        // obj_result_sorted = { blastn_result_id : [], tblastn_result_id : [], tempura_id : [] }の形式
        const obj_result_sorted = await get_obj_result_sorted();
        console.dir(obj_result_sorted);

        // arr_tempura_idの長さ分繰り返して、result_tableを作成する
        /// blastはどっちかわからんからややこしい
        // ソートして得られた配列のarr_tempura_idを取り出す
        const arr_tempura_id_sorted = obj_result_sorted.arr_tempura_id;

        // result_table()で得られるHTML構文を入れる
        let html_results = ``;

        // 結果タイトル
        const result_table_title = "検索結果です";

        // arr_tempura_id_sortedの長さ分繰り返す
        for (const [index, tempura_id] of arr_tempura_id_sorted.entries()) {

            // result_table()を使ってhtmlを作っていく
            html_results += /*html*/`

                <div class="flex container">
                    ${await render_result_table(obj_result_sorted, index)}
                    ${await render_alignment(obj_result_sorted, index)}
                </div>
                <hr>
            `;

        }

        html_results = /*html*/`
            <div class="my-3">
                <p>${result_table_title}</p>
                Hit数:${arr_tempura_id_sorted.length}
            </div>
            ${html_results} 
        `

    element_search_result_area.innerHTML = html_results;

    } catch (error) {
        // エラー処理
        console.error('データの取得中にエラーが発生しました in render_results():', error);
    }
}

// ここでソートした結果を取得する
async function get_obj_result_sorted() {

    try {

        // stateの取得
        const state_sort = get_state_sort();
        console.log("state_sort : " + state_sort);
        
        // 返り値、ソートされた結果
        let obj_result_sorted = {};
        
        // ソートの関数呼び出し
        // state_sortの値に基づいて条件分岐
        if (state_sort === 'growth_temperature-descending_order') {

            console.log("growth_temperature-descending_order");

        } else if (state_sort === 'growth_temperature-ascending_order') {

            console.log("growth_temperature-ascending_order");

        } else if (state_sort === 'homology-descending_order') {

            console.log("homology-descending_order");

        } else if (state_sort === 'homology-ascending_order') {

            console.log("homology-ascending_order");

        } else if (state_sort === 'bit_score-descending_order') {

            console.log("bit_score-descending_order");
            obj_result_sorted = await sort_results_by_bit_score_in_descending_order();

        } else if (state_sort === 'bit_score-ascending_order') {

            console.log("bit_score-ascending_order");
            obj_result_sorted = await sort_results_by_bit_score_in_ascending_order();

        } else if (state_sort === 'evalue-descending_order') {

            console.log("evalue-descending_order");

        } else if (state_sort === 'evalue-ascending_order') {

            console.log("evalue-ascending_order");

        } else {

            console.log('その組み合わせはありません');
        }

        return obj_result_sorted;
        
    } catch (error) {
        // エラー処理
        console.error('データの取得中にエラーが発生しました in get_obj_result_sorted():', error);
    }
}
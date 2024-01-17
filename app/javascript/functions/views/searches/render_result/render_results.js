import { sort_results_by_blast_param } from 'sort_results_by_blast_param';
import { sort_results_by_tempura_param } from 'sort_results_by_tempura_param';
import { filter_results } from 'filter_results';
import { render_result } from 'render_result';
import { render_alignment } from 'render_alignment';
import { render_multi_alignment, check_deletion_query_sequence } from 'render_multi_alignment';
import { get_state_sort, get_state_setting_view } from 'state';
import { save_csv } from 'save_csv';

// 結果全体
export async function render_results() {

    try {

        // 要素取得
        const element_search_result_area = document.getElementById('search_result_area');

        // bit_scoreを降順でソートしたobjectを取得
        // obj_result_sorted = { blastn_result_id : [], tblastn_result_id : [], tempura_id : [] }の形式
        const obj_result_sorted = await get_obj_result_sorted();

        // arr_tempura_idの長さ分繰り返して、result_tableを作成する
        /// blastはどっちかわからんからややこしい
        // ソートして得られた配列のarr_tempura_idを取り出す
        const arr_tempura_id_sorted = obj_result_sorted.arr_tempura_id;

        // result_table()で得られるHTML構文を入れる
        let html_results = ``;

        // 文字
        const result_table_title = "検索結果です";
        const th_genus_and_species = "生物種名";
        const th_strain = "株名";
        const th_topt = "生育温度";
        const th_protein = "タンパク質名";
        const th_evalue = "E Value";
        const th_identity = "相同性";
        const th_bit_score = "Bit Score";
        const th_query_coverage = "Query Cover";

        // state_setting_viewの取得
        const state_setting_view = get_state_setting_view();

        // 表示形式view_styleによって結果表示の形式を変更する
        // 表示形式1 : 生物情報&アライメント情報&アライメント
        if (state_setting_view == "organismInfo_alignmentInfo_alignment") {

            // arr_tempura_id_sortedの長さ分繰り返す
            for (const [index, tempura_id] of arr_tempura_id_sorted.entries()) {
            
                // result_table()を使ってhtmlを作っていく
                html_results += /*html*/`

                    <div class="flex container">
                        ${await render_result(obj_result_sorted, index, 1)}
                        ${await render_alignment(obj_result_sorted, index)}
                    </div>
                    <hr>
                `;
            }
        }
        // 表示形式2 : 生物情報&アライメント情報
        else if (state_setting_view == "organismInfo_alignmentInfo") {

            // なぜかhtml_resultsに各行の情報を先に入れると表外に文字が生成されるから変数作成
            let html_results_raw = ``;

            // arr_tempura_id_sortedの長さ分繰り返す
            for (const [index, tempura_id] of arr_tempura_id_sorted.entries()) {

                html_results_raw += await render_result(obj_result_sorted, index, 2);

            }

            html_results += /*html*/`
                <div id="result_table_organismInfo_alignmentInfo" class="container">
                    <table>
                        <tr>
                            <td></td>
                            <th scope="col">${th_genus_and_species}</th>
                            <th scope="col">${th_strain}</th>
                            <th scope="col">${th_topt}</th>
                            <th scope="col">${th_protein}</th>
                            <th scope="col">${th_evalue}</th>
                            <th scope="col">${th_identity}</th>
                            <th scope="col">${th_query_coverage}</th>
                            <th scope="col">${th_bit_score}</th>
                        </tr>
                        ${html_results_raw}
                    </table>
                </div>
            `;
        }
        // 表示形式3 : マルチアライメント
        else if (state_setting_view == "multiAlignment") {

            const arr_deletion = await check_deletion_query_sequence(obj_result_sorted);

            // なぜかhtml_resultsに各行の情報を先に入れると表外に文字が生成されるから変数作成
            let html_results_raw = ``;

            // arr_tempura_id_sortedの長さ分繰り返す
            for (const [index, tempura_id] of arr_tempura_id_sorted.entries()) {

                html_results_raw += await render_multi_alignment(obj_result_sorted, index, arr_deletion);

            }

            html_results += /*html*/`
                <div class="container">
                    <p>Query : 検索に使用した配列のどの部分に対して、Hitした配列がアライメントを形成しているかを示しています</p>
                    <p>※黒太字 : 一致した塩基orアミノ残基、灰太字 : 化学的性質の類似したアミノ残基、黒細字 : 一致していない塩基orアミノ残基</p>
                    <p>「shift + スクロール」で横スクロールが可能です</p>
                </div>
                <div id="result_table_multiAlignment" class="horizontal_scrollable container">
                    <table>
                        ${html_results_raw}
                    </table>
                </div>
            `;
        }
        else {
            console.log("その表示形式には対応していません");
        }

        html_results = /*html*/`
            <div class="my-3">
                <p>${result_table_title}</p>
                Hit数:${arr_tempura_id_sorted.length}
            </div>
            ${html_results} 
        `
        // htmlを追加
        element_search_result_area.innerHTML = html_results;

        // csvファイル作成に用いる結果を渡す
        save_csv(obj_result_sorted);
        
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
        
        // ソートされた結果
        let obj_result_sorted = {};

        // ソート後の結果をフィルターにかけた結果
        let obj_result_sorted_filtered = {};
        
        // ソートの関数呼び出し
        // state_sortの値に基づいて条件分岐
        if (state_sort === 'growth_temperature-descending_order') {

            obj_result_sorted = await sort_results_by_tempura_param("growth_temperature", "descending");

        } else if (state_sort === 'growth_temperature-ascending_order') {

            obj_result_sorted = await sort_results_by_tempura_param("growth_temperature", "ascending");

        } else if (state_sort === 'identity-descending_order') {

            obj_result_sorted = await sort_results_by_blast_param("identity", "descending");

        } else if (state_sort === 'identity-ascending_order') {

            obj_result_sorted = await sort_results_by_blast_param("identity", "ascending");

        } else if (state_sort === 'bit_score-descending_order') {

            obj_result_sorted = await sort_results_by_blast_param("bit_score", "descending");

        } else if (state_sort === 'bit_score-ascending_order') {

            obj_result_sorted = await sort_results_by_blast_param("bit_score", "ascending");

        } else if (state_sort === 'evalue-descending_order') {

            obj_result_sorted = await sort_results_by_blast_param("evalue", "descending");

        } else if (state_sort === 'evalue-ascending_order') {

            obj_result_sorted = await sort_results_by_blast_param("evalue", "ascending");

        }

        // フィルターにかける
        obj_result_sorted_filtered = await filter_results(obj_result_sorted);

        return obj_result_sorted_filtered;
        
    } catch (error) {
        // エラー処理
        console.error('データの取得中にエラーが発生しました in get_obj_result_sorted():', error);
    }
}
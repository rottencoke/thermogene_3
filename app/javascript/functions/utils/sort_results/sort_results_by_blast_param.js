import { get_result } from 'get_result';
import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';

export async function sort_results_by_blast_param(blast_param, order) {

    // APIでresultの取得
    const result = await get_result();

    // resultから各種idの取得、配列
    const arr_blastn_result_id = result.blastn_result_id;
    const arr_tblastn_result_id = result.tblastn_result_id;
    const arr_tempura_id = result.tempura_id;

    // 返り値の各種変数の作成
    let arr_blastn_result_id_sorted = [];
    let arr_tblastn_result_id_sorted = [];
    let arr_tempura_id_sorted = [];

    // ${blast_param}で昇順でソート
    /// blastnの場合
    if (arr_blastn_result_id.length) {

        // bit_scoreを格納した新しい配列を作成
        let arr_blastn_result_indexed = [];

        // APIでblastn_resultの取得
        for (const [index, id] of arr_blastn_result_id.entries()) {
            const blastn_result = await get_blastn_result(id);
            arr_blastn_result_indexed.push({
                index,
                id: id,
                blast_param: blastn_result[blast_param]
            });
        };

        // 新しい配列をbit_scoreに基づいてソート
        /// 降順
        if (order == "descending") {
            arr_blastn_result_indexed.sort((a, b) => b.blast_param - a.blast_param);
        }
        /// 昇順
        else if (order == "ascending") {
            arr_blastn_result_indexed.sort((a, b) => a.blast_param - b.blast_param);
        }

        // blastn_result_indexedのidを取り出して配列化
        arr_blastn_result_id_sorted = arr_blastn_result_indexed.map(obj => obj.id);

        // ソートされたインデックスを使用してtempura_idを並び替え
        arr_tempura_id_sorted = arr_blastn_result_indexed.map(item => arr_tempura_id[item.index]);

    }

    /// tblastnの場合
    else if (arr_tblastn_result_id.length) {

        // bit_scoreを格納した新しい配列を作成
        let arr_tblastn_result_indexed = [];

        // APIでtblastn_resultの取得
        for (const [index, id] of arr_tblastn_result_id.entries()) {
            const tblastn_result = await get_tblastn_result(id);
            arr_tblastn_result_indexed.push({
                index,
                id: id,
                blast_param: tblastn_result[blast_param]
            });
        };

        // 新しい配列をbit_scoreに基づいてソート
        /// 降順
        if (order == "descending") {
            arr_tblastn_result_indexed.sort((a, b) => b.blast_param - a.blast_param);
        }
        /// 昇順
        else if (order == "ascending") {
            arr_tblastn_result_indexed.sort((a, b) => a.blast_param - b.blast_param);
        }

        // tblastn_result_indexedのidを取り出して配列化
        arr_tblastn_result_id_sorted = arr_tblastn_result_indexed.map(obj => obj.id);

        // ソートされたインデックスを使用してtempura_idを並び替え
        arr_tempura_id_sorted = arr_tblastn_result_indexed.map(item => arr_tempura_id[item.index]);
    }

    // 返り値、object
    return {
        arr_blastn_result_id: arr_blastn_result_id_sorted,
        arr_tblastn_result_id: arr_tblastn_result_id_sorted,
        arr_tempura_id: arr_tempura_id_sorted
    };
}
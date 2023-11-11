import { get_result } from 'get_result';
import { get_tempura } from 'get_tempura';

export async function sort_results_by_tempura_param(tempura_param, order) {

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

    // bit_scoreを格納した新しい配列を作成
    let arr_tempura_indexed = [];

    // tempura_paramの変換
    /// 生育温度の場合、[topt_ave]にする
    if (tempura_param == "growth_temperature") tempura_param = "topt_ave";

    // APIでtempuraの取得
    for (const [index, id] of arr_tempura_id.entries()) {
        const tempura = await get_tempura(id);
        arr_tempura_indexed.push({
            index,
            id: id,
            tempura_param: tempura[tempura_param]
        });
    };

    // 新しい配列をbit_scoreに基づいてソート
    /// 降順
    if (order == "descending") {
        arr_tempura_indexed.sort((a, b) => b.tempura_param - a.tempura_param);
    }
    /// 昇順
    else if (order == "ascending") {
        arr_tempura_indexed.sort((a, b) => a.tempura_param - b.tempura_param);
    }

    // arr_tempura_indexedのidを取り出して配列化
    arr_tempura_id_sorted = arr_tempura_indexed.map(obj => obj.id);

    // ${tempura_param}で昇順でソート
    /// blastnの場合
    if (arr_blastn_result_id.length) {

        // ソートされたインデックスを使用してarr_blastn_result_idを並び替え
        arr_blastn_result_id_sorted = arr_tempura_indexed.map(item => arr_blastn_result_id[item.index]);

    }

    /// tblastnの場合
    else if (arr_tblastn_result_id.length) {

        // ソートされたインデックスを使用してarr_tblastn_result_idを並び替え
        arr_tblastn_result_id_sorted = arr_tempura_indexed.map(item => arr_tblastn_result_id[item.index]);
    }

    // 返り値、object
    return {
        arr_blastn_result_id: arr_blastn_result_id_sorted,
        arr_tblastn_result_id: arr_tblastn_result_id_sorted,
        arr_tempura_id: arr_tempura_id_sorted
    };
}
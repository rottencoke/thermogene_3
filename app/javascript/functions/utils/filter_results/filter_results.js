import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';
import { get_tempura } from 'get_tempura';
import { get_state_filter } from "state";

// ソートされた結果のidのオブジェクトをstateの条件でフィルターして返す
export async function filter_results(obj_sorted) {

    console.log("フィルター前");
    console.dir(obj_sorted);

    // state_filterの値を取得
    let arr_state_filter = [];
    const state_filter = get_state_filter();

    // state_filterが何も設定されてないときは、そのままobjを返す
    if (state_filter.length == 0) return obj_sorted;

    for (let i = 0; i < state_filter.length; i++) {

        // filterの値だけevalueのこともあるから別で処理する
        let filter_limit_evalue = state_filter[i].split('-')[1];
        if (state_filter[i].split('-')[0] == "evalue") {
            const value_raw_evalue = `${filter_limit_evalue}e-${state_filter[i].split('-')[3]}`;
            filter_limit_evalue = parseFloat(value_raw_evalue);
        }
        arr_state_filter[i] = {
            filter_select: state_filter[i].split('-')[0],
            filter_limit_value: filter_limit_evalue,
            filter_limit_type: state_filter[i].split('-')[2],
        };

        console.dir(arr_state_filter[i]);
    }

    // obj_sortedから各種idの取得、配列
    let arr_blastn_result_id_filtered = obj_sorted.arr_blastn_result_id;
    let arr_tblastn_result_id_filtered = obj_sorted.arr_tblastn_result_id;
    let arr_tempura_id_filtered = obj_sorted.arr_tempura_id;

    // フィルター可能なparam一覧
    const arr_blast_param_acceptable = ["identity", "bit_score", "evalue"];
    const arr_tempura_param_acceptable = ["growth_temperature"];

    // arr_state_filterの数分繰り返して、フィルターを実行していく
    for (let i = 0; i < arr_state_filter.length; i++) {
        
        let filter_param = arr_state_filter[i].filter_select;

        // blastのparamの場合
        if (arr_blast_param_acceptable.includes(filter_param)) {

            // blastの種類ごとにindexとparamを格納した配列を作成            
            /// [1] blastnの場合
            if (arr_blastn_result_id_filtered.length) {

                // blast_paramを格納した新しい配列を作成
                let arr_blastn_result_indexed = [];

                // APIでblastn_resultの取得
                for (const [index, id] of arr_blastn_result_id_filtered.entries()) {
                    const blastn_result = await get_blastn_result(id);
                    arr_blastn_result_indexed.push({
                        index,
                        id: id,
                        param: parseFloat(blastn_result[filter_param]) // evalue用にparseFloat()にしてる
                    });
                    console.log("param : " + parseFloat(blastn_result[filter_param]));
                };

                // フィルターを実行
                const arr_blastn_result_id_indexed_filtered = filter_arr(arr_blastn_result_indexed, i);

                // arr_blastn_result_id_filtered
                arr_blastn_result_id_filtered = arr_blastn_result_id_indexed_filtered.map(obj => obj.id);

                // フィルターされたインデックスを使用してtempura_idを並び替え
                arr_tempura_id_filtered = arr_blastn_result_id_indexed_filtered.map(item => arr_tempura_id_filtered[item.index]);

            }
            /// [2] tblastnの場合
            else if (arr_tblastn_result_id_filtered.length) {

                // blast_paramを格納した新しい配列を作成
                let arr_tblastn_result_indexed = [];
        
                // APIでtblastn_resultの取得
                for (const [index, id] of arr_tblastn_result_id_filtered.entries()) {
                    const tblastn_result = await get_tblastn_result(id);
                    arr_tblastn_result_indexed.push({
                        index,
                        id: id,
                        param: parseFloat(tblastn_result[filter_param]) // evalue用にparseFloat()にしてる
                    });
                };

                // フィルターを実行
                const arr_tblastn_result_id_indexed_filtered = filter_arr(arr_tblastn_result_indexed, i);

                // arr_tblastn_result_id_filtered
                arr_tblastn_result_id_filtered = arr_tblastn_result_id_indexed_filtered.map(obj => obj.id);

                // フィルターされたインデックスを使用してtempura_idを並び替え
                arr_tempura_id_filtered = arr_tblastn_result_id_indexed_filtered.map(item => arr_tempura_id_filtered[item.index]);
            }

        }
        // [3] tempuraのparamの場合
        else if (arr_tempura_param_acceptable.includes(filter_param)) {
            
            // tempura_paramを格納した新しい配列を作成
            let arr_tempura_indexed = [];

            // filter_paramが生育温度の場合、topt_aveにする
            if (filter_param == "growth_temperature") filter_param = "topt_ave";

            // APIでtempuraの取得
            for (const [index, id] of arr_tempura_id_filtered.entries()) {
                const tempura = await get_tempura(id);
                arr_tempura_indexed.push({
                    index,
                    id: id,
                    param: tempura[filter_param]
                });
            };

            // フィルターを実行
            const arr_tempura_id_indexed_filtered = filter_arr(arr_tempura_indexed, i);

            arr_tempura_id_filtered = arr_tempura_id_indexed_filtered.map(obj => obj.id);

            // フィルターされたインデックスを使用してarr_blast_result_idを並び替え
            /// blastnの場合
            if (arr_blastn_result_id_filtered.length) {
                arr_blastn_result_id_filtered = arr_tempura_id_indexed_filtered.map(item => arr_blastn_result_id_filtered[item.index]);
            }
            /// tblastnの場合
            else if (arr_tblastn_result_id_filtered.length) {
                arr_tblastn_result_id_filtered = arr_tempura_id_indexed_filtered.map(item => arr_tblastn_result_id_filtered[item.index]);
            }
        }
    }

    const obj_return = {
        arr_blastn_result_id: arr_blastn_result_id_filtered,
        arr_tblastn_result_id: arr_tblastn_result_id_filtered,
        arr_tempura_id: arr_tempura_id_filtered
    };

    console.log("フィルター後");
    console.dir(obj_return);

    return obj_return

    // フィルター部分の関数
    function filter_arr(arr, i) {

        let arr_filtered = [];

        const num_filter_limit_value = arr_state_filter[i].filter_limit_value;

        /// フィルターが gte「以上」の場合
        if (arr_state_filter[i].filter_limit_type == "gte") {
            arr_filtered = arr.filter(obj => obj.param >= num_filter_limit_value);
        }
        /// フィルターがlte「以下」の場合
        else if (arr_state_filter[i].filter_limit_type == "lte") {
            arr_filtered = arr.filter(obj => obj.param <= num_filter_limit_value);
        }

        console.log(`arr_filtered[${i}]`);
        console.dir(arr_filtered);

        return arr_filtered;
    }
}
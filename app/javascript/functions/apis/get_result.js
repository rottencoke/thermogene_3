import { get_search_id } from 'get_search_id'; // search_idの取得
import { load_result_list, save_result_list } from 'control_result_list';

// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_result() {

    // search_idを取得
    const search_id = get_search_id();

    // session storageに情報が保存されてないか確認する
    const obj_ss_result = load_result_list(search_id, 'result', );

    /// 保存されている場合
    if (obj_ss_result) {

        return {
            id: obj_ss_result.id,
            search_id: obj_ss_result.search_id,
            tempura_id: obj_ss_result.tempura_id,
            blastn_result_id: obj_ss_result.blastn_result_id,
            tblastn_result_id: obj_ss_result.tblastn_result_id
        };
    }
    /// 保存されていない場合
    else {
        try {

            // APIを呼び出してresultを取得する
            const response = await axios.get(`/data/get_result/${search_id}`);

            // responseからオブジェクトの作成
            const obj_response = {
                id: response.data.id,
                search_id: search_id,
                tempura_id: response.data.tempura_id,
                blastn_result_id: response.data.blastn_result_id,
                tblastn_result_id: response.data.tblastn_result_id
            }

            // session storageに保存
            save_result_list(search_id, 'result', obj_response);

            // 返り値            
            return obj_response;

        } catch (error) {
            console.error('Error:', error);
        } 
    }

    

}

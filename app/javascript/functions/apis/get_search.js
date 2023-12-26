import { get_search_id } from 'get_search_id'; // search_idの取得
import { load_result_list, save_result_list } from 'control_result_list';

// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_search() {

    // search_idを取得
    const search_id = get_search_id();

    if (!search_id) return;

    // session storageに情報が保存されてないか確認する
    const obj_ss_search = load_result_list(search_id, 'search',);

    /// 保存されている場合
    if (obj_ss_search) {

        return {
            id: obj_ss_search.search_id,
            jobtitle: obj_ss_search.jobtitle,
            temperature_minimum: obj_ss_search.temperature_minimum,
            temperature_maximum: obj_ss_search.temperature_maximum,
            sequence: obj_ss_search.sequence,
            search_method: obj_ss_search.search_method,
            search_blast_engine: obj_ss_search.search_blast_engine,
            identity_minimum: obj_ss_search.identity_minimum,
            identity_maximum: obj_ss_search.identity_maximum,
            evalue_minimum: obj_ss_search.evalue_minimum,
            evalue_maximum: obj_ss_search.evalue_maximum,
            created_at: obj_ss_search.created_at
        }
    }
    /// 保存されていない場合
    else {
        try {

            // APIを呼び出してresultを取得する
            const response = await axios.get(`/data/get_search/${search_id}`);
    
            // responseからオブジェクトの作成   
            const obj_response =  {
                id: search_id,
                jobtitle: response.data.jobtitle,
                temperature_minimum: response.data.temp_minimum,
                temperature_maximum: response.data.temp_maximum,
                sequence: response.data.sequence,
                search_method: response.data.search_method,
                search_blast_engine: response.data.search_blast_engine,
                identity_minimum: response.data.identity_minimum,
                identity_maximum: response.data.identity_maximum,
                evalue_minimum: response.data.eValue_minimum,
                evalue_maximum: response.data.eValue_maximum,
                created_at: response.data.created_at
            };

            // session storageに保存
            save_result_list(search_id, 'search', obj_response);

            // 返り値
            return obj_response;
    
        } catch (error) {
            console.error('Error:', error);
        }
    }

    

}

import { get_search_id } from 'get_search_id'; // search_idの取得

// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_result() {

    console.log("get_result started");

    // search_idを取得
    const search_id = get_search_id();

    try {

        // APIを呼び出してresultを取得する
        const response = await axios.get(`/data/get_result/${search_id}`);

        // resultのid
        const response_result_id = response.data.id;

        // tempura_id
        const response_tempura_id = response.data.tempura_id;

        // blastn_result_id
        const response_blastn_result_id = response.data.blastn_result_id;

        // tblastn_result_id
        const response_tblastn_result_id = response.data.tblastn_result_id;

        return {
            search_id: search_id,
            result_id: response_result_id,
            tempura_id: response_tempura_id,
            blastn_result_id: response_blastn_result_id,
            tblastn_result_id: response_tblastn_result_id
        };

    } catch (error) {
        console.error('Error:', error);
    }

}

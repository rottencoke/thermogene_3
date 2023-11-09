import { get_search_id } from 'get_search_id'; // search_idの取得

// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_search() {

    // search_idを取得
    const search_id = get_search_id();

    try {

        // APIを呼び出してresultを取得する
        const response = await axios.get(`/data/get_search/${search_id}`);

        // データの代入
        const response_jobtitle = response.data.jobtitle;
        const response_temperature_minimum = response.data.temp_minimum;
        const response_temperature_maximum = response.data.temp_maximum;
        const response_sequence = response.data.sequence;
        const response_search_method = response.data.search_method;
        const response_search_blast_engine = response.data.search_blast_engine;
        const response_identity_minimum = response.data.identity_minimum;
        const response_identity_maximum = response.data.identity_maximum;
        const response_evalue_minimum = response.data.eValue_minimum;
        const response_evalue_maximum = response.data.eValue_maximum;
        const response_created_at = response.data.created_at;

        return {
            id: search_id,
            jobtitle: response_jobtitle,
            temperature_minimum: response_temperature_minimum,
            temperature_maximum: response_temperature_maximum,
            sequence: response_sequence,
            search_method: response_search_method,
            search_blast_engine: response_search_blast_engine,
            identity_minimum: response_identity_minimum,
            identity_maximum: response_identity_maximum,
            evalue_minimum: response_evalue_minimum,
            evalue_maximum: response_evalue_maximum,
            created_at: response_created_at
        };

    } catch (error) {
        console.error('Error:', error);
    }

}

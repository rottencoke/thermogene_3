// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_blastn_result(blastn_result_id) {

    try {

        // APIを呼び出してblastn_resultを取得する
        const response = await axios.get(`/data/get_blastn_result/${blastn_result_id}`);

        // hit_strand
        const response_hit_strand = response.data.hit_strand;

        // hit_from
        const response_hit_from = response.data.hit_from;

        // hit_to
        const response_hit_to = response.data.hit_to;

        // hseq
        const response_hseq = response.data.hseq;

        return {
            hit_strand: response_hit_strand,
            hit_from: response_hit_from,
            hit_to: response_hit_to,
            hseq: response_hseq
        };

    } catch (error) {
        console.error('Error:', error);
    }

}

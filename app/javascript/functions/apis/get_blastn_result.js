// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_blastn_result(blastn_result_id) {

    try {

        // APIを呼び出してblastn_resultを取得する
        const response = await axios.get(`/data/get_blastn_result/${blastn_result_id}`);

        // 変数の定義
        const response_accession = response.data.accession;
        const response_gene = response.data.gene;
        const response_locus_tag = response.data.locus_tag;
        const response_protein = response.data.protein;
        const response_protein_id = response.data.protein_id;
        const response_location = response.data.location;
        const response_gbkey = response.data.gbkey;
        const response_assembly = response.data.assembly;
        const response_bit_score = response.data.bit_score;
        const response_score = response.data.score;
        const response_evalue = response.data.evalue;
        const response_identity = response.data.identity;
        const response_query_from = response.data.query_from;
        const response_query_to = response.data.query_to;
        const response_query_strand = response.data.query_strand;
        const response_hit_from = response.data.hit_from;
        const response_hit_to = response.data.hit_to;
        const response_hit_strand = response.data.hit_strand;
        const response_align_len = response.data.align_len;
        const response_gaps = response.data.gaps;
        const response_midline = response.data.midline;
        const response_hseq = response.data.hseq;
        const response_qseq = response.data.qseq;
        const response_created_at = response.data.created_at;
        const response_updated_at = response.data.updated_at;
        const response_request_id = response.data.request_id;
        const response_program = response.data.program;
        const response_version = response.data.version;
        const response_reference = response.data.reference;
        const response_db = response.data.db;
        const response_expect = response.data.expect;
        const response_sc_match = response.data.sc_match;
        const response_sc_mismatch = response.data.sc_mismatch;
        const response_gap_open = response.data.gap_open;
        const response_gap_extend = response.data.gap_extend;
        const response_filter = response.data.filter;
        const response_query_id = response.data.query_id;
        const response_query_len = response.data.query_len;
        const response_num = response.data.num;

        // オブジェクトとしてまとめる
        const responseObject = {
            accession: response_accession,
            gene: response_gene,
            locus_tag: response_locus_tag,
            protein: response_protein,
            protein_id: response_protein_id,
            location: response_location,
            gbkey: response_gbkey,
            assembly: response_assembly,
            bit_score: response_bit_score,
            score: response_score,
            evalue: response_evalue,
            identity: response_identity,
            query_from: response_query_from,
            query_to: response_query_to,
            query_strand: response_query_strand,
            hit_from: response_hit_from,
            hit_to: response_hit_to,
            hit_strand: response_hit_strand,
            align_len: response_align_len,
            gaps: response_gaps,
            midline: response_midline,
            hseq: response_hseq,
            qseq: response_qseq,
            created_at: response_created_at,
            updated_at: response_updated_at,
            request_id: response_request_id,
            program: response_program,
            version: response_version,
            reference: response_reference,
            db: response_db,
            expect: response_expect,
            sc_match: response_sc_match,
            sc_mismatch: response_sc_mismatch,
            gap_open: response_gap_open,
            gap_extend: response_gap_extend,
            filter: response_filter,
            query_id: response_query_id,
            query_len: response_query_len,
            num: response_num
        };

        return responseObject;


    } catch (error) {
        console.error('Error:', error);
    }

}

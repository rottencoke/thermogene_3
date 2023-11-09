// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_tblastn_result(tblastn_result_id) {

    try {

        // APIを呼び出してblastn_resultを取得する
        const response = await axios.get(`/data/get_tblastn_result/${tblastn_result_id}`);

        // request_id
        const response_request_id = response.data.request_id;

        // program
        const response_program = response.data.program;

        // version
        const response_version = response.data.version;

        // reference
        const response_reference = response.data.reference;

        // db
        const response_db = response.data.db;

        // expect
        const response_expect = response.data.expect;

        // gap_open
        const response_gap_open = response.data.gap_open;

        // matrix
        const response_matrix = response.data.matrix;

        // gap_extend
        const response_gap_extend = response.data.gap_extend;

        // filter
        const response_filter = response.data.filter;

        // cbs
        const response_cbs = response.data.cbs;

        // db_gencode
        const response_db_gencode = response.data.db_gencode;

        // query_id
        const response_query_id = response.data.query_id;

        // query_title
        const response_query_title = response.data.query_title;

        // query_len
        const response_query_len = response.data.query_len;

        // num
        const response_num = response.data.num;

        // accession
        const response_accession = response.data.accession;

        // gene
        const response_gene = response.data.gene;

        // locus_tag
        const response_locus_tag = response.data.locus_tag;

        // protein
        const response_protein = response.data.protein;

        // protein_id
        const response_protein_id = response.data.protein_id;

        // location
        const response_location = response.data.location;

        // gbkey
        const response_gbkey = response.data.gbkey;

        // assembly
        const response_assembly = response.data.assembly;

        // bit_score
        const response_bit_score = response.data.bit_score;

        // score
        const response_score = response.data.score;

        // evalue
        const response_evalue = response.data.evalue;

        // identity
        const response_identity = response.data.identity;

        // positive
        const response_positive = response.data.positive;

        // query_from
        const response_query_from = response.data.query_from;

        // query_to
        const response_query_to = response.data.query_to;

        // hit_from
        const response_hit_from = response.data.hit_from;

        // hit_to
        const response_hit_to = response.data.hit_to;

        // hit_frame
        const response_hit_frame = response.data.hit_frame;

        // align_len
        const response_align_len = response.data.align_len;

        // gaps
        const response_gaps = response.data.gaps;

        // midline
        const response_midline = response.data.midline;

        // hseq
        const response_hseq = response.data.hseq;

        // qseq
        const response_qseq = response.data.qseq;


        return {
            request_id: response_request_id,
            program: response_program,
            version: response_version,
            reference: response_reference,
            db: response_db,
            expect: response_expect,
            gap_open: response_gap_open,
            matrix: response_matrix,
            gap_extend: response_gap_extend,
            filter: response_filter,
            cbs: response_cbs,
            db_gencode: response_db_gencode,
            query_id: response_query_id,
            query_title: response_query_title,
            query_len: response_query_len,
            num: response_num,
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
            positive: response_positive,
            query_from: response_query_from,
            query_to: response_query_to,
            hit_from: response_hit_from,
            hit_to: response_hit_to,
            hit_frame: response_hit_frame,
            align_len: response_align_len,
            gaps: response_gaps,
            midline: response_midline,
            hseq: response_hseq,
            qseq: response_qseq
        };

    } catch (error) {
        console.error('Error:', error);
    }

}

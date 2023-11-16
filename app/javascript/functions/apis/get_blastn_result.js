import { get_search_id } from 'get_search_id'; // search_idの取得
import { load_storage, save_storage } from 'control_storage';

// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_blastn_result(blastn_result_id) {

    // 数字以外のidの場合return
    if (!Number.isFinite(blastn_result_id)) return;

    // search_idを取得
    const search_id = get_search_id();

    // session storageに情報が保存されてないか確認する
    const obj_ss_blastn_result = load_storage(search_id, 'blastn_result', blastn_result_id);

    /// 保存されている場合
    if (obj_ss_blastn_result) {
        return {
            id: blastn_result_id,
            accession: obj_ss_blastn_result.accession,
            gene: obj_ss_blastn_result.gene,
            locus_tag: obj_ss_blastn_result.locus_tag,
            protein: obj_ss_blastn_result.protein,
            protein_id: obj_ss_blastn_result.protein_id,
            location: obj_ss_blastn_result.location,
            gbkey: obj_ss_blastn_result.gbkey,
            assembly: obj_ss_blastn_result.assembly,
            bit_score: obj_ss_blastn_result.bit_score,
            score: obj_ss_blastn_result.score,
            evalue: obj_ss_blastn_result.evalue,
            identity: obj_ss_blastn_result.identity,
            query_from: obj_ss_blastn_result.query_from,
            query_to: obj_ss_blastn_result.query_to,
            query_strand: obj_ss_blastn_result.query_strand,
            hit_from: obj_ss_blastn_result.hit_from,
            hit_to: obj_ss_blastn_result.hit_to,
            hit_strand: obj_ss_blastn_result.hit_strand,
            align_len: obj_ss_blastn_result.align_len,
            gaps: obj_ss_blastn_result.gaps,
            midline: obj_ss_blastn_result.midline,
            hseq: obj_ss_blastn_result.hseq,
            qseq: obj_ss_blastn_result.qseq,
            created_at: obj_ss_blastn_result.created_at,
            updated_at: obj_ss_blastn_result.updated_at,
            request_id: obj_ss_blastn_result.request_id,
            program: obj_ss_blastn_result.program,
            version: obj_ss_blastn_result.version,
            reference: obj_ss_blastn_result.reference,
            db: obj_ss_blastn_result.db,
            expect: obj_ss_blastn_result.expect,
            sc_match: obj_ss_blastn_result.sc_match,
            sc_mismatch: obj_ss_blastn_result.sc_mismatch,
            gap_open: obj_ss_blastn_result.gap_open,
            gap_extend: obj_ss_blastn_result.gap_extend,
            filter: obj_ss_blastn_result.filter,
            query_id: obj_ss_blastn_result.query_id,
            query_len: obj_ss_blastn_result.query_len,
            num: obj_ss_blastn_result.num
        };
    }
    /// 保存されていない場合
    else {
        try {

            // APIを呼び出してblastn_resultを取得する
            const response = await axios.get(`/data/get_blastn_result/${blastn_result_id}`);

            // responseからオブジェクトの作成
            const obj_response = {
                id: blastn_result_id,
                accession: response.data.accession,
                gene: response.data.gene,
                locus_tag: response.data.locus_tag,
                protein: response.data.protein,
                protein_id: response.data.protein_id,
                location: response.data.location,
                gbkey: response.data.gbkey,
                assembly: response.data.assembly,
                bit_score: response.data.bit_score,
                score: response.data.score,
                evalue: response.data.evalue,
                identity: response.data.identity,
                query_from: response.data.query_from,
                query_to: response.data.query_to,
                query_strand: response.data.query_strand,
                hit_from: response.data.hit_from,
                hit_to: response.data.hit_to,
                hit_strand: response.data.hit_strand,
                align_len: response.data.align_len,
                gaps: response.data.gaps,
                midline: response.data.midline,
                hseq: response.data.hseq,
                qseq: response.data.qseq,
                created_at: response.data.created_at,
                updated_at: response.data.updated_at,
                request_id: response.data.request_id,
                program: response.data.program,
                version: response.data.version,
                reference: response.data.reference,
                db: response.data.db,
                expect: response.data.expect,
                sc_match: response.data.sc_match,
                sc_mismatch: response.data.sc_mismatch,
                gap_open: response.data.gap_open,
                gap_extend: response.data.gap_extend,
                filter: response.data.filter,
                query_id: response.data.query_id,
                query_len: response.data.query_len,
                num: response.data.num
            };

            // session storageに保存
            save_storage(search_id, 'blastn_result', obj_response);

            // 返り値
            return obj_response;


        } catch (error) {
            console.error('Error:', error);
        } 
    }
    

}

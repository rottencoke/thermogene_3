import { get_search_id } from 'get_search_id'; // search_idの取得
import { load_result_list, save_result_list } from 'control_result_list';

// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_tblastn_result(tblastn_result_id) {

    // 数字以外のidの場合return
    if (!Number.isFinite(tblastn_result_id)) return;

    // search_idを取得
    const search_id = get_search_id();

    // session storageに情報が保存されてないか確認する
    const obj_ss_tblastn_result = load_result_list(search_id, 'tblastn_result', tblastn_result_id);

    /// 保存されている場合
    if (obj_ss_tblastn_result) {
        
        return {
            id: obj_ss_tblastn_result.id,
            request_id: obj_ss_tblastn_result.request_id,
            program: obj_ss_tblastn_result.program,
            version: obj_ss_tblastn_result.version,
            reference: obj_ss_tblastn_result.reference,
            db: obj_ss_tblastn_result.db,
            expect: obj_ss_tblastn_result.expect,
            gap_open: obj_ss_tblastn_result.gap_open,
            matrix: obj_ss_tblastn_result.matrix,
            gap_extend: obj_ss_tblastn_result.gap_extend,
            filter: obj_ss_tblastn_result.filter,
            cbs: obj_ss_tblastn_result.cbs,
            db_gencode: obj_ss_tblastn_result.db_gencode,
            query_id: obj_ss_tblastn_result.query_id,
            query_title: obj_ss_tblastn_result.query_title,
            query_len: obj_ss_tblastn_result.query_len,
            num: obj_ss_tblastn_result.num,
            accession: obj_ss_tblastn_result.accession,
            gene: obj_ss_tblastn_result.gene,
            locus_tag: obj_ss_tblastn_result.locus_tag,
            protein: obj_ss_tblastn_result.protein,
            protein_id: obj_ss_tblastn_result.protein_id,
            location: obj_ss_tblastn_result.location,
            gbkey: obj_ss_tblastn_result.gbkey,
            assembly: obj_ss_tblastn_result.assembly,
            bit_score: obj_ss_tblastn_result.bit_score,
            score: obj_ss_tblastn_result.score,
            evalue: obj_ss_tblastn_result.evalue,
            identity: obj_ss_tblastn_result.identity,
            positive: obj_ss_tblastn_result.positive,
            query_from: obj_ss_tblastn_result.query_from,
            query_to: obj_ss_tblastn_result.query_to,
            hit_from: obj_ss_tblastn_result.hit_from,
            hit_to: obj_ss_tblastn_result.hit_to,
            hit_frame: obj_ss_tblastn_result.hit_frame,
            align_len: obj_ss_tblastn_result.align_len,
            gaps: obj_ss_tblastn_result.gaps,
            midline: obj_ss_tblastn_result.midline,
            hseq: obj_ss_tblastn_result.hseq,
            qseq: obj_ss_tblastn_result.qseq
        };
    }
    /// 保存されていない場合
    else {
        try {

            // APIを呼び出してblastn_resultを取得する
            const response = await axios.get(`/data/get_tblastn_result/${tblastn_result_id}`);

            const obj_response = {
                id: tblastn_result_id,
                request_id: response.data.request_id,
                program: response.data.program,
                version: response.data.version,
                reference: response.data.reference,
                db: response.data.db,
                expect: response.data.expect,
                gap_open: response.data.gap_open,
                matrix: response.data.matrix,
                gap_extend: response.data.gap_extend,
                filter: response.data.filter,
                cbs: response.data.cbs,
                db_gencode: response.data.db_gencode,
                query_id: response.data.query_id,
                query_title: response.data.query_title,
                query_len: response.data.query_len,
                num: response.data.num,
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
                positive: response.data.positive,
                query_from: response.data.query_from,
                query_to: response.data.query_to,
                hit_from: response.data.hit_from,
                hit_to: response.data.hit_to,
                hit_frame: response.data.hit_frame,
                align_len: response.data.align_len,
                gaps: response.data.gaps,
                midline: response.data.midline,
                hseq: response.data.hseq,
                qseq: response.data.qseq

            };

            // session storageに保存
            save_result_list(search_id, 'tblastn_result', obj_response);

            // 返り値
            return obj_response;


        } catch (error) {
            console.error('Error:', error);
        }
    }
    

}

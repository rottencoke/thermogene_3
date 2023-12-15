import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';
import { get_tempura } from 'get_tempura';
import { get_search } from 'get_search';

// アライメント描画
// 関数内でblast_engine判別
export async function render_multi_alignment(obj, index) { 

    // 情報取得
    /// search
    const obj_search = await get_search();
    const arr_search_sequence = obj_search.sequence.split("");

    /// blast
    let blastn_result_id, tblastn_result_id, blast_engine;
    let blast_result_align_len, blast_result_midline;
    let blast_result_query_from, blast_result_query_to, blast_result_query_strand, blast_result_qseq;
    let blast_result_hit_from, blast_result_hit_to, blast_result_hit_strand, blast_result_hseq;
    let blast_result_protein;

    if (obj.arr_blastn_result_id.length) {

        blast_engine = "blastn";
        blastn_result_id = obj.arr_blastn_result_id[index];

        const obj_blastn_result = await get_blastn_result(blastn_result_id);

        blast_result_align_len = obj_blastn_result.align_len;
        blast_result_midline = obj_blastn_result.midline;
        blast_result_query_from = obj_blastn_result.query_from;
        blast_result_query_to = obj_blastn_result.query_to;
        blast_result_query_strand = obj_blastn_result.query_strand;
        blast_result_qseq = obj_blastn_result.qseq;
        blast_result_hit_from = obj_blastn_result.hit_from;
        blast_result_hit_to = obj_blastn_result.hit_to;
        blast_result_hit_strand = obj_blastn_result.hit_strand;
        blast_result_hseq = obj_blastn_result.hseq;

        blast_result_protein = obj_blastn_result.protein;

    } else if (obj.arr_tblastn_result_id.length) {

        blast_engine = "tblastn";
        tblastn_result_id = obj.arr_tblastn_result_id[index];

        const obj_tblastn_result = await get_tblastn_result(tblastn_result_id);

        blast_result_align_len = obj_tblastn_result.align_len;
        blast_result_midline = obj_tblastn_result.midline;
        blast_result_query_from = obj_tblastn_result.query_from;
        blast_result_query_to = obj_tblastn_result.query_to;
        blast_result_query_strand = obj_tblastn_result.query_strand;
        blast_result_qseq = obj_tblastn_result.qseq;
        blast_result_hit_from = obj_tblastn_result.hit_from;
        blast_result_hit_to = obj_tblastn_result.hit_to;
        blast_result_hit_strand = obj_tblastn_result.hit_strand;
        blast_result_hseq = obj_tblastn_result.hseq;

        blast_result_protein = obj_tblastn_result.protein;

    }

    /// tempura
    const obj_tempura = await get_tempura(obj.arr_tempura_id[index]);

    const td_genus_and_species = obj_tempura.genus_and_species;
    const td_strain = obj_tempura.strain;
    const td_topt_ave = obj_tempura.topt_ave;
    const td_tmin = obj_tempura.tmin;
    const td_tmax = obj_tempura.tmax;

    // tableヘッダー
    const th_genus_and_species = "生物種名";
    const th_strain = "株名";
    const th_topt = "生育温度";
    const th_protein = "タンパク質名";

    // 各データの詳細をtitle属性で表示する
    const text_title = `
        ${th_genus_and_species} (${th_strain}): ${td_genus_and_species} (${td_strain})
        ${th_topt}: ${td_topt_ave}℃ (${td_tmin}℃~${td_tmax}℃)
        ${th_protein}: ${blast_result_protein}
    `;

    // マルチアライメント作成（table）
    let html_multi_alignment = ``;

    /// index=0の時だけquery配列を一番上につける
    if (index == 0) {

        let query_td= ``;

        for (let i = 0; i < arr_search_sequence.length; i++) {
            query_td += /*html*/`
                <td><b>${arr_search_sequence[i].toUpperCase()}</b></td>
            `;
        }

        html_multi_alignment = /*html*/`
            <tr>
                <th></td>
                <th>1~${arr_search_sequence.length}(Query)</th>
                <th>(Hit)</th>
                ${query_td}
            </tr>        
        `;
    }

    /// hit配列をつける
    let hseq_td = ``;

    for (let i = 0; i < arr_search_sequence.length; i++) {
        const str = blast_result_hseq[i - blast_result_query_from + 1];
        hseq_td += /*html*/`
            <td>${str ? str : ''}</td>
        `;
    }

    html_multi_alignment += /*html*/`
        <tr>
            <th>
                <p title="${text_title}">#${index + 1}</p>
            </th>
            <th>${blast_result_query_from}~${blast_result_query_to}</th>
            <th>${blast_result_hit_from}~${blast_result_hit_to}</th>
            ${hseq_td}
        </tr>
    `;

    return html_multi_alignment;

}
import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';

// アライメント描画
// 関数内でblast_engine判別
export async function render_alignment(obj, index) {

    // 情報取得
    /// blast
    let blastn_result_id, tblastn_result_id, blast_engine;
    let blast_result_align_len, blast_result_midline;
    let blast_result_query_from, blast_result_query_to, blast_result_query_strand, blast_result_qseq;
    let blast_result_hit_from, blast_result_hit_to, blast_result_hit_strand, blast_result_hseq;

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

    }

    // 各種設定
    /// アライメントの横幅の文字数を設定
    const paragraph_width = 40;

    /// アライメントの数字を表示する間隔
    const alignment_interval = 10;

    /// アライメントの段落数を計算（切り上げ）
    let paragraph_length = Math.ceil(blast_result_align_len / paragraph_width);

    /// アライメントをどこまで描画したか保存
    let alignment_last = 0;

    // 作成するhtml文
    let html_alignment = `<div class="container alignment_area">`;

    for (let i = 0; i < paragraph_length; i++) {

        let html_alignment_element = ``;

        for (let j = 0; j < paragraph_width; j++) {

            // blast_result_align_lenを超える分は処理しなくていい
            if (alignment_last >= blast_result_align_len) break;

            html_alignment_element += /*html*/`${render_alignment_element(index, i, j)}`;

            alignment_last++;
        }

        html_alignment += /*html*/`
            <li class="non_dotted_li my-3">
                <div class="flex">
                    <div class="alignment_view_header">
                        <ul class="non_dotted_ul me-2">
                            <li class="non_dotted_li fw-lighter fs_7 centered_li">&nbsp;</li>
                            <li class="non_dotted_li centered_li">
                                Query
                                <small>
                                    &nbsp;(${blast_result_query_from}~${blast_result_query_to})
                                </small>
                            </li>
                            <li class="non_dotted_li centered_li">&nbsp;</li>
                            <li class="non_dotted_li centered_li">
                                Subject
                                <small>
                                    &nbsp;(${blast_result_hit_from}~${blast_result_hit_to})
                                </small>
                            </li>
                            <li class="non_dotted_li fw-lighter fs_7 centered_li">&nbsp;</li>
                        </ul>
                    </div>
                    <div class="alignment_view_content">
                        ${html_alignment_element}
                    </div>
                </div>
            </li>
        `;


    }

    // アライメントの横方向の描画
    function render_alignment_element(index, i, j) {

        // id作成(レアコドン表示のためにidをつける)
        const id_seq = `seq_r${index}_e${i * paragraph_width + j}`;

        // query配列側の数字
        let query_number = 0;

        /// query配列が小さい順に並んでる場合 or tblastn等向きが明確な場合
        if (blast_result_query_strand == "Plus" || blast_engine == "tblastn") {
            let raw_query_number = blast_result_query_from + alignment_last;
            query_number = show_alignment_number(raw_query_number);
        }

        /// query配列が大きい順に並んでる場合
        else {
            let raw_query_number = blast_result_query_from - alignment_last;
            query_number = show_alignment_number(raw_query_number);

        }

        // hit配列側の数字
        let hit_number = 0;

        /// hit配列が小さい順に並んでる場合 or tblastn等向きが明確な場合
        if (blast_result_hit_strand == "Plus" || blast_engine == "tblastn") {
            let raw_hit_number = blast_result_hit_from + alignment_last;
            hit_number = show_alignment_number(raw_hit_number);
        }

        /// hit配列が大きい順に並んでる場合
        else {
            let raw_hit_number = blast_result_hit_from - alignment_last;
            hit_number = show_alignment_number(raw_hit_number);

        } 
        
        // midline作成
        let midline = "";

        /// blastn
        if (blast_engine == "blastn") { 
            if (blast_result_midline[alignment_last]) midline = "|";
            else midline = "&nbsp;";
        }
        /// tblastn
        else if (blast_engine == "tblastn") { 
            if (blast_result_midline[alignment_last] = ~ /^[A-Z]+$/) midline = "|";
            else if (blast_result_midline[alignment_last] == "+") midline = "+";
            else midline = "&nbsp;";
        }

        // アライメントが数字を表示する間隔の場合、その数字を返す
        function show_alignment_number(number) {

            // 返す数字、デフォは空白
            let ans_number = "&nbsp;";

            // アライメントが数字を表示する間隔の場合
            if (number % alignment_interval == 0) {
                ans_number = number;
            }

            return ans_number;
            
        }

        const html_alignment_element = /*html*/`
            <ul class="non_dotted_ul horizontal_range_ul list_width">

                <!-- query配列側の数字 -->
                <li class="alignment_query_number non_dotted_li fw-lighter fs_7 centered_li">
                    ${query_number}
                </li>
                
                <!-- query配列 -->
                <li class="alignment_query_sequence non_dotted_li centered_li">
                    ${blast_result_qseq[alignment_last]}
                </li>

                <!-- midline -->
                <li class="alignment_midline non_dotted_li ms-05 centered_li">
                    ${midline}
                </li>

                <!-- hit配列 -->
                <li class="alignment_midline non_dotted_li ms-05 centered_li" id=${id_seq}>
                    ${blast_result_hseq[alignment_last]}
                </li>

                <!-- hit配列側の数字 -->
                <li class="alignment_query_number non_dotted_li fw-lighter fs_7 centered_li">
                    ${hit_number}
                </li>

            </ul>
        `;

        return html_alignment_element;

    }

    html_alignment += `</div>`;

    return html_alignment;
}
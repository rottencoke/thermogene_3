import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';
import { get_tempura } from 'get_tempura';
import { get_search } from 'get_search';
import { push_state_obj_locus_tag } from 'state';

// アライメント描画
// 関数内でblast_engine判別
export async function render_multi_alignment(obj, index, arr_deletion) { 

    // 情報取得
    /// search
    const obj_search = await get_search();
    const arr_search_sequence = obj_search.sequence.replace(/\n/g, '').split("");

    /// blast
    let blastn_result_id, tblastn_result_id, blast_engine;
    let blast_result_align_len, blast_result_midline;
    let blast_result_query_from, blast_result_query_to, blast_result_query_strand, blast_result_qseq;
    let blast_result_hit_from, blast_result_hit_to, blast_result_hit_strand, blast_result_hseq;
    let blast_result_protein, blast_result_protein_id, blast_result_locus_tag, blast_id;

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

        blast_id = blastn_result_id;
        blast_result_protein = obj_blastn_result.protein;
        blast_result_protein_id = obj_blastn_result.protein_id;
        blast_result_locus_tag = obj_blastn_result.locus_tag;

        // locus_tagとblast_idのオブジェクトをstateに保存する
        push_state_obj_locus_tag({ 'blast_id': blastn_result_id, 'locus_tag': blast_result_locus_tag });

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

        blast_id = tblastn_result_id;
        blast_result_protein = obj_tblastn_result.protein;
        blast_result_protein_id = obj_tblastn_result.protein_id;
        blast_result_locus_tag = obj_tblastn_result.locus_tag;

        // locus_tagとblast_idのオブジェクトをstateに保存する
        push_state_obj_locus_tag({ 'blast_id': tblastn_result_id, 'locus_tag': blast_result_locus_tag });

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
    const th_topt = "生育<br>温度 [℃]";
    const th_protein = "タンパク質名";

    // マルチアライメント作成（table）
    let html_multi_alignment = ``;

    // query配列の欠失の最大連続数の合計
    let num_total_deletion = 0;
    for (let i = 0; i < arr_deletion.length; i++) {
        num_total_deletion += arr_deletion[i];
    }
    
    // 配列表示部分の要素の数
    const num_alignment_length = arr_search_sequence.length + num_total_deletion;

    /// index=0の時だけquery配列を一番上につける
    if (index == 0) {

        // 各配列の要素のhtml
        let html_qseq_td = ``;

        // 配列上の位置
        let position_sequence = 0;

        // 欠失の最大連続数の配列
        let arr_deletion_query = new Array(arr_search_sequence.length).fill(0);
        for (let i = 0; i < arr_deletion_query.length; i++) {
            arr_deletion_query[i] = arr_deletion[i+1];
        }
        
        // 配列表示部分の要素の数だけ繰り返す
        for (let i = 0; i < num_alignment_length; i++) {

            // arr_deletion_query[i]が1以上ある場合、空欄のtdにしてarr_deletion_query[i]を1減らす
            if (arr_deletion_query[position_sequence] > 0) {

                html_qseq_td += /*html*/`
                    <td>&nbsp;</td>
                `;

                arr_deletion_query[position_sequence]--;
            }
            // arr_deletion_query[i]が0の場合、tdに配列の要素を入れて、配列上の位置を1増やす
            else {
                
                const text_query = arr_search_sequence[position_sequence].toUpperCase();

                html_qseq_td += /*html*/`
                    <td class="${position_sequence % 5 == 4 ? 'table_border_td_right' : ''}">
                        ${position_sequence % 5 == 4 ? position_sequence + 1 : ''}<br><b>${text_query}</b>
                    </td>
                `;

                position_sequence++;
            }
            
        }

        html_multi_alignment = /*html*/`
            <tr class="table_border_top_td_bottom">
                <th>${th_genus_and_species} (${th_strain})</th>
                <th class="no_wrap">${th_topt}</th>
                <th class="sticked_in_left">${th_protein}</th>
                <th class="table_border_th_right">Query<br>1~${arr_search_sequence.length}</th>
                ${html_qseq_td}
            </tr>        
        `;
    }

    /// hit配列をつける
    let html_hseq_td = ``;

    // tableの配列のtdの位置
    let position_td = 0;

    // query配列上の位置
    let position_query = 0;

    // 各アライメント上の位置
    let position_alignment = 0;

    // アライメントの始まりの塩基（blastn）or アミノ残基（tblastn）が元の配列の何番目から始まってるか
    let blast_result_common_hit = 0;
    if (blast_engine == "tblastn") blast_result_common_hit = (blast_result_hit_from + 2) / 3;

    // 欠失の最大連続数の配列
    let arr_deletion_hit = new Array(arr_search_sequence.length);
    for (let i = 0; i < arr_deletion_hit.length; i++) {
        arr_deletion_hit[i] = arr_deletion[i+1];
    }

    // リンク作成
    const url_strain = `https://www.ncbi.nlm.nih.gov/datasets/genome/${obj_tempura.assembly_or_accession}/`;
    const url_protein = `https://www.ncbi.nlm.nih.gov/protein/${blast_result_protein_id}`;

    // リンク説明
    const text_url_strain = "NCBI該当菌株ページ (genome assembly)";
    const text_url_protein = "NCBI該当タンパク質ページ (protein)";

    // 配列表示部分の要素の数だけ繰り返す
    for (let i = 0; i < num_alignment_length; i++) {

        // arr_deletion_hit[i]が1以上ある場合、空欄のtdにしてarr_deletion_hit[i]を1減らす
        if (arr_deletion_hit[position_query] > 0) {

            // アライメントのquery配列の要素が"-"だったら、hit配列の要素を先に書く
            if (blast_result_qseq[position_alignment] == "-") {
                render_multi_alignment_element(position_alignment, 0, position_td);
                position_alignment++;
            } else {

                html_hseq_td += /*html*/`
                    <td class="multi_alignment_td">&nbsp;</td>
                `;
            }
            position_td++;
            arr_deletion_hit[position_query]--;
        }
        // arr_deletion_hit[i]が0の場合、tdに配列の要素を入れて、配列上の位置を1増やす
        else {

            // そもそもアライメント配列の範囲外なら空欄のtdにして次の繰り返しに飛ぶ
            if (position_query < blast_result_query_from - 1 || position_query > blast_result_query_to - 1) {

                html_hseq_td += /*html*/`
                    <td class="${position_query % 5 == 4 ? 'table_border_td_right' : ''} multi_alignment_td">&nbsp;</td>
                `;
                position_query++;
                continue;
            }

            // アライメント配列の範囲内の場合
            render_multi_alignment_element(position_alignment, position_query, position_td);
            
            position_alignment++;
            position_query++;
            position_td++;
        }
    }

    html_multi_alignment += /*html*/`
        <tr>
            <th>
                <p>
                    <a
                        class="no_wrap fs_7 less_styled_link"
                        href="${url_strain}"
                        title="${text_url_strain}"
                        target="_blank"
                    >
                        ${td_genus_and_species} (${td_strain})
                    </a>
                </p>
            </th>
            <th>
                <p class="no_wrap fs_7">${td_topt_ave}</p>
            </th>
            <th class="sticked_in_left">
                <p>
                    <a
                        class="no_wrap fs_7 less_styled_link"
                        href="${url_protein}"
                        title="${text_url_protein}"
                        target="_blank"
                    >
                        ${blast_result_protein.split('{')[0]}
                    </a>
                </p>
            </th>
            <th class="table_border_th_right">${blast_result_query_from}~${blast_result_query_to}</th>
            ${html_hseq_td}
        </tr>
    `;

    return html_multi_alignment;

    function render_multi_alignment_element(position_alignment, position_query, position_td) {

        const text_hit = blast_result_hseq[position_alignment];
        
        // blastnの場合
        if (blast_engine == "blastn") {
                
            // アライメントがある場合
            if (blast_result_midline[position_alignment]) {

                // 強調表示
                html_hseq_td += /*html*/`
                    <td class="multi_alignment_td ${position_query % 5 == 4 ? 'table_border_td_right' : ''}"><b>${text_hit}</b></td>
                `;

            }
            // アライメントがない場合
            else {
                html_hseq_td += /*html*/`
                    <td class="multi_alignment_td ${position_query % 5 == 4 ? 'table_border_td_right' : ''}">${text_hit ? text_hit : ''}</td>
                `; 
            }
        }
        // tblastnの場合
        else if (blast_engine == "tblastn") {

            // アライメントがある場合
            if (/^[A-Z]$/i.test(blast_result_midline[position_alignment])) {

                // 強調表示
                html_hseq_td += /*html*/`
                    <td id="td_${blast_id}_${blast_result_common_hit}" class="multi_alignment_td ${position_query % 5 == 4 ? 'table_border_td_right' : ''}"><b>${text_hit}</b></td>
                `;

                blast_result_common_hit++;
            }
            // アライメントが"+"の場合
            else if (blast_result_midline[position_alignment] == "+") {

                // 若干強調表示
                html_hseq_td += /*html*/`
                    <td id="td_${blast_id}_${blast_result_common_hit}" class="multi_alignment_td text_less_emphasized ${position_query % 5 == 4 ? 'table_border_td_right' : ''}"><b>${text_hit}</b></td>
                `;

                blast_result_common_hit++;

            }
            // アライメントがないけど"-"じゃない場合
            else if(text_hit != "-"){
                html_hseq_td += /*html*/`
                    <td id="td_${blast_id}_${blast_result_common_hit}" class="multi_alignment_td ${position_query % 5 == 4 ? 'table_border_td_right' : ''}">${text_hit ? text_hit : ''}</td>
                `;

                blast_result_common_hit++;

            }
            // アライメントがなく、"-"の場合
            else {
                html_hseq_td += /*html*/`
                    <td class="multi_alignment_td ${position_query % 5 == 4 ? 'table_border_td_right' : ''}">${text_hit}</td>
                `;
            }
        }
    }

}

// query配列の欠失を精査する
// 返り値はquery配列長の配列[]で、各位置ごとの最大の欠失の数を記録する
export async function check_deletion_query_sequence(obj) {

    // 情報取得
    /// search
    const obj_search = await get_search();
    const arr_search_sequence = obj_search.sequence.split("");

    // 返り値（各位置での欠失の最大連続数）
    /// query配列の長さで0で初期化された配列
    let arr_ans_deletion = new Array(arr_search_sequence.length).fill(0);

    // 情報取得
    /// blast
    let blastn_result_id, tblastn_result_id;
    let blast_result_align_len, blast_result_query_from, blast_result_query_to, blast_result_qseq;

    /// blastn
    if (obj.arr_blastn_result_id.length) {

        // 結果の数だけ繰り返す
        for (let i = 0; i < obj.arr_blastn_result_id.length; i++) {

            blastn_result_id = obj.arr_blastn_result_id[i];

            const obj_blastn_result = await get_blastn_result(blastn_result_id);

            blast_result_align_len = obj_blastn_result.align_len;
            blast_result_query_from = obj_blastn_result.query_from;
            blast_result_query_to = obj_blastn_result.query_to;
            blast_result_qseq = obj_blastn_result.qseq;

            // "-"が連続した数
            let num_consecutive_deletion = 0;

            // query配列上の位置
            let position_query = blast_result_query_from;

            // アライメントの長さだけ繰り返す
            for (let j = 0; j < blast_result_align_len; j++) {

                // query配列の要素が"-"な場合
                if (blast_result_qseq[j] == "-") {

                    // "-"の連続した数を1増やす
                    num_consecutive_deletion++;

                }
                // query配列の要素が"-"以外で、"-"が連続していた時
                else if (blast_result_qseq[j] != "-" && num_consecutive_deletion > 0) {
                    
                    // 欠失の最大連続数を超えている場合更新する
                    if (num_consecutive_deletion > arr_ans_deletion[position_query]) {
                        
                        arr_ans_deletion[position_query] = num_consecutive_deletion;

                    }

                    // "-"の連続数のカウントを初期化する
                    num_consecutive_deletion = 0;

                }

                // 普通に"-"じゃなくて配列がある場合、query配列上の位置を1増やす
                if (blast_result_qseq[j] != "-") position_query++;

            }
        }

    }
    /// tblastn
    else if (obj.arr_tblastn_result_id.length) {

        // 結果の数だけ繰り返す
        for (let i = 0; i < obj.arr_tblastn_result_id.length; i++) {

            tblastn_result_id = obj.arr_tblastn_result_id[i];

            const obj_tblastn_result = await get_tblastn_result(tblastn_result_id);

            blast_result_align_len = obj_tblastn_result.align_len;
            blast_result_query_from = obj_tblastn_result.query_from;
            blast_result_query_to = obj_tblastn_result.query_to;
            blast_result_qseq = obj_tblastn_result.qseq;

            // "-"が連続した数
            let num_consecutive_deletion = 0;

            // query配列上の位置
            let position_query = blast_result_query_from;

            // アライメントの長さだけ繰り返す
            for (let j = 0; j < blast_result_align_len; j++) {

                // query配列の要素が"-"な場合
                if (blast_result_qseq[j] == "-") {

                    // "-"の連続した数を1増やす
                    num_consecutive_deletion++;

                }
                // query配列の要素が"-"以外で、"-"が連続していた時
                else if (blast_result_qseq[j] != "-" && num_consecutive_deletion > 0) {
                    
                    // 欠失の最大連続数を超えている場合更新する
                    if (num_consecutive_deletion > arr_ans_deletion[position_query]) {
                        
                        arr_ans_deletion[position_query] = num_consecutive_deletion;

                    }

                    // "-"の連続数のカウントを初期化する
                    num_consecutive_deletion = 0;

                }

                // 普通に"-"じゃなくて配列がある場合、query配列上の位置を1増やす
                if (blast_result_qseq[j] != "-") position_query++;

            }
        }
    }

    return arr_ans_deletion;
}
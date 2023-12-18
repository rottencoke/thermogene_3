import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';
import { get_tempura } from 'get_tempura';
import { get_search } from 'get_search';

// アライメント描画
// 関数内でblast_engine判別
export async function render_multi_alignment(obj, index, arr_deletion) { 

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
                    <td>${position_sequence % 5 == 4 ? position_sequence + 1 : ''}<br><b>${text_query}</b></td>
                `;

                position_sequence++;
            }
            
        }

        html_multi_alignment = /*html*/`
            <tr>
                <th></td>
                <th>Query<br>1~${arr_search_sequence.length}</th>
                <th>Hit<br>&nbsp;</th>
                ${html_qseq_td}
            </tr>        
        `;
    }

    /// hit配列をつける
    let html_hseq_td = ``;

    // tableの配列のtdの位置
    let position_sequence_td = 0;

    // 各アライメント上の位置
    let position_alignment = 0;

    // 欠失の最大連続数の配列
    let arr_deletion_hit = new Array(arr_search_sequence.length);
    for (let i = 0; i < arr_deletion_hit.length; i++) {
        arr_deletion_hit[i] = arr_deletion[i+1];
    }

    // 配列表示部分の要素の数だけ繰り返す
    for (let i = 0; i < num_alignment_length; i++) {

        // arr_deletion_hit[i]が1以上ある場合、空欄のtdにしてarr_deletion_hit[i]を1減らす
        if (arr_deletion_hit[position_sequence_td] > 0) {

            // アライメントのquery配列の要素が"-"だったら、hit配列の要素を先に書く
            if (blast_result_qseq[position_alignment] == "-") {
                render_multi_alignment_element(position_alignment);
                position_alignment++;
                if(index == 2) console.log(`1 arr_deletion_hit[${position_sequence_td}] : ${arr_deletion_hit[position_sequence_td]}`);
            } else {

                html_hseq_td += /*html*/`
                    <td>&nbsp;</td>
                `;
                if(index == 2) console.log(`0 arr_deletion_hit[${position_sequence_td}] : ${arr_deletion_hit[position_sequence_td]}`);
            }
            
            arr_deletion_hit[position_sequence_td]--;
        }
        // arr_deletion_hit[i]が0の場合、tdに配列の要素を入れて、配列上の位置を1増やす
        else if(arr_deletion_hit[position_sequence_td] == 0){

            // そもそもアライメント配列の範囲外なら空欄のtdにして次の繰り返しに飛ぶ
            if (position_sequence_td < blast_result_query_from - 1 || position_sequence_td > blast_result_query_to - 1) {

                html_hseq_td += /*html*/`
                    <td>&nbsp;</td>
                `;
                position_sequence_td++;
                continue;
            }

            // アライメント配列の範囲内の場合
            render_multi_alignment_element(position_alignment);
            
            position_alignment++;
            position_sequence_td++;
        }
    }

    html_multi_alignment += /*html*/`
        <tr>
            <th>
                <p title="${text_title}">#${index + 1}</p>
            </th>
            <th>${blast_result_query_from}~${blast_result_query_to}</th>
            <th>${blast_result_hit_from}~${blast_result_hit_to}</th>
            ${html_hseq_td}
        </tr>
    `;

    return html_multi_alignment;

    function render_multi_alignment_element(position_alignment) {

        const text_hit = blast_result_hseq[position_alignment];
        
        // blastnの場合
        if (blast_engine == "blastn") {
                
            // アライメントがある場合
            if (blast_result_midline[position_alignment]) {

                // 強調表示
                html_hseq_td += /*html*/`
                    <td><b>${text_hit}</b></td>
                `;

            }
            // アライメントがない場合
            else {
                html_hseq_td += /*html*/`
                    <td>${text_hit ? text_hit : ''}</td>
                `; 
            }
        }
        // tblastnの場合
        else if (blast_engine == "tblastn") {

            // アライメントがある場合
            if (/^[A-Z]$/i.test(blast_result_midline[position_alignment])) {

                // 強調表示
                html_hseq_td += /*html*/`
                    <td><b>${text_hit}</b></td>
                `;
            }
            // アライメントが"+"の場合
            else if (blast_result_midline[position_alignment] == "+") {

                // 若干強調表示
                html_hseq_td += /*html*/`
                    <td class="text_less_emphasized"><b>${text_hit}</b></td>
                `;
            }
            // アライメントがない場合
            else {
                html_hseq_td += /*html*/`
                    <td>${text_hit ? text_hit : ''}</td>
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
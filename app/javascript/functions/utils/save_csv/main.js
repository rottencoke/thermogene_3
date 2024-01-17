import { get_search } from 'get_search';
import { get_result } from 'get_result';
import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';
import { get_tempura } from 'get_tempura';

export async function save_csv(obj_result) {

    // 要素の取得
    const element_setting_3_download = document.getElementById('setting_3_download');

    // CSVの保存のボタンのクリック
    element_setting_3_download.addEventListener('click', async function (event) {

        // 要素の取得
        const element_setting_3_alignment = document.getElementById('setting_3_alignment');
        const element_setting_3_blast = document.getElementById('setting_3_blast');
        const element_setting_3_tempura = document.getElementById('setting_3_tempura');
        
        // デフォルトの一行目
        let matrix_csv = [["genus_and_species", "strain", "Topt_ave[℃]", "protein"]];

        // その他情報を保存する場合
        if (element_setting_3_blast.checked) {

            // blastの全データ追加
            const arr_data_blast = [
                "accession",
                "gene",
                "locus_tag",
                "protein_id",
                "location",
                "gbkey",
                "assembly",
                "bit_score",
                "score",
                "evalue",
                "identity",
                "query_from",
                "query_to",
                "query_strand",
                "hit_from",
                "hit_to",
                "hit_strand",
                "align_len",
                "gaps",
                "created_at",
                "updated_at",
                "program",
                "version",
                "reference",
                "db",
                "expect",
                "sc_match",
                "sc_mismatch",
                "gap_open",
                "gap_extend",
                "filter",
                "query_id",
                "query_len"
            ];
            matrix_csv[0].push(arr_data_blast);

        }
        if (element_setting_3_tempura.checked) {

            // tempuraの全データ
            const arr_data_tempura = [
                "taxonomy_id",
                "superkingdom",
                "phylum",
                "class",
                "order",
                "family",
                "genus",
                "assembly_or_accession",
                "genome_GC",
                "genome_size",
                "R16S_accssion",
                "R16S_GC",
                "Tmin",
                "Topt_ave",
                "Topt_low",
                "Topt_high",
                "Tmax",
                "Tmax_tmin"
            ];
            matrix_csv[0].push(arr_data_tempura);
            
        }
        if (element_setting_3_alignment.checked) {

            // アライメントのデータの追加
            const arr_data_alignment = ["query_sequence", "alignment_midline", "hit_sequence"]
            matrix_csv[0].push(arr_data_alignment);

        }

        let jobtitle = "";

        // 結果の取得のエラーをキャッチ
        try {

            // 結果の取得
            const obj_search = await get_search();
            const search_blast_engine = obj_search.search_blast_engine;
            jobtitle = obj_search.jobtitle;

            const arr_tempura_id = obj_result.arr_tempura_id;

            // 結果の数だけcsv用の行列に行を追加
            for (let i = 0; i < arr_tempura_id.length; i++) {

                // blastの情報取得
                let obj_blast_result = {};
                if (search_blast_engine == 'blastn') {
                    obj_blast_result = await get_blastn_result(obj_result.arr_blastn_result_id[i]);
                } else {
                    obj_blast_result = await get_tblastn_result(obj_result.arr_tblastn_result_id[i]);
                }

                const accession = obj_blast_result.accession;
                const gene = obj_blast_result.gene;
                const locus_tag = obj_blast_result.locus_tag;
                const protein = "\"" + obj_blast_result.protein + "\"";
                const protein_id = obj_blast_result.protein_id;
                const location = obj_blast_result.location;
                const gbkey = obj_blast_result.gbkey;
                const assembly = obj_blast_result.assembly;
                const bit_score = obj_blast_result.bit_score;
                const score = obj_blast_result.score;
                const evalue = obj_blast_result.evalue;
                const identity = obj_blast_result.identity;
                const query_from = obj_blast_result.query_from;
                const query_to = obj_blast_result.query_to;
                const query_strand = obj_blast_result.query_strand;
                const hit_from = obj_blast_result.hit_from;
                const hit_to = obj_blast_result.hit_to;
                const hit_strand = obj_blast_result.hit_strand;
                const align_len = obj_blast_result.align_len;
                const gaps = obj_blast_result.gaps;
                const midline = obj_blast_result.midline;
                const hseq = obj_blast_result.hseq.join('');
                const qseq = obj_blast_result.qseq.join('');
                const created_at = obj_blast_result.created_at;
                const updated_at = obj_blast_result.updated_at;
                const program = obj_blast_result.program;
                const version = obj_blast_result.version;
                const reference = "\"" + obj_blast_result.reference + "\"";
                const db = obj_blast_result.db;
                const expect = obj_blast_result.expect;
                const sc_match = obj_blast_result.sc_match;
                const sc_mismatch = obj_blast_result.sc_mismatch;
                const gap_open = obj_blast_result.gap_open;
                const gap_extend = obj_blast_result.gap_extend;
                const filter = obj_blast_result.filter;
                const query_id = obj_blast_result.query_id;
                const query_len = obj_blast_result.query_len;

                // midlineの変換
                const midline_edited = midline.map(element => {
                    if (element === true) {
                        return "|";
                    } else if (element === false) {
                        return " ";
                    } else {
                        return element;
                    }
                }).join('');


                // tempuraの情報取得
                const obj_tempura = await get_tempura(arr_tempura_id[i]);
                const genus_and_species = obj_tempura.genus_and_species;
                const taxonomy_id = obj_tempura.taxonomy_id;
                const strain = obj_tempura.strain;
                const superkingdom = obj_tempura.superkingdom;
                const phylum = obj_tempura.phylum;
                const org_class = obj_tempura.org_class;
                const order = obj_tempura.order;
                const family = obj_tempura.family;
                const genus = obj_tempura.genus;
                const assembly_or_accession = obj_tempura.assembly_or_accession;
                const genome_GC = obj_tempura.genome_GC;
                const genome_size = obj_tempura.genome_size;
                const r16S_accssion = obj_tempura.r16S_accssion;
                const r16S_GC = obj_tempura.r16S_GC;
                const tmin = obj_tempura.tmin;
                const topt_ave = obj_tempura.topt_ave;
                const topt_low = obj_tempura.topt_low;
                const topt_high = obj_tempura.topt_high;
                const tmax = obj_tempura.tmax;
                const tmax_tmin = obj_tempura.tmax_tmin;


                // デフォルトで追加する行
                let arr_row = [genus_and_species, strain, topt_ave, protein];

                // その他情報を保存する場合
                if (element_setting_3_blast.checked) {

                    // 追加するアライメント以外のblast全データ
                    const arr_row_blast = [
                        accession,
                        gene,
                        locus_tag,
                        protein_id,
                        location,
                        gbkey,
                        assembly,
                        bit_score,
                        score,
                        evalue,
                        identity,
                        query_from,
                        query_to,
                        query_strand,
                        hit_from,
                        hit_to,
                        hit_strand,
                        align_len,
                        gaps,
                        created_at,
                        updated_at,
                        program,
                        version,
                        reference,
                        db,
                        expect,
                        sc_match,
                        sc_mismatch,
                        gap_open,
                        gap_extend,
                        filter,
                        query_id,
                        query_len
                    ];

                    arr_row.push(arr_row_blast);

                }
                if (element_setting_3_tempura.checked) {

                    // 追加するtempura全データ
                    const arr_row_tempura = [
                        taxonomy_id,
                        superkingdom,
                        phylum,
                        org_class,
                        order,
                        family,
                        genus,
                        assembly_or_accession,
                        genome_GC,
                        genome_size,
                        r16S_accssion,
                        r16S_GC,
                        tmin,
                        topt_ave,
                        topt_low,
                        topt_high,
                        tmax,
                        tmax_tmin
                    ];

                    arr_row.push(arr_row_tempura);

                }
                if (element_setting_3_alignment.checked) {

                    // アライメントを追加する場合
                    arr_row.push(qseq, midline_edited, hseq);
                }

                // 作成した行を行列に追加
                matrix_csv.push(arr_row);

            }

        } catch (error) {
            // エラー処理
            console.error('データの取得中にエラーが発生しました in render_results():', error);
        }

        // CSVデータを文字列に変換
        let csv_content = matrix_csv.map(row => row.join(",")).join("\n");

        // Blobオブジェクトを作成
        const blob = new Blob([csv_content], { type: "text/csv" });

        // ダウンロード用のリンクを作成
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);

        // ファイル名作成
        // 現在の日時を取得
        var now = new Date();

        // 各要素（年、月、日、時、分、秒）を取得
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0'); // 月は0から始まるため+1する
        var day = String(now.getDate()).padStart(2, '0');
        var hour = String(now.getHours()).padStart(2, '0');
        var minute = String(now.getMinutes()).padStart(2, '0');
        var second = String(now.getSeconds()).padStart(2, '0');

        // フォーマットに合わせて日時を結合
        var formattedDateTime = `${year}${month}${day}_${hour}${minute}${second}`;

        // ダウンロード時のファイル名を指定
        a.download = `${jobtitle}_${formattedDateTime}.csv`;

        // リンクをクリックしてダウンロードを開始
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();

        // リンクを削除
        document.body.removeChild(a);

    })


}
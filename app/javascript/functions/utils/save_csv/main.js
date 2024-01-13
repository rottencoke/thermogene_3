import { get_search } from 'get_search';
import { get_result } from 'get_result';
import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';
import { get_tempura } from 'get_tempura';

export async function save_csv() {

    // 要素の取得
    const element_setting_3_protein_id = document.getElementById('setting_3_protein_id');
    const element_setting_3_download = document.getElementById('setting_3_download');

    let matrix_csv = [["genus_and_species", "strain", "topt_ave[℃]", "protein"]];
    let matrix_csv_protein_id = [["genus_and_species", "strain", "topt_ave[℃]", "protein", "protein_id"]];
    let jobtitle = "";

    try {

        // 結果の取得
        const obj_search = await get_search();
        const obj_result = await get_result();
        const search_blast_engine = obj_search.search_blast_engine;
        const arr_tempura_id = obj_result.tempura_id;
        jobtitle = obj_search.jobtitle;

        // 結果の数だけcsv用の行列に行を追加
        for (let i = 0; i < arr_tempura_id.length; i++) {
            
            // blastの情報取得
            let obj_blast_result = {};
            if (search_blast_engine == 'blastn') {
                obj_blast_result = await get_blastn_result(obj_result.blastn_result_id[i]);
            } else {
                obj_blast_result = await get_tblastn_result(obj_result.tblastn_result_id[i]);
            }

            const protein = obj_blast_result.protein;
            const protein_id = obj_blast_result.protein_id;

            // tempuraの情報取得
            const obj_tempura = await get_tempura(arr_tempura_id[i]);
            const genus_and_species = obj_tempura.genus_and_species;
            const strain = obj_tempura.strain;
            const topt_ave = obj_tempura.topt_ave;

            // 追加する行
            let arr_row_add = [genus_and_species, strain, topt_ave, protein];
            const arr_row_add_protein_id = [genus_and_species, strain, topt_ave, protein, protein_id];

            // 作成した行を行列に追加
            matrix_csv.push(arr_row_add);
            matrix_csv_protein_id.push(arr_row_add_protein_id);

        }

    } catch (error) {
        // エラー処理
        console.error('データの取得中にエラーが発生しました in render_results():', error);
    }

    // CSVの保存のボタンのクリック
    element_setting_3_download.addEventListener('click', function (event) {

        // CSVデータを文字列に変換
        let csv_content;
        if (element_setting_3_protein_id.checked) {
            csv_content = matrix_csv_protein_id.map(row => row.join(",")).join("\n");
        } else {
            csv_content = matrix_csv.map(row => row.join(",")).join("\n");
        }

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
export function post_search_params() {

    // フォーム読み取り
    document.addEventListener("DOMContentLoaded", function () {
        
        // 要素取得
        const element_search_form = document.getElementById("search_form");
        
        element_search_form.addEventListener("submit", function (e) {
            e.preventDefault();

            // エラー表示
            // 要素取得
            const element_sequence_textarea = document.getElementById("sequence_textarea").value;
            const element_sequence_file = document.getElementById("sequence_file").value;
            const element_temp_minimum = document.getElementById("temp_minimum").value;
            const element_temp_maximum = document.getElementById("temp_maximum").value;
            const element_error_sequence = document.getElementById("error_sequence");
            const element_error_temp = document.getElementById("error_temp");
            const element_btn_search = document.getElementById('btn_search');

            // エラーの有無
            let is_error = false;

            // 温度の入力フィールドが空かどうかチェック
            if (!(element_temp_minimum && element_temp_maximum)) {
                // どちらかが空の場合、エラーメッセージを表示し、フォームの送信を防止
                element_error_temp.textContent = "生育温度を入力してください";
                e.preventDefault();
                is_error = true;
            } else {
                // そうでない場合はエラーメッセージをクリア
                element_error_temp.textContent = "";
            }
        
            // 配列の両方の入力フィールドが空かどうかをチェック
            if (!element_sequence_textarea && !element_sequence_file) {
                // 両方が空の場合、エラーメッセージを表示し、フォームの送信を防止
                element_error_sequence.textContent = "ファイル入力かテキスト入力のどちらかを行ってください";
                e.preventDefault();
                is_error = true;
            } else {
                // そうでない場合はエラーメッセージをクリア
                element_error_sequence.textContent = "";
            }

            // エラーがある場合、以下の処理は実行しない
            if (is_error) return;

            // ボタンの色と文字を変更する
            element_btn_search.style.backgroundColor = 'var(--color-button-pushed)';
            element_btn_search.style.borderColor = 'var(--color-button-pushed)';
            element_btn_search.style.color = 'black';
            element_btn_search.value = '検索中';

            const form_data = new FormData(this);

            let data_raw_sequence = "";
            // 配列をテキスト入力したとき
            if (form_data.get('sequence')) {
                data_raw_sequence = form_data.get('sequence');
                send_param();
            }
            // 配列をファイル入力したとき
            else if (form_data.get('sequence_file')) {
                const sequence_file = document.getElementById('sequence_file').files[0];
                if (sequence_file) {
                    var reader = new FileReader();

                    // 読み込みが完了したときのイベントハンドラ
                    reader.onload = function(e) {
                        data_raw_sequence = e.target.result; // 読み込んだファイルの内容
                        send_param();
                    };
                
                    // ファイル読み込みエラーが発生した場合のイベントハンドラ
                    reader.onerror = function(e) {
                      console.error("ファイルの読み込み中にエラーが発生しました:", e);
                    };
                
                    // ファイルをテキストとして読み込むって命令を出す
                    reader.readAsText(sequence_file);
                }
            }

            function send_param() {
                const data_sequence = split_fasta_header_from_sequence(data_raw_sequence).sequence;
                const data_fasta_header = split_fasta_header_from_sequence(data_raw_sequence).fasta_header;
                const data_jobtitle = form_data.get('jobtitle');
                const data_temp_minimum = form_data.get('temp_minimum');
                const data_temp_maximum = form_data.get('temp_maximum');
                const data_search_blast_engine = form_data.get('search_blast_engine');

                const obj_form_data_new = {
                    jobtitle: data_jobtitle,
                    temp_minimum: data_temp_minimum,
                    temp_maximum: data_temp_maximum,
                    sequence: data_sequence,
                    fasta_header: data_fasta_header,
                    search_blast_engine: data_search_blast_engine
                }

                fetch("/searches", {
                    method: "POST",
                    body: JSON.stringify(obj_form_data_new),
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        window.location.href = `/searches/${data.search_id}`;
                    })
                    .catch(error => console.error('Error:', error));
            }

            function split_fasta_header_from_sequence(str) {

                // \nで分ける
                const arr_raw_str = str.split('\n');
            
                // fasta_header
                let fasta_header = "";
            
                // sequence
                let sequence = str;
            
                // 分けた一つ目（[0]）が">"で始まる場合、fasta形式だと判断する
                if (arr_raw_str.length > 1 && arr_raw_str[0].startsWith(">")) {
                    fasta_header = arr_raw_str[0].replace(">", "");
                    sequence = "";
                    for (let i = 1; i < arr_raw_str.length; i++) {
                        sequence += arr_raw_str[i];
                    }
                }
            
                return {
                    fasta_header,
                    sequence
                }
            }
        });
    });
}


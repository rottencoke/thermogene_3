export function post_search_params() {

    // フォーム読み取り
    document.addEventListener("DOMContentLoaded", function () {
        
        // 要素取得
        const element_search_form = document.getElementById("search_form");
        const element_btn_search = document.getElementById('btn_search');
  
        element_search_form.addEventListener("submit", function (e) {
            e.preventDefault();

            // ボタンの色を変更する
            element_btn_search.style.backgroundColor = 'var(--color-button-pushed)';
            element_btn_search.style.borderColor = 'var(--color-button-pushed)';
            element_btn_search.style.color = 'black';

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
        });
    });

    // エラー表示
    document.getElementById("search_form").addEventListener("submit", function(event) {
        const input1 = document.getElementById("seq").value;
        const input2 = document.getElementById("sequence_file").value;
        const element_error_message = document.getElementById("error_message");
      
        // 両方の入力フィールドが空かどうかをチェック
        if (!input1 && !input2) {
            // 両方が空の場合、エラーメッセージを表示し、フォームの送信を防止
            element_error_message.textContent = "ファイル入力かテキスト入力のどちらかを行ってください";
            event.preventDefault();
        } else {
            // そうでない場合はエラーメッセージをクリア
            element_error_message.textContent = "";
        }
    });
      
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
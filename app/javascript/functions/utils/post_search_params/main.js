export function post_search_params() {
    document.addEventListener("DOMContentLoaded", function () {
        const element_search_form = document.getElementById("search-form");
  
        element_search_form.addEventListener("submit", function (e) {
            e.preventDefault();
            const form_data = new FormData(this);

            const data_raw_sequence = form_data.get('sequence');
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
        });
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
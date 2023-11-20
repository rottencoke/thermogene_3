import { arr_release_info } from 'release_info';

// リリースノート全体の作成
export function render_release_notes() {

    // リリースノートのタイトル
    const release_note_title = "リリースノート";

    // リリースノートの作成
    let html_release_notes_area = ``;

    /// リリース情報の数の取得
    const num_release_info_length = arr_release_info.length;

    /// リリース情報の数分繰り返してhtmlを作成
    for (let i = num_release_info_length-1; i >= 0; i--) {
        html_release_notes_area += render_release_note(i);

        if (i != num_release_info_length) html_release_notes_area += `<hr>`;
    }

    const html_release_notes = /*html*/`
        <h3>${release_note_title}</h3>
        <div id="release_notes_area" class="container">${html_release_notes_area}</div>
    `;

    // htmlに挿入
    document.getElementById('release_notes').innerHTML = html_release_notes;

    // 各リリースノートの項目のhtmlの作成
    function render_release_note(index) {

        const note_info = arr_release_info[index];
        const note_date = note_info.date;
        const arr_note_changes = note_info.changes;
        const arr_note_details = note_info.details;
        const num_note_changes_length = arr_note_changes.length;

        // リリースノートの内容の作成
        let html_release_note_contents = ``;

        for (let j = 0; j < num_note_changes_length; j++) {
            html_release_note_contents += render_release_note_content(j)
        }

        const html_release_note = /*html*/`
            <div>
                <div class="release_note_title_area container">${note_date}</div>
                <div class="release_note_content_area container">
                    <ul>${html_release_note_contents}</ul>
                </div>
            </div>
        `;

        return html_release_note;

        // リリースノートの内容の作成
        function render_release_note_content(num_content) {
            return /*html*/`
                <li class="release_note_content_changes">
                    ${arr_note_changes[num_content]}
                    <div class="release_note_content_details container mb-3">${arr_note_details[num_content]}</div>
                </li>
                
            `;
        }
    }
}
import { get_state_sort } from 'state';

export function render_sort_control() {

    // localStorageから読み込んだstateに応じてソート管理バーのタイトルを変更する
    let html_sort_control_title = ``;

    // stateに応じてプルダウンメニューの値も変更する
    let html_sort_select = /*html*/`
        <select id="sort_select" class="form-select w-3">
            <option value="bit_score">bit score</option>
            <option value="growth_temperature">生育温度</option>
            <option value="identity">相同性</option>
            <option value="evalue">E Value</option>
        </select>
    `;
    let html_sort_order = /*html*/`
        <select id="sort_order" class="form-select">
            <option value="descending_order">降順</option>
            <option value="ascending_order">昇順</option>
        </select>
    `;

    // state_sortを取得
    const state_sort = get_state_sort();

    // stateを要素ごとにわける
    const state_sort_select = state_sort.split('-')[0];
    const state_sort_order = state_sort.split('-')[1];

    // html中の文字
    const text_jp_no = "の";
    const text_jp_desort = "でソート";
    const text_default = "(デフォルト)";

    // 条件ごとにhtml内の文字を変更
    let text_select = "", text_order = "";
    switch (state_sort_select) {
        case "bit_score":
            text_select = "bit_score";
            html_sort_select = insert_selected_in_select(html_sort_select, "bit_score");
            break;
        case "identity":
            text_select = "相同性";
            html_sort_select = insert_selected_in_select(html_sort_select, "identity");
            break;
        case "evalue":
            text_select = "E Value";
            html_sort_select = insert_selected_in_select(html_sort_select, "evalue");
            break;
        case "growth_temperature":
            text_select = "生育温度";
            html_sort_select = insert_selected_in_select(html_sort_select, "growth_temperature");
            break;
    }
    switch (state_sort_order) {
        case "descending_order":
            text_order = "降順";
            html_sort_order = insert_selected_in_select(html_sort_order, "descending_order");
            break;
        case "ascending_order":
            text_order = "昇順";
            html_sort_order = insert_selected_in_select(html_sort_order, "ascending_order");
            break;
    }

    // 条件ごとにhtmlを作成
    html_sort_control_title = /*html*/`
        <span id="sort_add_condition_select">${text_select}</span>
        <span class="unhighlighted_text">${text_jp_no}</span>
        <span id="sort_add_condition_order">${text_order}</span>
        <span class="unhighlighted_text">${text_jp_desort}</span>
    `;

    // bit_scoreの降順の時のみデフォルト表示する
    if (state_sort_select == "bit_score" && state_sort_order == "descending_order") {
        html_sort_control_title += /*html*/`
            <span id="sort_add_condition_default_description" class="unhighlighted_text" style="display:inline-block;">${text_default}</span>
        `;
    } else {
        html_sort_control_title += /*html*/`
            <span id="sort_add_condition_default_description" class="unhighlighted_text" style="display:none;">${text_default}</span>
        `;
    }


    // ソート管理バーのhtml
    let html_sort_control = /*html*/`
        <div id="sort_control_area">
            <div id="sort_add_condition" class="sort_show_label text_width hover_background_marked interactive m-4 p-2">
                ${html_sort_control_title}                
            </div>
            <div class="modal shadow_around_element" id="sort_modal" style="display:none;">
                <div class="modal_content">
                    <div class="flex-container input-group">
                        ${html_sort_select}
                        <p class="pt-3">の</p>
                        ${html_sort_order}
                        <p class="pt-3">でソート</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html_sort_control;

    // <select></select>の任意のtarget_valueの<option></option>に"selected"を入れて、デフォルトの表示の値にする
    function insert_selected_in_select(original_string, target_value) {

        // 挿入する位置を見つける
        const position = original_string.indexOf(target_value);

        let ans = original_string;

        // パターンが見つかった場合、その直後に挿入
        if (position !== -1) {
            ans = original_string.substring(0, position + target_value.length + 1) + " selected" + original_string.substring(position + target_value.length + 1);
        }

        // パターンが見つからない場合、元の文字列を返す
        return ans;
    }
}
import { icon_setting } from 'icons';
import { get_state_setting_view, get_state_setting_binding_site } from 'state';

export function render_setting() {

    // アイコン
    const html_icon_setting = icon_setting;

    // 設定各タブ名
    const arr_text_settings = ["表示設定の自動保存", "結果表示形式", "結合部位表示", "結果保存 (.csv)"];

    // 設定モーダルのタブ作成
    let html_setting_tab = ``;
    for (let i = 0; i < arr_text_settings.length; i++) {
        html_setting_tab += /*html*/`
            <div id="modal_setting_tab_${i}" class="modal_setting_tab p-2 interactive">
                ${arr_text_settings[i]}
            </div>
        `;
    }

    // 設定モーダル全体のhtml
    const html_setting = /*html*/`
        <div id="setting_area">
            <div id="setting_icon" class="interactive m-4 p-2">
                ${html_icon_setting}
            </div>
            <div id="setting_modal" class="modal_bigger shadow_around_element" style="display:none;">
                <div id="modal_setting_content" class="modal_content m-2">
                    <!-- 設定モーダルの左側に設定の種類一覧タブ -->
                    <div id="modal_setting_tabs" class="flex-container">
                        ${html_setting_tab}
                    </div>
                    <!-- 各設定の内容 -->
                    <div id="modal_setting_contents">
                        ${render_setting_content()}
                    </div>
                </div>
            </div>
        </div>
    `;

    return html_setting;

    // 各設定の内容
    function render_setting_content() {

        // state_setting_viewの値の取得
        const state_setting_view = get_state_setting_view();

        // radioのcheckedがどっちか
        let num_radio_checked;
        switch (state_setting_view) {
            case "organismInfo_alignmentInfo_alignment":
                num_radio_checked = 1;
                break;
            case "organismInfo_alignmentInfo":
                num_radio_checked = 2;
                break;
            case "multiAlignment":
                num_radio_checked = 3;
                break;
        }

        // 内容の配列
        const arr_html_setting_content = [
            /*html*/`
                <div class="m-3">
                    <div class="fs_7 p-2">
                        検索結果に対して設定できるソートやフィルターなどを自動で保存し、<br>
                        次回の検索や再読み込み時に保存した設定を適用することができます。<br>
                        デフォルトではONになっています。
                    </div>
                    <form>
                        <input type="checkbox" id="setting_0_auto_save_apply">
                        <label for="setting_0_auto_save_apply">結果表示設定を自動で保存&適用する</label>
                    </form>
                </div>
            `,
            /*html*/`
                <div class="m-3">
                    <div class="fs_7 p-2">
                        検索結果の表示形式を変更することができます。<br>
                        1の方法では、各種情報と共にペアワイズアライメントも表示されます。<br>
                        2の方法では、各種情報のみが表形式で表示されます。<br>
                        3の方法では、ヒットした配列全体のマルチアライメントが表示されます。 
                    </div>
                    <form>
                        <input type="radio" id="setting_1_organismInfo_alignmentInfo_alignment" name="setting_view" value="organismInfo_alignmentInfo_alignment" ${num_radio_checked == 1 ? 'checked' : ''}>
                        <label for="setting_1_organismInfo_alignmentInfo_alignment">1. 生物情報&アライメント情報&アライメント</label>
                        <br>
                        <input type="radio" id="setting_1_organismInfo_alignmentInfo" name="setting_view" value="organismInfo_alignmentInfo" ${num_radio_checked == 2 ? 'checked' : ''}>
                        <label for="setting_1_organismInfo_alignmentInfo">2. 生物情報&アライメント情報</label>
                        <br>
                        <input type="radio" id="setting_1_multiAlignment" name="setting_view" value="multiAlignment" ${num_radio_checked == 3 ? 'checked' : ''}>
                        <label for="setting_1_multiAlignment">3. マルチアライメント</label>
                    </form>
                </div>
            `,
            /*html*/`
                <div class="m-3">
                    <div class="fs_7 p-2">
                        NCBIのproteinデータベースの情報を取得して、表示形式3のマルチアライメントの表にタンパク質の基質等の結合部位を表示します。<br>
                        ※各データの初回読み込み時には時間がかかります。
                    </div>
                    <form>
                        <input type="checkbox" id="setting_2_show_binding_site" ${get_state_setting_binding_site() ? 'checked' : ''}>
                        <label for="setting_2_show_binding_site">結合部位を表示する</label>
                    </form>
                </div>
            `,
            /*html*/`
                <div class="m-3">
                    <div class="fs_7 p-2">
                        BLAST検索の結果をcsvファイルに保存します。何も選択しない場合、生物種と菌株、タンパク質、生育温度のみ保存します。
                    </div>
                    <form>
                        <input type="checkbox" id="setting_3_protein_id">
                        <label for="setting_3_protein_id">protein idを含む形式</label>

                        <button id="setting_3_download">CSVファイルを保存</button>
                    </form>
                </div>
            `
        ];

        // 内容をまとめる
        let html_setting_contents = ``;
        for (let i = 0; i < arr_html_setting_content.length; i++) {
            // 設定の内容部分（モーダル右側）
            html_setting_contents += /*html*/`
                <div id="modal_setting_content_${i}" class="modal_setting_content" ${i == 0 ? 'style="display: block;"' : 'style="display: none;"'}>
                    <div>
                        <div class="setting_title mb-3">${arr_text_settings[i]}</div>
                    </div>
                    <div id="setting_content">
                        ${arr_html_setting_content[i]}
                    </div>
                </div>
            `;
        }

        return html_setting_contents;
    }
}
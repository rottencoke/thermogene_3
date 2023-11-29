import { icon_setting } from 'icons';
import { get_state_auto_save_apply } from 'state';

export function render_setting() {

    // アイコン
    const html_icon_setting = icon_setting;

    // state_auto_save_apply
    const state_auto_save_apply = get_state_auto_save_apply();

    // 文字
    const arr_text_settings = ["結果の表示設定", "テスト1", "テスト2", "テスト3"];
    const text_setting_0_checkbox_auto_save_sorting = "結果表示設定を自動で保存&適用する";

    // 設定モーダルのタブ作成
    let html_setting_tab = ``;
    for (let i = 0; i < arr_text_settings.length; i++) {
        html_setting_tab += /*html*/`
            <div id="modal_setting_tab_${i}" class="modal_setting_tab p-2 interactive">
                ${arr_text_settings[i]}
            </div>
        `;
    }

    // 結果表示設定の自動保存
    const html_setting_content_0 = /*html*/`
        <div>
            <div>
                <div class="setting_title mb-3">${arr_text_settings[0]}</div>
            </div>
            <div>
                <div class="m-3">
                    <input type="checkbox" id="setting_content_0_auto_save_apply">
                    <label for="setting_content_0_auto_save_apply">
                        ${text_setting_0_checkbox_auto_save_sorting}
                    </label>
                </div>
            </div>
        </div>
    `;

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
                        ${html_setting_content_0}
                    </div>
                </div>
            </div>
        </div>
    `;

    return html_setting;
}
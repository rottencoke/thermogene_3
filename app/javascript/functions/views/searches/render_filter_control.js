import { icon_plus } from 'icons';

export function render_filter_control() {

    // アイコン
    const html_icon_plus = icon_plus;

    // フィルター管理バーのhtml
    let html_filter_control = /*html*/`
        <div id="filter_control_area">
            <div id="filter_default_title" class="sort_show_label text_width hover_background_marked interactive m-4 p-2">
                ${html_icon_plus} フィルターを追加
            </div>
            <div id="filter_added_title" class="sort_show_label text_width hover_background_marked interactive m-4 p-2"  style="display:none;">
                フィルター追加済み
            </div>
            <div class="modal shadow_around_element" id="filter_modal" style="display:none;">
                <div id="modal_filter_content" class="modal_content">
                    <div id="filter_conditions_added" class="flex-container" style="display:none;"></div>
                    <div id="filter_form" class="flex-container">
                        <select id="filter_select">
                            <option value="bit_score">bit score</option>
                            <option value="growth_temperature">生育温度</option>
                            <option value="identity">相同性</option>
                            <!-- <option value="evalue">E Value</option> -->
                        </select>
                        <p class="pt-3">が</p>
                        <input type="number" id="filter_limit_value">
                        <select id="filter_limit_type">
                            <option value="gte">以上</option>
                            <option value="lte">以下</option>
                        </select>
                        <div id="btn_save_filter_value" class="interactive">${html_icon_plus}</div>
                    </div>
                    <div id="btn_show_filter_form" class="mt-4 interactive" style="display:none;">
                        <div class="flex-container">${html_icon_plus} さらにフィルターを追加</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html_filter_control;
}
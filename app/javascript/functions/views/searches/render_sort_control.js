export function render_sort_control() {

    // ソート管理バーのhtml
    let html_sort_control = /*html*/`
        <div id="sort_control_area">
            <div id="sort_add_condition" class="sort_show_label text_width hover_background_marked interactive m-4 p-2">
                <span id="sort_add_condition_select">bit score</span>
                <span class="unhighlighted_text">の</span>
                <span id="sort_add_condition_order">降順</span>
                <span class="unhighlighted_text">でソート</span>
                <span id="sort_add_condition_default_description" class="unhighlighted_text" style="display:inline-block;">(デフォルト)</span>
            </div>
            <div class="modal shadow_around_element" id="sort_modal" style="display:none;">
                <div class="modal_content">
                    <div class="flex-container input-group">
                        <select id="sort_select" class="form-select w-3">
                            <option value="bit_score">bit score</option>
                            <option value="growth_temperature">生育温度</option>
                            <option value="identity">相同性</option>
                            <option value="evalue">E Value</option>
                        </select>
                        <p class="pt-3">の</p>
                        <select id="sort_order" class="form-select">
                            <option value="descending_order">降順</option>
                            <option value="ascending_order">昇順</option>
                        </select>
                        <p class="pt-3">でソート</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html_sort_control;
}
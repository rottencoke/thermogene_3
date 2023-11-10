export function render_sort_control() {

    // ソート管理バーのhtml
    let html_sort_control = /*html*/`
        <div id="sort_control_area" class="container">
            <div id="sort_add_condition" class="text_width selected_text_menu box_element_small hover_background_marked interactive m-4 p-2">
                <span id="sort_add_condition_select" class="highlighted_text">bit score</span>
                &nbsp;の&nbsp;
                <span id="sort_add_condition_order" class="highlighted_text">降順</span>
                &nbsp;でソート&nbsp;
                <span id="sort_add_condition_default_description" style="display:inline-block;">(デフォルト)</span>
            </div>
            <div class="modal box_element_small shadow_around_element" id="sort_modal" style="display:none;">
                <div class="modal_content">
                    <div class="flex-container">
                        <select id="sort_select">
                            <option value="bit_score">bit score</option>
                            <option value="growth_temperature">生育温度</option>
                            <option value="homology">相同性</option>
                            <option value="evalue">E Value</option>
                        </select>
                        <p class="pt-3">の</p>
                        <select id="sort_order">
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
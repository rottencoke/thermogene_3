// ====== モーダルがどれかが表示されているか ======
// getter
export function get_state_modals() {
    return state_modal_sort || state_modal_filter || state_modal_setting;
}

// ====== ソート ======
let state_modal_sort = false;
const arr_state_sort_acceptable = ["growth_temperature-descending_order", "growth_temperature-ascending_order", "identity-descending_order", "identity-ascending_order", "bit_score-descending_order", "bit_score-ascending_order", "evalue-descending_order", "evalue-ascending_order"];
let state_sort = arr_state_sort_acceptable[4];

/// setter
export function set_state_modal_sort(new_state) {
    if (new_state === true || new_state === false) {
        state_modal_sort = new_state;
    }
}

/// getter
export function get_state_modal_sort() {
    return state_modal_sort;
}

/// state_sortのsetter、値の変更用
/// listにない値には変更できない
export function set_state_sort(new_state) {

    if (arr_state_sort_acceptable.includes(new_state)) {
        state_sort = new_state;
    }

}

/// state_sortのgetter、値の取得用
export function get_state_sort() {
    return state_sort;
}

// ====== フィルター ======
let state_modal_filter = false;
let state_filter = [];
let state_filter_loaded = false;

/// setter
export function set_state_modal_filter(new_state) {

    if (new_state === true || new_state === false) {
        state_modal_filter = new_state;
    }
}

/// getter
export function get_state_modal_filter() {
    return state_modal_filter;
}

/// state_filterのsetter
export function set_state_filter(new_state) {

    // 空なら処理しない
    if (new_state === null || new_state === undefined || new_state == "") return;
    const num_state_filter = state_filter.length;
    state_filter[num_state_filter] = new_state;
}

/// splicer、特定の番号のfilterを削除する
export function splice_state_filter(index) {
    state_filter.splice(index, 1);
}

/// state_filterのgetter
export function get_state_filter() {
    return state_filter;
}

/// state_filterがlocalStorageから読み込まれたかどうか
export function set_state_filter_loaded(new_state) {
    if (new_state === true || new_state === false) {
        state_filter_loaded = new_state;
    }
}

// ====== 設定モーダル ======
let state_modal_setting = false;
let state_auto_save_apply = true;

/// setter
export function set_state_modal_setting(new_state) {
    if (new_state === true || new_state === false) {
        state_modal_setting = new_state;
    }
}

/// getter
export function get_state_modal_setting() {
    return state_modal_setting;
}

/// setter
export function set_state_auto_save_apply(new_state) {
    if (new_state === true || new_state === false) {
        state_auto_save_apply = new_state;
    }
}

/// getter
export function get_state_auto_save_apply() {
    return state_auto_save_apply;
}
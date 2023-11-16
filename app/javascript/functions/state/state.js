// state_modal_sort
/// 定義
let state_modal_sort = false;

/// setter
export function set_state_modal_sort(new_state) {
    state_modal_sort = new_state;
}

/// getter
export function get_state_modal_sort() {
    return state_modal_sort;
}

// state_sort
/// 定義
const arr_state_sort_acceptable = ["growth_temperature-descending_order", "growth_temperature-ascending_order", "identity-descending_order", "identity-ascending_order", "bit_score-descending_order", "bit_score-ascending_order", "evalue-descending_order", "evalue-ascending_order"];
let state_sort = arr_state_sort_acceptable[4];

/// state_sortのgetter、値の取得用
export function get_state_sort() {
    return state_sort;
}

/// state_sortのsetter、値の変更用
/// listにない値には変更できない
export function set_state_sort(new_state) {

    if (arr_state_sort_acceptable.includes(new_state)) {
        state_sort = new_state;
    }

}

// state_modal_filter
/// 定義
let state_modal_filter = false;

/// setter
export function set_state_modal_filter(new_state) {
    state_modal_filter = new_state;
}

/// getter
export function get_state_modal_filter() {
    return state_modal_filter;
}

// state_filter
/// 定義
let state_filter = [];

/// state_filterのsette
export function set_state_filter(new_state) {
    const num_state_filter = state_filter.length;
    state_filter[num_state_filter] = new_state;
}

/// splicer
export function splice_state_filter(index) {
    state_filter.splice(index, 1);
}


/// state_filterのgetter
export function get_state_filter() {
    return state_filter;
}

// state_exclude
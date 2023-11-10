// state_sort
/// 定義
const state_sort_acceptable_list = ["growth_temperature-descending_order", "growth_temperature-ascending_order", "homology-descending_order", "homology-ascending_order", "bit_score-descending_order", "bit_score-ascending_order", "evalue-descending_order", "evalue-ascending_order"];
let state_sort = state_sort_acceptable_list[4];

/// state_sortのgetter、値の取得用
export function get_state_sort() {
    console.log("get state sort : " + state_sort);
    return state_sort;
}

/// state_sortのsetter、値の変更用
/// listにない値には変更できない
export function set_state_sort(new_state) {

    for (let i = 0; i < state_sort_acceptable_list.length; i++){

        if (new_state == state_sort_acceptable_list[i]) {

            state_sort = new_state;
            console.log("state changed to : " + state_sort);
        }
    }
}

// state_modal_sort
/// 定義
let state_modal_sort = false;

/// getter
export function get_state_modal_sort() {
    console.log("get state modal_sort : " + state_modal_sort);
    return state_modal_sort;
}

/// setter
export function set_state_modal_sort(new_state) {
    state_modal_sort = new_state;
    console.log("state changed to : " + state_modal_sort);
}

/// state_filter

/// state_exclude


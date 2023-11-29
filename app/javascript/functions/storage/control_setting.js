import { set_state_sort, set_state_filter, set_state_auto_save_apply } from 'state';
import { get_state_sort, get_state_filter, get_state_auto_save_apply } from 'state';

// localstorageへの保存形式
// setting : {
// 	auto_save_apply : <Boolean>,
// 	sort : <ソートの種類>,
// 	filter : [
// 		<filter 1>,
// 		<filter 2>, ...
// 	]
// }

// localstorageのsettingの読み込み
/// なかったらデフォルト値にするようにする
/// デフォルト値の設定はこの関数じゃなく、stateのファイルでやりたいから、返り値(falseとか)を設定する
export function load_setting() {

    // localStorageからのsettingの読み込み
    const json_setting = localStorage.getItem('setting');

    // settingが存在すれば解凍
    if (!json_setting) return;
    const obj_setting = JSON.parse(json_setting);

    // state_auto_save_applyがfalseの場合、stateに適用はしない
    const state_auto_save_apply = obj_setting.auto_save_apply;

    if (state_auto_save_apply) {

        // sortの読み込み適用
        set_state_sort(obj_setting.sort);

        // filterの読み込み適用
        /// state_filterは配列やからそれぞれ代入
        const arr_setting_filter = obj_setting.filter;
        for (let i = 0; i < arr_setting_filter.length; i++) {
            set_state_filter(arr_setting_filter[i]);
        }

    }

    // auto_save_applyの読み込み適用
    set_state_auto_save_apply(state_auto_save_apply);

}

// localstorageのsettingの書き込み
/// なかったら作成
export function save_setting() { 

    // auto_save_applyの取得
    const state_auto_save_apply = get_state_auto_save_apply();

    // auto_save_applyがfalseの場合、auto_save_applyのみ保存する
    /// sortの取得
    const state_sort = state_auto_save_apply ? get_state_sort() : "";

    /// filterの取得
    const arr_state_filter = state_auto_save_apply ? get_state_filter() : "";

    // オブジェクトの作成
    const obj_setting = {
        auto_save_apply: state_auto_save_apply,
        sort: state_sort,
        filter: arr_state_filter
    };

    // jsonに変換
    const json_setting = JSON.stringify(obj_setting);

    // localstorageに保存
    localStorage.setItem("setting", json_setting);
}
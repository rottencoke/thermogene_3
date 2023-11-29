import { set_state_filter, splice_state_filter, get_state_filter, set_state_modal_filter, get_state_modal_filter, get_state_modals } from 'state';
import { icon_edit, icon_delete } from 'icons';
import { render_results } from 'render_results';
import { save_setting } from 'control_setting';

// フィルター管理画面の表示の管理
export async function control_modal_filter() {
    
    // html要素の取得
    const element_body = document.body;
    const element_filter_modal = document.getElementById('filter_modal');
    const element_filter_default_title = document.getElementById('filter_default_title');
    const element_filter_added_title = document.getElementById('filter_added_title');
    const element_btn_save_filter_value = document.getElementById('btn_save_filter_value');
    const element_filter_select = document.getElementById('filter_select');
    const element_filter_limit_value = document.getElementById('filter_limit_value');
    const element_filter_limit_type = document.getElementById('filter_limit_type');
    const element_filter_conditions_added = document.getElementById('filter_conditions_added');
    const element_filter_form = document.getElementById('filter_form');
    const element_btn_show_filter_form = document.getElementById('btn_show_filter_form');
    const element_icon_filter_condition = document.querySelectorAll('.icon_filter_condition');
    const element_filter_limit_multiplier_value = document.getElementById('filter_limit_multiplier_value');


    //
    // ================= イベント ====================
    //

    // ======モーダルを表示======
    /// 選択したソートの条件の表示をクリックしたときにモーダルを表示
    element_filter_default_title.addEventListener('click', function (event) {

        // 別のモーダルが開いてたらreturn
        if (get_state_modals()) return;

        // filter_conditions_addedをある分作成する
        update_filter_conditions_added();

        show_modal(event, element_filter_default_title);

        // state_modal_filterをtrueに
        set_state_modal_filter(true);

    });
    // こっちもモーダルを表示
    element_filter_added_title.addEventListener('click', function (event) {

        // 別のモーダルが開いてたらreturn
        if (get_state_modals()) return;

        // filter_conditions_addedをある分作成する
        update_filter_conditions_added();

        show_modal(event, element_filter_added_title);

        // state_modal_filterをtrueに
        set_state_modal_filter(true);

    });

    // ======モーダルを閉じる======
    // モーダルの外側をクリックしたときにモーダルを閉じて、フィルターを実行
    window.addEventListener('click', async function (event) {

        if (!element_filter_modal.contains(event.target) && get_state_modal_filter() ) {

            // モーダル内のアイコンがクリックされたときにモーダルが消えるバグ対策
            if (event.target.closest('.icon_filter_condition')) {
                return;
            }

            element_filter_modal.style.display = 'none';
            
            // スクロールを再度有効に
            element_body.classList.remove('no_scroll');
            element_body.style.paddingRight = '';

            // state_modal_filterをfalseに
            set_state_modal_filter(false);

            // state_filterがあるなら、filter_default_titleを非表示にして、filter_added_titleを表示する
            if (get_state_filter().length) {
                element_filter_default_title.style.display = 'none';
                element_filter_added_title.style.display = 'block';
            } else {
                element_filter_default_title.style.display = 'block';
                element_filter_added_title.style.display = 'none';
            }

            // state_filterに従ってフィルターを実行
            await render_results();

            // localstorageのsettingを保存
            save_setting();

        }
    });

    // ======選択されたフィルターの種類に応じて数値入力部のレイアウトの変更======
    // 生育温度、相同性、evalueの場合はそれぞれのレイアウトに変更する
    element_filter_select.addEventListener("change", function () {
        
        // 入力されたフィルターの種類の取得
        const value_filter_select = element_filter_select.options[element_filter_select.selectedIndex].value;

        // 変更する対象の取得
        const element_filter_unit_of_temperature = document.getElementById('filter_unit_of_temperature');
        const element_filter_unit_of_identity = document.getElementById('filter_unit_of_identity');
        const element_filter_unit_of_evalue = document.getElementById('filter_unit_of_evalue');
        
        // フィルターの種類に応じて、フィルターのフォームのレイアウトを変更する
        switch (value_filter_select) {

            /// bit_scoreの場合
            case "bit_score":
                element_filter_unit_of_temperature.style.display = 'none';
                element_filter_unit_of_identity.style.display = 'none';
                element_filter_unit_of_evalue.style.display = 'none';
                element_filter_limit_multiplier_value.style.display = 'none';
                break;
            
            /// 生育温度の場合
            case "growth_temperature":
                element_filter_unit_of_temperature.style.display = 'block';
                element_filter_unit_of_identity.style.display = 'none';
                element_filter_unit_of_evalue.style.display = 'none';
                element_filter_limit_multiplier_value.style.display = 'none';
                break;
            
            /// 相同性の場合
            case "identity":
                element_filter_unit_of_temperature.style.display = 'none';
                element_filter_unit_of_identity.style.display = 'block';
                element_filter_unit_of_evalue.style.display = 'none';
                element_filter_limit_multiplier_value.style.display = 'none';
                break;
            
            /// evalueの場合
            case "evalue":
                element_filter_unit_of_temperature.style.display = 'none';
                element_filter_unit_of_identity.style.display = 'none';
                element_filter_unit_of_evalue.style.display = 'block';
                element_filter_limit_multiplier_value.style.display = 'block';
                break;
        }
    });

    // ======"+"押してフィルター追加======
    element_btn_save_filter_value.addEventListener('click', function (event) {
        listen_change_filter();
    });

    // ======="+ さらにフィルターを追加"を押してfilter formを表示======
    element_btn_show_filter_form.addEventListener('click', function (event) {
        
        // filter_formを表示
        element_filter_form.style.display = 'flex';

        // btn_show_filter_formを非表示
        element_btn_show_filter_form.style.display = 'none';

    });

    //
    // =================== 関数 ===================
    //

    // ======モーダル表示======
    function show_modal(event, element) {

        // 他の要素へのイベントの伝播を停止
        // これによりwindowでのイベントとはならず、開いたと同時に閉じることはなくなる
        event.stopPropagation();

        // スクロールバーの幅を計算
        const scrollbar_width = window.innerWidth - document.documentElement.clientWidth;

        // スクロールバーが存在する場合はpadding-rightを設定
        // これを行うことにより、スクロールを禁止した際にブラウザのスクロールバーが非表示になることによって、ブラウザの表示がずれるのを防ぐ
        if (scrollbar_width > 0) {
            element_body.style.paddingRight = scrollbar_width + 'px';
        }

        // 位置取得
        const filter_add_rect = element.getBoundingClientRect();

        // 表示
        element_filter_modal.style.display = 'block';

        // ボタンの左端に合わせる
        element_filter_modal.style.left = filter_add_rect.left + 'px'; 

        // ボタンの下端の直下に表示
        element_filter_modal.style.top = filter_add_rect.bottom + window.scrollY + 10 + 'px';

        // スクロールを禁止
        element_body.classList.add('no_scroll');

    }

    // ======モーダルでフィルターを選択======
    // プルダウンメニューの変更イベントをリスニング
    function listen_change_filter() {

        // 入力された値の取得
        const value_filter_select = element_filter_select.options[element_filter_select.selectedIndex].value;
        const value_filter_limit_value = element_filter_limit_value.value;
        const value_filter_limit_type = element_filter_limit_type.options[element_filter_limit_type.selectedIndex].value;
        const value_filter_limit_multiplier_value = element_filter_limit_multiplier_value.value;

        // もしどれかが入力されていない場合、何も処理を行わない
        if (!value_filter_select || !value_filter_limit_value || !value_filter_limit_type) return;

        // state_filterを保存
        let value_state_filter = `${value_filter_select}-${value_filter_limit_value}-${value_filter_limit_type}`;
        if (value_filter_select == "evalue") value_state_filter += `-${value_filter_limit_multiplier_value}`;
        set_state_filter(value_state_filter);

        
        // filter_conditions_addedをある分作成する
        update_filter_conditions_added();

    }

    // filter_conditions_addedをある分作成する
    function update_filter_conditions_added() {

        // stateからすでに登録されてるフィルターの数を取得
        const number_filter_added = get_state_filter().length;
        
        // filter_conditions_addedをある分作成する
        element_filter_conditions_added.innerHTML = ``;
        for (let i = 0; i < number_filter_added; i++) {
            element_filter_conditions_added.innerHTML += render_filter_condition_added(i);
        }

        // filter_conditions_addedを表示
        element_filter_conditions_added.style.display = 'block';

        // filter_formを非表示
        element_filter_form.style.display = 'none';

        // btn_show_filter_formを表示
        element_btn_show_filter_form.style.display = 'block';

        // #filter_condition_addedを作成
        function render_filter_condition_added(index) {

            // 表示する文字を定義
            let text_filter_select = "",
                text_filter_unit = "",
                text_filter_limit_multiplier_value = "",
                text_filter_limit_type = "";

            // フィルター条件を表示
            switch (split_state_filter(index)[0]) {
                case "growth_temperature":
                    text_filter_select = "生育温度";
                    text_filter_unit = "°C";
                    break;
                case "identity":
                    text_filter_select = "相同性";
                    text_filter_unit = "%";
                    break;
                case "bit_score":
                    text_filter_select = "bit score";
                    break;
                case "evalue":
                    text_filter_select = "E Value";
                    text_filter_unit = "e-";
                    text_filter_limit_multiplier_value = split_state_filter(index)[3];
                    break;
            }

            if (split_state_filter(index)[2] == "gte") text_filter_limit_type = "以上";
            else if (split_state_filter(index)[2] = "lte") text_filter_limit_type = "以下";

            // 追加されたフィルターの条件を文字列にして返す
            const text_filter_string = `${text_filter_select}が${split_state_filter(index)[1]}${text_filter_unit}${text_filter_limit_multiplier_value}${text_filter_limit_type}`;

            // アイコン
            /// 編集アイコン
            const html_icon_edit = icon_edit;
            /// 削除アイコン
            const html_icon_delete = icon_delete;

            // 返すhtml
            let html_filter_condition_added = /*html*/`
                <div id="filter_condition_added_${index}" class="flex-container">
                    <div>
                        <p>${text_filter_string}</p>
                    </div>
                    <div class="filter_condition_added_icon_edit icon_filter_condition interactive" icon_edit_index="${index}">${html_icon_edit}</div>
                    <div class="filter_condition_added_icon_delete icon_filter_condition interactive" icon_delete_index="${index}">${html_icon_delete}</div>
                </div>
            `;

            // 返り値
            return html_filter_condition_added;

        }

        //
        // =================イベント====================
        //
        // ======削除アイコンを押してfilterを削除======
        document.querySelectorAll('.filter_condition_added_icon_delete').forEach((item, index) => {

            item.addEventListener('click', function () {

                // stateを削除
                splice_state_filter(index);
                
                // このアイコンの親要素を見つける
                const parentElement = this.closest('.flex-container');

                // 親要素が存在する場合、それを削除
                if (parentElement) {
                    parentElement.remove();
                }
            });
        });
        // ======編集アイコンを押してfilterを編集======
        // formの表示、formの値をstateの値にして表示、stateを削除
        document.querySelectorAll('.filter_condition_added_icon_edit').forEach((item, index) => {

            item.addEventListener('click', function () {

                // filter_formに値を入力
                /// filter_select
                element_filter_select.value = split_state_filter(index)[0];

                /// value_filter_limit_value
                element_filter_limit_value.value = split_state_filter(index)[1];

                /// value_filter_limit_type
                element_filter_limit_type.value = split_state_filter(index)[2];

                // stateを削除
                splice_state_filter(index);

                // filter_formを表示
                element_filter_form.style.display = 'flex';

                // btn_show_filter_formを非表示
                element_btn_show_filter_form.style.display = 'none';

                // filter_conditions_addedを表示
                element_filter_conditions_added.style.display = 'none';

            });

        });
    }

    // state_filterの値を取得して、3つの要素に分ける
    function split_state_filter(index) {

        // state_filterの値を取得
        const state_filter = get_state_filter()[index];
        
        const state_filter_value_filter_select = state_filter.split('-')[0];
        const state_filter_value_filter_limit_value = state_filter.split('-')[1];
        const state_filter_value_filter_limit_type = state_filter.split('-')[2];
        let state_filter_limit_multiplier_value = "";
        if (state_filter.split('-')[3]) state_filter_limit_multiplier_value = state_filter.split('-')[3];

        return [
            state_filter_value_filter_select,
            state_filter_value_filter_limit_value,
            state_filter_value_filter_limit_type,
            state_filter_limit_multiplier_value
        ];
    }
    

}
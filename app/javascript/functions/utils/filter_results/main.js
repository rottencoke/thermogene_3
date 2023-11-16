import { set_state_filter, get_state_filter, set_state_modal_filter, get_state_modal_filter, get_state_modal_sort } from "state";
import { render_results } from "render_results";
import { icon_edit, icon_delete } from 'icons';

// フィルター管理画面の表示の管理
export async function control_filter() {
    
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

    //
    // ================= イベント ====================
    //

    // ======モーダルを表示======
    /// 選択したソートの条件の表示をクリックしたときにモーダルを表示
    element_filter_default_title.addEventListener('click', function (event) {

        // 別のモーダルが開いてたらreturn
        if (get_state_modal_sort()) return;

        show_modal(event, element_filter_default_title);

        // state_modal_filterをtrueに
        set_state_modal_filter(true);

    });
    // こっちもモーダルを表示
    element_filter_added_title.addEventListener('click', function (event) {

        // 別のモーダルが開いてたらreturn
        if (get_state_modal_sort()) return;

        show_modal(event, element_filter_added_title);

        // state_modal_filterをtrueに
        set_state_modal_filter(true);

    });

    // ======モーダルを閉じる======
    // モーダルの外側をクリックしたときにモーダルを閉じる
    window.addEventListener('click', async function (event) {

        if (!element_filter_modal.contains(event.target) && get_state_modal_filter()) {

            element_filter_modal.style.display = 'none';
            
            // スクロールを再度有効に
            element_body.classList.remove('no_scroll');
            element_body.style.paddingRight = '';

            // state_modal_filterをfalseに
            set_state_modal_filter(false);

            // state_filterがあるなら、filter_default_titleを非表示にして、filter_added_titleを表示する
            if (get_state_filter().length > 0) {
                element_filter_default_title.style.display = 'none';
                element_filter_added_title.style.display = 'block';
            }

            // フィルター実行
            execute_filter();

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
        const value_filter_limit_type = element_filter_limit_type.options[element_filter_select.selectedIndex].value;

        // もしどれかが入力されていない場合、何も処理を行わない
        if (!value_filter_select || !value_filter_limit_value || !value_filter_limit_type) return;

        // state_filterを保存
        const value_state_filter = `${value_filter_select}-${value_filter_limit_value}-${value_filter_limit_type}`;
        set_state_filter(value_state_filter);

        // 表示する文字を定義
        let text_filter_select, text_filter_limit_type = "";

        // フィルター条件を表示
        if (value_filter_select == "growth_temperature") text_filter_select = "生育温度";
        else if (value_filter_select == "identity") text_filter_select = "相同性";
        else if (value_filter_select == "bit_score") text_filter_select = "bit score";
        else if (value_filter_select == "evalue") text_filter_select = "E Value";

        if (value_filter_limit_type == "gte") text_filter_limit_type = "以上";
        else if (value_filter_limit_type = "lte") text_filter_limit_type = "以下";

        // stateからすでに登録されてるフィルターの数を取得
        const number_filter_added = get_state_filter().length;
        
        element_filter_conditions_added.innerHTML += render_filter_condition_added(number_filter_added - 1);

        // filter_conditions_addedを表示
        element_filter_conditions_added.style.display = 'block';

        // filter_formを非表示
        element_filter_form.style.display = 'none';

        // btn_show_filter_formを表示
        element_btn_show_filter_form.style.display = 'block';

        // #filter_condition_addedを作成
        function render_filter_condition_added(index) {

            // アイコン
            /// 編集アイコン
            const html_icon_edit = icon_edit;
            /// 削除アイコン
            const html_icon_delete = icon_delete;

            // 返すhtml
            let html_filter_condition_added = /*html*/`
                <div id="filter_condition_added_${index}" class="flex-container">
                    <div>
                        <p>${text_filter_select}が${value_filter_limit_value}${text_filter_limit_type}</p>
                    </div>
                    <div class="icon_pos interactive">${html_icon_edit}</div>
                    <div class="icon_pos interactive">${html_icon_delete}</div>
                </div>
            `;

            // 返り値
            return html_filter_condition_added;


        }
    }

    // ======フィルター実行======
    // 「フィルターを実行」をクリックしたら動く
    async function execute_filter() {

    }
    

}
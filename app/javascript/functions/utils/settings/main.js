import { set_state_modal_setting, get_state_modal_setting, get_state_modals } from 'state';
import { set_state_auto_save_apply, get_state_auto_save_apply } from 'state';
import { set_state_setting_view, get_state_setting_view } from 'state';
import { save_setting } from 'control_setting';
import { render_results } from 'render_results';

// いったんページ切り替えの機能はつけない
export async function control_setting() {
    
    // html要素の取得
    const element_body = document.body;
    const element_setting_icon = document.getElementById('setting_icon');
    const element_setting_modal = document.getElementById('setting_modal');
    const element_setting_0_auto_save_apply = document.getElementById('setting_0_auto_save_apply');
    const element_setting_1_radio = document.querySelectorAll('input[name="setting_view"]');
    const element_modal_setting_tab = document.querySelectorAll('.modal_setting_tab');
    const element_modal_setting_content = document.querySelectorAll('.modal_setting_content');
    const element_modal_setting_tab_0 = document.getElementById('modal_setting_tab_0');

    // ここで設定タブの0番目の背景色を設定する
    /// なぜかこれをcssで設定すると動的に変更することができなくなる
    element_modal_setting_tab_0.style.backgroundColor = 'var(--color-background-selected)';

    //
    // ================ イベント ==============
    //

    // ====== モーダルを表示 ======
    /// 設定アイコンをクリックしたときにモーダルを表示
    element_setting_icon.addEventListener('click', function (event) {

        // 別のモーダルが開いてたらreturn
        if (get_state_modals()) return;

        // auto_save_applyのcheckedを更新
        element_setting_0_auto_save_apply.checked = get_state_auto_save_apply();

        show_modal(event, element_setting_icon);

        // state_modal_filterをtrueに
        set_state_modal_setting(true);

    });

    // ====== モーダルを閉じる ======
    /// モーダル外をクリックしてモーダルを閉じる
    window.addEventListener('click', async function (event) {

        if (element_setting_modal.contains(event.target) || !get_state_modal_setting()) return;

        // モーダルを非表示に
        element_setting_modal.style.display = 'none';

        // スクロールを再度有効に
        element_body.classList.remove('no_scroll');
        element_body.style.paddingRight = '';

        // state_modal_settingをfalseに
        set_state_modal_setting(false);

        // 設定モーダル内の設定を適用する
        save_setting_auto_save_apply();

        // 表示設定を保存する
        await save_setting_view();

        // localstorageのsettingを保存
        save_setting();

    });

    // ====== 設定のタブのクリック ======
    element_modal_setting_tab.forEach(item => {
        item.addEventListener('click', function() {

            // 選択された設定タブの内容を表示
            open_setting_tab(this.id);
            
        });
    });

    //
    // ================= 関数 =================
    //

    // ====== モーダル表示 ======
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
        element_setting_modal.style.display = 'block';

        // ボタンの左端に合わせる
        element_setting_modal.style.left = filter_add_rect.left + 'px'; 

        // ボタンの下端の直下に表示
        element_setting_modal.style.top = filter_add_rect.bottom + window.scrollY + 10 + 'px';

        // スクロールを禁止
        element_body.classList.add('no_scroll');
    }

    // 設定を保存する
    function save_setting_auto_save_apply() {

        // チェックボックスの値を取得
        const is_checked_element_setting_content_0_auto_save_apply = element_setting_0_auto_save_apply.checked;

        // stateに保存
        set_state_auto_save_apply(is_checked_element_setting_content_0_auto_save_apply);
    }

    // 開く設定タブの変更
    function open_setting_tab(id) {

        // いったんすべての設定タブの背景色を削除する
        element_modal_setting_tab.forEach(element => {
            element.style.backgroundColor = null;
        });

        // 選択された設定タブの背景色を設定する
        document.getElementById(id).style.backgroundColor = 'var(--color-background-selected)';

        // 選択された設定タブの番号を取得する
        const num_setting_tab = id.split('_')[3];

        // いったん表示してる設定タブを非表示にする
        /// クラスが一致するものをすべて非表示
        element_modal_setting_content.forEach(element => {
            element.style.display = 'none';
        });

        // 選択された設定タブの内容の要素の取得
        const element_target_modal_setting_content = document.getElementById(`modal_setting_content_${num_setting_tab}`);

        // 選択された設定タブの内容を表示
        element_target_modal_setting_content.style.display = 'block';

    }

    // 結果の表示設定の適用
    async function save_setting_view() {

        // ラジオボタンの値を取得
        const radios = element_setting_1_radio;

        // すでに登録されているstateの値の取得
        const state_setting_view_set = get_state_setting_view();

        // 選択された値の取得
        let state_setting_view_new;
        for (let radio of radios) {
            if (radio.checked) {
                state_setting_view_new = radio.value;
            }
        }

        // 変更された場合
        if (state_setting_view_new != state_setting_view_set) {

            // stateの値の更新
            set_state_setting_view(state_setting_view_new);

            // 結果を描画しなおす
            await render_results();
        }

    }
}
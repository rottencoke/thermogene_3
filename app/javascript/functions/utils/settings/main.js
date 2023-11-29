import { set_state_modal_setting, get_state_modal_setting, get_state_modals } from 'state';
import { set_state_auto_save_apply, get_state_auto_save_apply } from 'state';
import { save_setting } from 'control_setting';

// いったんページ切り替えの機能はつけない
export function control_setting() {
    
    // html要素の取得
    const element_body = document.body;
    const element_setting_icon = document.getElementById('setting_icon');
    const element_setting_modal = document.getElementById('setting_modal');
    const element_setting_content_0_auto_save_apply = document.getElementById('setting_content_0_auto_save_apply');

    //
    // ================ イベント ==============
    //

    // ====== モーダルを表示 ======
    /// 設定アイコンをクリックしたときにモーダルを表示
    element_setting_icon.addEventListener('click', function (event) {

        // 別のモーダルが開いてたらreturn
        if (get_state_modals()) return;

        // auto_save_applyのcheckedを更新
        element_setting_content_0_auto_save_apply.checked = get_state_auto_save_apply();

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

        // localstorageのsettingを保存
        save_setting();

    })

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
        const is_checked_element_setting_content_0_auto_save_apply = element_setting_content_0_auto_save_apply.checked;

        // stateに保存
        set_state_auto_save_apply(is_checked_element_setting_content_0_auto_save_apply);
    }
}
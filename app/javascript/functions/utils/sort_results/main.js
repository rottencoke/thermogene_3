import { set_state_sort, set_state_modal_sort, get_state_modal_sort } from "state";
import { render_results } from "render_results";

// ソート管理画面の表示の管理
export async function control_sort() {

    // html要素の取得
    const element_sort_modal = document.getElementById('sort_modal');
    const element_sort_add_condition = document.getElementById('sort_add_condition');
    const element_body = document.body;

    // ======モーダルを表示======
    /// 選択したソートの条件の表示をクリックしたときにモーダルを表示
    element_sort_add_condition.addEventListener('click', function (event) {

        show_modal(event, element_sort_add_condition);

        // state_modal_sortをtrueに
        set_state_modal_sort(true);

    });
    
    // ======モーダルを閉じる======
    // モーダルの外側をクリックしたときにモーダルを閉じる
    window.addEventListener('click', async function (event) {

        if (!element_sort_modal.contains(event.target) && get_state_modal_sort()) {

            console.log("close modal");

            element_sort_modal.style.display = 'none';
            
            // スクロールを再度有効に
            element_body.classList.remove('no_scroll');
            element_body.style.paddingRight = '';

            // state_modal_sortをfalseに
            set_state_modal_sort(false);

            await listen_change_sort();

        }
    });

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
        const sort_add_rect = element.getBoundingClientRect();

        // 表示
        element_sort_modal.style.display = 'block';

        // ボタンの左端に合わせる
        element_sort_modal.style.left = sort_add_rect.left + 'px'; 

        // ボタンの下端の直下に表示
        element_sort_modal.style.top = sort_add_rect.bottom + window.scrollY + 10 + 'px';

        // スクロールを禁止
        element_body.classList.add('no_scroll');
    }

    // ======モーダルでソートを選択======
    // プルダウンメニューの変更イベントをリスニング
    async function listen_change_sort() {

        // 要素の取得
        const sort_select = document.getElementById('sort_select');
        const sort_order = document.getElementById('sort_order');
        const sort_add_condition = document.getElementById('sort_add_condition');
        const sort_add_condition_select = document.getElementById('sort_add_condition_select');
        const sort_add_condition_order = document.getElementById('sort_add_condition_order');
        const sort_add_condition_default_description = document.getElementById('sort_add_condition_default_description');

        // 入力されたプルダウンメニューの値を取得
        const value_sort_select = sort_select.options[sort_select.selectedIndex].value;
        const value_sort_order = sort_order.options[sort_order.selectedIndex].value;

        // 表示する文字
        let text_sort_select, text_sort_order = "";

        // もし片方でも入力されてない場合、何も処理を行わない
        if (!(value_sort_select && value_sort_order)) return;

        console.log("all chosen");

        // ソートの文字を表示
        if (value_sort_select == "growth_temperature") text_sort_select = "生育温度";
        else if (value_sort_select == "identity") text_sort_select = "相同性";
        else if (value_sort_select == "bit_score") text_sort_select = "bit score";
        else if (value_sort_select == "evalue") text_sort_select = "E Value";
        sort_add_condition_select.innerText = text_sort_select;

        if (value_sort_order == "descending_order") text_sort_order = "降順";
        else if (value_sort_order == "ascending_order") text_sort_order = "昇順";

        sort_add_condition_order.innerText = text_sort_order;

        sort_add_condition.style.display = 'block';

        // bit score降順の場合のみ、デフォルトってのことを表記
        if (value_sort_select == "bit_score" && value_sort_order == "descending_order") {
            sort_add_condition_default_description.style.display = 'inline-block';
        } else {
            sort_add_condition_default_description.style.display = 'none';
        }

        // ソートの関数呼び出し
        switch (value_sort_select + '-' + value_sort_order) {
            
            case 'growth_temperature-descending_order':
                console.log("growth_temperature-descending_order");
                set_state_sort("growth_temperature-descending_order");
                await render_results();
                break;
            
            case 'growth_temperature-ascending_order':
                console.log("growth_temperature-ascending_order");
                set_state_sort("growth_temperature-ascending_order");
                await render_results();
                break;
            
            case 'identity-descending_order':
                console.log("identity-descending_order");
                set_state_sort("identity-descending_order");
                await render_results();
                break;
            
            case 'identity-ascending_order':
                console.log("identity-ascending_order");
                set_state_sort("identity-ascending_order");
                await render_results();
                break;
            
            case 'bit_score-descending_order':
                console.log("bit_score-descending_order");
                set_state_sort("bit_score-descending_order");
                await render_results();
                break;
            
            case 'bit_score-ascending_order':
                console.log("bit_score-ascending_order");
                set_state_sort("bit_score-ascending_order");
                await render_results();
                break;
            
            case 'evalue-descending_order':
                console.log("evalue-descending_order");
                set_state_sort("evalue-descending_order");
                await render_results();
                break;
            
            case 'evalue-ascending_order':
                console.log("evalue-ascending_order");
                set_state_sort("evalue-ascending_order");
                await render_results();
                break;
            
            default:
                console.log('その組み合わせはありません');
                break; 
        }

    }



}
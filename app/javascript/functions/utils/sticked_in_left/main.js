import { get_state_setting_view } from 'state';

export function sticked_in_left() {

    if (get_state_setting_view() != "multiAlignment") return;

    // 固定されているかどうか
    let is_sticked = false;
    let pos_sticked = 0;


    // 要素の取得
    const element_result_table_multiAlignment = document.getElementById('result_table_multiAlignment');
    const root_style = getComputedStyle(document.documentElement);

    console.log("ok1")
    element_result_table_multiAlignment.addEventListener('scroll', function () {
        console.log("ok2")
        const elements_sticked_in_left = document.querySelectorAll('.sticked_in_left');

        // 最初の要素で判別
        const stickyPosition = elements_sticked_in_left[0].getBoundingClientRect().left;
        console.log(stickyPosition);

        // 固定されてない場合
        if (pos_sticked != stickyPosition) {

            // 位置を記録
            pos_sticked = stickyPosition;

            console.log("固定されていない");

            // 固定されなくなった場合
            if (is_sticked) {
                is_sticked = false;
                change_background_color(elements_sticked_in_left, 0); // 元の背景色に戻す
                console.log("固定されなくなった")
            }

        }

        // 固定されている場合
        else {
            // 位置を記録
            pos_sticked = stickyPosition;

            console.log('固定中');

            // 固定されるようになった場合
            if (!is_sticked) {
                is_sticked = true;
                change_background_color(elements_sticked_in_left, 1); // 背景を明るくする
                console.log("固定され始め")
            }
        }

    });
    
    function change_background_color(elements, n) {


        for (var i = 0; i < elements.length; i++) {

            const element = elements[i];

            console.log(element)
    
            // 元の背景色を取得
            const color_original = window.getComputedStyle(element.parentNode).backgroundColor;

            console.log("iro : " + color_original);

            // 色1の場合
            if (color_original == root_style.getPropertyValue('--color-background-table-raw-1').trim()) {

                // 色を変える場合
                if (n == 1) {
                    element.style.backgroundColor = 'var(--color-background-table-raw-1-lightened)';
                }
                // 色を戻す場合
                else {
                    element.style.backgroundColor = color_original;
                }
            }
            // 色2の場合
            else if (color_original == root_style.getPropertyValue('--color-background-table-raw-2').trim()) {
                // 色を変える場合
                if (n == 1) {
                    element.style.backgroundColor = 'var(--color-background-table-raw-2-lightened)';
                }
                // 色を戻す場合
                else {
                    element.style.backgroundColor = color_original;
                }
            }
        }

    }
    
}
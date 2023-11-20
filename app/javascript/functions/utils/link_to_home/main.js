// アイコンかタイトルをクリックした場合にトップページに遷移する
export function open_home_page() {
    document.addEventListener('DOMContentLoaded', function () {
        // IDによって要素を取得
        const element_page_title = document.getElementById('page_title');
        const element_header_icon = document.getElementById('header_icon');

        // ヘッダータイトルへのクリックでホーム遷移
        element_page_title.addEventListener('click', function () {
            open_home_page();
        });

        // アイコンへのクリックでホーム遷移
        element_header_icon.addEventListener('click', function () {
            open_home_page();
        });

        // URLを開く
        function open_home_page() {
            window.open('/', '_self');
        }
    });
}

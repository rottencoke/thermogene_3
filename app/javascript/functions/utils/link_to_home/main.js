// アイコンかタイトルをクリックした場合にトップページに遷移する
export function open_home_page() {
    document.addEventListener('DOMContentLoaded', function () {
        // IDによって要素を取得
        const element_page_title = document.getElementById('page_title');

        // ヘッダータイトルへのクリックでホーム遷移
        element_page_title.addEventListener('click', function () {
            open_home_page();
        });

        // URLを開く
        function open_home_page() {
            window.open('/', '_self');
        }
    });
}

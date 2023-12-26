// URLからsearch_idを取得する
export function get_search_id() {

    // これで表示されてるページのURLを取得できる
    const currentURL = window.location.href;

    const splitted_currentURL = currentURL.split("/");

    const search_id = splitted_currentURL[splitted_currentURL.length - 1];

    // 数字じゃなかったらreturn
    if (!/^\d+(\.\d+)?$/.test(search_id)) return false;

    return search_id;

}
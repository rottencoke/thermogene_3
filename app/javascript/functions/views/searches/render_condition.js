import { get_search } from 'get_search';
import { show_if_there } from 'show_if_there';

export async function render_condition() {

    // searchのデータ取得
    const search = await get_search();

    // <header>のメインタイトル
    const condition_title = "検索条件です";

    // <table>のヘッダー
    const th_search_id = "SEARCH ID";
    const th_jobtitle = "JOB TITLE";
    const th_temperature = "生育温度";
    const th_sequence = "Query配列";
    const th_search_blast_engine = "BLAST検索プログラム";
    const th_search_method = "検索方法";
    const th_identity = "相同性";
    const th_evalue = "E Value";
    const th_created_at = "検索開始時刻";

    // <table>のデータ
    const td_search_id = search.id;
    const td_jobtitle = search.jobtitle;
    const td_temperature_minimum = search.temperature_minimum;
    const td_temperature_maximum = search.temperature_maximum;
    const td_sequence = search.sequence.replace(/(\r\n?|\n)/g, "");
    const td_search_blast_engine = search.search_blast_engine;
    const td_search_method = show_search_method(search.search_method);
    const td_identity_minimum = show_if_there(search.identity_minimum);
    const td_identity_maximum = show_if_there(search.identity_maximum);
    const td_evalue_minimum = show_if_there(search.evalue_minimum);
    const td_evalue_maximum = show_if_there(search.evalue_maximum);
    const td_created_at = formatDate(search.created_at);

    return /*html*/`
        <div id="search_condition_area" class="container">
            <p>${condition_title}</p>
            <div id="search_condition_content_area" class="container">
                <div id="search_condition" class="container">
                    <table>
                        <tr>
                            <th class="condition_th">${th_search_id}</th>
                            <td>${td_search_id}</td>
                        </tr>
                        <tr>
                            <th class="condition_th">${th_jobtitle}</th>
                            <td>${td_jobtitle}</td>
                        </tr>
                        <tr>
                            <th class="condition_th">${th_temperature}</th>
                            <td>${td_temperature_minimum}℃&nbsp;～&nbsp;${td_temperature_maximum}℃</td>
                        </tr>
                        <tr>
                            <th class="condition_th">${th_sequence}</th>
                            <td class="text-wrap">${td_sequence}</td>
                        </tr>
                        <tr>
                            <th class="condition_th">${th_search_blast_engine}</th>
                            <td>${td_search_blast_engine}</td>
                        </tr>
                        <tr>
                            <th class="condition_th">${th_created_at}</th>
                            <td>${td_created_at}</td>
                        </tr>
                    </table>
                </div>
                <div id="search_filter" class="container">
                </div>
            </div>
    
        </div>
    `
};

// search_methodの情報を元にわかりやすく説明した文字列を返す
function show_search_method(search_method) {

    const text_temptoseq = "任意の生育温度の範囲内の生物種の中から、BLAST検索を実行";
    const text_seqtotemp = "BLAST検索の結果に生育温度の情報を記載";

    if (search_method = "temptoseq") {
        return text_temptoseq;
    } else {
        return text_seqtotemp;
    }
};

// created_atの時間の情報をわかりやすい形式に変換する
function formatDate(isoString) {
    const date = new Date(isoString);

    const year = date.getFullYear();
    // getMonth()は0から始まるため、1を足す
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // フォーマットした文字列を返す
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
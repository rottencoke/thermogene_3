import { render_release_notes } from 'render_release_notes';
import { post_search_params } from 'post_search_params';

export function render_homes() {

    // 作成するフォーム
    const html_form = /*html*/`
        <div id="search_form_area">
            <form id="search-form">
                <div id="search_condition_area" class="flex center">
                    <div id="search_main_area" class="container center">
                        <div id="search_jobtitle">
                            <label for="jobtitle" class="form_label">Job Title</label>
                            <input type="text" name="jobtitle" id="jobtitle" class="form-control form_line">
                        </div>
                        <hr>
                        <div>
                            <div class="form_horizontal_display">
                                <label for="temp_minimum" class="form_label">生育温度</label>
                                <input type="number" name="temp_minimum" id="temp_minimum" class="form-control small_number_field" min="40" max="106">
                                <label for="temp_minimum">°C</label>
                                <p>~</p>
                                <input type="number" name="temp_maximum" id="temp_maximum" class="form-control small_number_field" min="40" max="106">
                                <label for="temp_maximum">°C</label>
                            </div>
                        </div>
                        <hr>
                        <div id="search_seqInputArea">
                            <label for="seq" class="form_label py-3 pe-2">Query配列</label>
                            <textarea name="sequence" id="seq" class="form-control form_text_area"></textarea>
                        </div>
                        <hr>
                        <div id="search_blast_engine">
                            <label class="form_label">BLAST検索プログラム</label><br>
                            <input type="radio" name="search_blast_engine" value="blastn" id="radio_blastn" checked>
                            <label for="radio_blastn">BLASTn</label>

                            <input type="radio" name="search_blast_engine" value="tblastn" id="radio_tblastn">
                            <label for="radio_tblastn">tBLASTn</label>
                        </div>
                    </div>
                </div>
                <div class="align_center py-5">
                    <input type="submit" value="検索開始" class="btn btn-primary">
                </div>
            </form>
        </div>

    `;

    // 作成するhtml
    const html_root = /*html*/`
        <div id="search_area" class="container">
            <div class="container">
                <div id="main_title">
                    <p>
                        特定の温度に生息する微生物に対して、入力した配列と相同性を有する遺伝子を検索します
                    </p>
                </div>
                ${html_form}
                <hr>          
            </div>
        </div>
        <div id="release_notes" class="container"></div>
    `;

    // htmlに挿入
    document.querySelector('main').innerHTML = html_root;

    // リリースノート表示
    render_release_notes();

    // 検索条件送信
    post_search_params();

}
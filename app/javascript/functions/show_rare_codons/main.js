import { get_blastn_result } from 'get_blastn_result';

//search_idの取得
import { get_result } from 'get_result'

// 大腸菌レアコドン
import { RARE_CODONS_E_COLI } from 'rare_codons';

// レアコドンの文字のカラーコード
import { COLOR_RARE_CODON } from 'text_color';


// メインの関数
export async function show_rare_codons() {

    // blastnのhit配列を取り出す
    const blastn_result_hits = await get_blastn_hit_sequence();

    // blastn_result_hitの長さ分繰り返し
    blastn_result_hits.forEach((blastn_result_hit, i) => {

        const codon_arr = split_to_codon_arr(blastn_result_hit);

        // レアコドンを判別する
        const rare_codon_position = identify_rare_codon(codon_arr, blastn_result_hit);

        rare_codon_position.forEach((if_nucl_rare_codon, j) => {

            if (if_nucl_rare_codon) {

                // レアコドンのidの要素を色を変える
                change_color_of_rare_codon(rare_codon_position, i, j);
            }
        })


    });

    console.log("");

};

// blastnのhit配列を取り出す
async function get_blastn_hit_sequence() {

    const result = await get_result();
    const blastn_result_id = result.blastn_result_id;

    // 返り値のオブジェクト
    let answer = [];

    for (let i = 0; i < blastn_result_id.length; i++) {

        // blastn_resultの取得
        const blastn_result = await get_blastn_result(blastn_result_id[i]);

        // 新しいオブジェクトを作成
        let result = {
            blastn_result_id: blastn_result_id[i],
            hit_strand: blastn_result.hit_strand,
            hit_from: blastn_result.hit_from,
            hit_to: blastn_result.hit_to,
            hit_sequence: blastn_result.hseq
        };

        answer.push(result);

    };

    return answer;

};

// レアコドンを判別する
function split_to_codon_arr(result) {

    // blastn_result_hitの各種値の取得
    const hit_strand = result.hit_strand;
    const hit_from = result.hit_from;
    const hit_to = result.hit_to;
    const hit_sequence = result.hit_sequence;

    // コドンごとの配列の作成
    let hit_codon_arr = [];

    // hitの配列が通常の向きの場合
    if (hit_strand == "Plus") {

        // コドン代入用
        let codon = "";

        // 配列の要素ごとに繰り返し
        for (let i = 0; i < hit_sequence.length; i++) {

            codon += hit_sequence[i];

            // ３で割り切れる位置の塩基か最後の塩基の場合、hit_codon_arrに代入
            if ((hit_from + i) % 3 == 0 || (hit_from + i) == hit_to) {

                hit_codon_arr.push(codon);
                codon = "";

            };

        };

    }
    // hitの配列が逆向きの場合
    else {

        // コドン代入用
        let codon = "";

        // 配列の要素ごとに繰り返し
        for (let i = 0; i < hit_sequence.length; i++) {

            codon += hit_sequence[i];

            // ３で割り切れる位置の塩基か最後の塩基の場合、hit_codon_arrに代入
            if ((hit_from - i) % 3 == 0 || (hit_from - i) == hit_to) {

                hit_codon_arr.push(codon);
                codon = "";

            };

        };

    };

    return hit_codon_arr;

};

// レアコドンだと判別された部分をtrueにしたboolean配列を返す
// 返り値の例 : [true, true, true, false, false, false, ...]
function identify_rare_codon(codon_arr, result) {

    console.log("codon arr : " + codon_arr);

    // hit配列の向き
    const hit_strand = result.hit_strand;
    let rare_codon_arr;

    // hit配列が通常の向きの場合
    if (hit_strand == "Plus") {
        rare_codon_arr = RARE_CODONS_E_COLI;
    } else {
        // ここで各コドンを逆転してから全体を逆転する
        rare_codon_arr = RARE_CODONS_E_COLI.map(codon => codon.split('').reverse().join('')).reverse();
    };

    return check_rare_codon(codon_arr, rare_codon_arr);
};

function check_rare_codon(codon_arr, rare_codon_arr) {
    let rare_codon_position = [];

    // コドンの配列分繰り返す
    for (let i = 0; i < codon_arr.length; i++) {
        if (rare_codon_arr.includes(codon_arr[i])) {

            for (let j = 0; j < codon_arr[i].length; j++) rare_codon_position.push(true);

        } else {

            for (let j = 0; j < codon_arr[i].length; j++) rare_codon_position.push(false);
        };
    };

    console.log("rare_codon_position:", rare_codon_position);
    return rare_codon_position;
};

// レアコドンのhtml要素に対してcssプロパティを適用する
function change_color_of_rare_codon(rare_codon_position, i, j) {

    let element_name = `seq_r${i}_e${j}`
    let element = document.getElementById(element_name);
    element.style.color = COLOR_RARE_CODON;
    element.style.fontWeight = "bold";

};

// グローバルスコープに公開して、erbファイルで使用できるようにする
window.show_rare_codons = show_rare_codons;
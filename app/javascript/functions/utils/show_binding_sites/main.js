import { get_state_setting_binding_site } from 'state';
import { get_search_id } from 'get_search_id';
import { get_search } from 'get_search';
import { load_result_list, save_result_list } from 'control_result_list';
import { get_state_obj_locus_tag } from 'state';
import { sleep } from 'sleep';

// メインの関数
export async function show_binding_sites() {

    // そもそもblastnだったら処理を行わない
    const search_engine = get_search().blast_search_engine;
    if (search_engine == "blastn") return;

    // stateの取得
    const state_setting_binding_site = get_state_setting_binding_site();
    const state_obj_locus_tag = get_state_obj_locus_tag();

    // search_idの取得
    const search_id = get_search_id();

    // result listの中に保存されているか確認
    /// ここで一括で読み取りして、読み込みにかかる時間を減らす
    const arr_binding_sites = load_result_list(search_id, 'binding_sites',);
    
    // binding_sites : [{
    //     blast_id : ,
    //     binding_site : [{
    //         name : ,
    //         position : []
    //     }]
    // }]
    // result_listに保存する配列
    let arr_save_binding_sites = [];

    // 取得した結合部位名
    let arr_name_binding_sites = [];

    // もしresult_listに保存されていなかったらAPIにリクエストを送る
    // hit数だけ繰り返す
    for (let i = 0; i < state_obj_locus_tag.length; i++) {

        // state_obj_locus_tagから情報取り出し
        const blast_id = state_obj_locus_tag[i].blast_id;
        const locus_tag = state_obj_locus_tag[i].locus_tag;

        // 結合部位の情報の入るobjが入るarr、形式は上の通り
        let arr_binding_site = [];

        // result_listにある場合
        if (find_binding_site_in_storage(blast_id)) {
            arr_binding_site = find_binding_site_in_storage(blast_id);
        }
        // result_listにない場合
        else {

            // もしlocus_tagが空なら飛ばす
            if (!locus_tag) continue;

            // APIを呼び出してresultを取得する
            const response = await axios.get(`/api/get_ncbi_protein/${locus_tag}`);

            // もしresponse.dataが空なら飛ばす
            if (response.data.length == 0) continue;

            // データの数
            const num_length_data = response.data.arr_note.length;

            // objの作成
            for (let j = 0; j < num_length_data; j++) {
                arr_binding_site.push({
                    name: response.data.arr_note[j],
                    position: response.data.arr_order[j]
                })
            }

            // 新たに読み込んだデータだけ追加する
            arr_save_binding_sites.push({
                blast_id: blast_id,
                binding_site: arr_binding_site
            })
            

            // 2秒間動作を停止する
            sleep(2000);

        }

        // 得られた結合部位の名称だけの配列
        const arr_binding_sites_name = arr_binding_site.map(item => item.name);

        // 得られた結合部位の数だけ繰り返す
        for (let j = 0; j < arr_binding_sites_name.length; j++) {

            // 新しい結合部位名なら保存する
            if (!arr_name_binding_sites.includes(arr_binding_sites_name[j])) arr_name_binding_sites.push(arr_binding_sites_name[j]);

            // 保存された結合部位の名称の中で何番目かを取得
            const num_order_binding_name = arr_name_binding_sites.indexOf(arr_binding_sites_name[j]);

            // 得られた結合部位の位置
            const obj_matching = arr_binding_site.find(item => item.name === arr_binding_sites_name[j]);
            const arr_position_binding_site = obj_matching ? obj_matching.position : undefined;

            // 結合部位の位置の数だけ繰り返す
            for (let k = 0; k < arr_position_binding_site.length; k++) {

                // 対象のhtmlのtd要素のidを作成
                const id_target = `td_${blast_id}_${arr_position_binding_site[k]}`;

                // 対象のhtmlのtd要素を取得
                const element_td_target = document.getElementById(id_target);

                // 対象のhtml要素がなかったら飛ばす 
                if (!element_td_target) continue;

                // 変更するstyleの色を選択
                const color_target = `var(--color-border-highlighted-${num_order_binding_name})`;

                // 対象の要素のstyleを変更
                element_td_target.style.borderBottom = `3px solid ${color_target}`;

                // 対象の要素ではカーソルを選択モードにする
                element_td_target.classList.add('interactive');

                // 対象の要素にtitleを付与
                element_td_target.setAttribute("title", arr_binding_sites_name[j]);
            }

        }

    }

    // 新たに読み込んだデータがあればresult_list.binding_sitesに保存
    if (arr_save_binding_sites) {
        let arr_save = [];
        if (!arr_binding_sites) arr_save = arr_save_binding_sites;
        else arr_save = arr_binding_sites.concat(arr_save_binding_sites);
        save_result_list(search_id, 'binding_sites', arr_save);
    }


    // session storageのresult_listに'binding_sites'項目内に目的のblast_idがあれば返す
    function find_binding_site_in_storage(blast_id) {
        
        // そもそもresult_listに'binding_sites'がない場合は即return false
        if (!arr_binding_sites) return false;

        // 'binding_sites'項目内に目的のblast_idがあれば返す
        const obj_target_binding_site = arr_binding_sites.find(element => element.blast_id === blast_id);
        return obj_target_binding_site ? obj_target_binding_site.binding_site : false;
    }
}
// session storageへの保存の形式
// result_list : {
// 	search_id_<Search ID> : {
// 		search : {
// 			id : ,
// 			jobtitle : ,
// 			...
// 		},
// 		result : {
//          id: ,
// 			search_id : ,
// 			blastn_result_id : [],
// 			tblastn_result_id : [],
// 			tempura_id : [],
// 			...
// 		},
// 		blastn_result : [{
// 			id : ,
// 			accession : ,
// 			gene : ,
// 			...
// 		}, ...
// 		}],
// 		tblastn_result : [{
// 			id : ,
// 			accession : ,
// 			gene : ,
// 			...
// 		}, ..., {
// 		}],
// 		tempura : [{
// 			id : ,
// 			genus_and_species : ,
// 			...
// 		}, ...
// 		}],
//      binding_sites : [{
//          blast_id : ,
//          binding_site : [{
//              name : ,
//              position : []
//          }]
//      }]
// 	}
// }	

// storageにあれば読み込み、なければfalseを返す
/// blastn, tblastn, tempuraのみ第3引数table_idを指定
export function load_result_list(search_id, table, table_id) {

    // console.log(`load_result : ${search_id}_${table}_${table_id}`);

    // session storageからデータの取得
    const ssdata_result_list = sessionStorage.getItem('result_list');

    // result_listがあれば解凍、なければオブジェクトの作成
    let obj_ss_result_list = ssdata_result_list ? JSON.parse(ssdata_result_list) : false;

    // search_idのオブジェクトの確認
    /// search_idのキー作成
    const key_search_id = `search_id_${search_id}`;

    /// search_idの項目がなければreturn
    if (!obj_ss_result_list[key_search_id]) return false;
    
    /// search_idのtableの項目があれば読み込む
    if (obj_ss_result_list[key_search_id][table]) {

        // blastn, tblastn, tempuraの場合、配列のうちオブジェクト中のidがtable_idと一致するものを返す
        if (table == 'blastn_result' || table == 'tblastn_result' || table == 'tempura') {
            return obj_ss_result_list[key_search_id][table].find(element => element.id === table_id);
        }
        // その他の場合
        else {
            return obj_ss_result_list[key_search_id][table];
        }
    }
    /// なければ空オブジェクトを返す
    else return false;


}

// session storageに一度APIから取得したdbの情報を保存する
/// blastn, tblastn, tempuraは配列の中に各idのオブジェクトを保存する
export function save_result_list(search_id, table, obj) {

    // session storageからデータの取得
    const ssdata_result_list = sessionStorage.getItem('result_list');

    // result_listがあれば解凍、なければオブジェクトの作成
    let obj_ss_result_list = ssdata_result_list ? JSON.parse(ssdata_result_list) : {};

    // search_idのオブジェクトの確認
    /// search_idのキー作成
    const key_search_id = `search_id_${search_id}`;

    /// search_idの項目がなければオブジェクトの作成
    if (!obj_ss_result_list[key_search_id]) {
        obj_ss_result_list[key_search_id] = {};
    }

    // blastn, tblastn, tempura, binding_sitesの場合、配列の中に各idのオブジェクトを保存する
    if (table == 'blastn_result' || table == 'tblastn_result' || table == 'tempura') {

        // 指定したtableキーがまだ存在しない場合、配列を定義して初期化
        if (!obj_ss_result_list[key_search_id][table]) {
            obj_ss_result_list[key_search_id][table] = [];
        }

        // そのうえでobjを配列に追加
        obj_ss_result_list[key_search_id][table].push(obj);
    }
    // それ以外の場合
    else {
        // objを保存
        obj_ss_result_list[key_search_id][table] = obj;
    }
    
    // 変更したデータをsession storageに保存
    sessionStorage.setItem('result_list', JSON.stringify(obj_ss_result_list));


}
import { get_search_id } from 'get_search_id'; // search_idの取得
import { load_storage, save_storage } from 'control_storage';

// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_tempura(tempura_id) {

    // 数字以外のidの場合return
    if (!Number.isFinite(tempura_id)) return;

    // search_idを取得
    const search_id = get_search_id();

    // session storageに情報が保存されてないか確認する
    const obj_ss_tempura = load_storage(search_id, 'tempura', tempura_id);

    /// 保存されている場合
    if (obj_ss_tempura) {
        return {
            id: obj_ss_tempura.id,
            genus_and_species: obj_ss_tempura.genus_and_species,
            taxonomy_id: obj_ss_tempura.taxonomy_id,
            strain: obj_ss_tempura.strain,
            superkingdom: obj_ss_tempura.superkingdom,
            phylum: obj_ss_tempura.phylum,
            org_class: obj_ss_tempura.org_class,
            order: obj_ss_tempura.order,
            family: obj_ss_tempura.family,
            genus: obj_ss_tempura.genus,
            assembly_or_accession: obj_ss_tempura.assembly_or_accession,
            genome_GC: obj_ss_tempura.genome_GC,
            genome_size: obj_ss_tempura.genome_size,
            r16S_accssion: obj_ss_tempura.r16S_accssion,
            r16S_GC: obj_ss_tempura.r16S_GC,
            tmin: obj_ss_tempura.tmin,
            topt_ave: obj_ss_tempura.topt_ave,
            topt_low: obj_ss_tempura.topt_low,
            topt_high: obj_ss_tempura.topt_high,
            tmax: obj_ss_tempura.tmax,
            tmax_tmin: obj_ss_tempura.tmax_tmin
        }
    }
    /// 保存されていない場合
    else {
        try {

            // APIを呼び出してtempuraを取得する
            const response = await axios.get(`/data/get_tempura/${tempura_id}`);

            // responseからオブジェクトの作成
            const obj_response = {
                id: tempura_id,
                genus_and_species: response.data.genus_and_species,
                taxonomy_id: response.data.taxonomy_id,
                strain: response.data.strain,
                superkingdom: response.data.superkingdom,
                phylum: response.data.phylum,
                org_class: response.data.org_class,
                order: response.data.order,
                family: response.data.family,
                genus: response.data.genus,
                assembly_or_accession: response.data.assembly_or_accession,
                genome_GC: response.data.genome_GC,
                genome_size: response.data.genome_size,
                r16S_accssion: response.data.r16S_accssion,
                r16S_GC: response.data.r16S_GC,
                tmin: response.data.tmin,
                topt_ave: response.data.topt_ave,
                topt_low: response.data.topt_low,
                topt_high: response.data.topt_high,
                tmax: response.data.tmax,
                tmax_tmin: response.data.tmax_tmin
            };

            // session storageに保存
            save_storage(search_id, 'tempura', obj_response);

            // 返り値
            return obj_response;

        } catch (error) {
            console.error('Error:', error);
        }
    }

    

}

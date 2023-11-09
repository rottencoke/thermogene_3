// APIを使用する際は値の定義とレスポンスのタイミングが異なるので非同期処理を使用
export async function get_tempura(tempura_id) {

    try {

        // APIを呼び出してtempuraを取得する
        const response = await axios.get(`/data/get_tempura/${tempura_id}`);

        const response_genus_and_species = response.data.genus_and_species;
        const response_taxonomy_id = response.data.taxonomy_id;
        const response_strain = response.data.strain;
        const response_superkingdom = response.data.superkingdom;
        const response_phylum = response.data.phylum;
        const response_org_class = response.data.org_class;
        const response_order = response.data.order;
        const response_family = response.data.family;
        const response_genus = response.data.genus;
        const response_assembly_or_accession = response.data.assembly_or_accession;
        const response_genome_GC = response.data.genome_GC;
        const response_genome_size = response.data.genome_size;
        const response_r16S_accssion = response.data.r16S_accssion;
        const response_r16S_GC = response.data.r16S_GC;
        const response_tmin = response.data.tmin;
        const response_topt_ave = response.data.topt_ave;
        const response_topt_low = response.data.topt_low;
        const response_topt_high = response.data.topt_high;
        const response_tmax = response.data.tmax;
        const response_tmax_tmin = response.data.tmax_tmin;


        return {
            genus_and_species: response_genus_and_species,
            taxonomy_id: response_taxonomy_id,
            strain: response_strain,
            superkingdom: response_superkingdom,
            phylum: response_phylum,
            org_class: response_org_class,
            order: response_order,
            family: response_family,
            genus: response_genus,
            assembly_or_accession: response_assembly_or_accession,
            genome_GC: response_genome_GC,
            genome_size: response_genome_size,
            r16S_accssion: response_r16S_accssion,
            r16S_GC: response_r16S_GC,
            tmin: response_tmin,
            topt_ave: response_topt_ave,
            topt_low: response_topt_low,
            topt_high: response_topt_high,
            tmax: response_tmax,
            tmax_tmin: response_tmax_tmin
        };

    } catch (error) {
        console.error('Error:', error);
    }

}

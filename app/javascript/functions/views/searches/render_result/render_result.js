import { get_blastn_result } from 'get_blastn_result';
import { get_tblastn_result } from 'get_tblastn_result';
import { get_tempura } from 'get_tempura';
import { show_if_there } from 'show_if_there';

// 各結果
/// これが集まって上のresultsになる
/// 引数view_styleは1:生物情報&アライメント情報&アライメント、2:生物情報&アライメント情報
export async function render_result(obj, index, view_style) {

    // id取得
    /// tempura_id
    const tempura_id = obj.arr_tempura_id[index];

    /// blast_engineの判別とblast_result_idの取得
    let blast_engine = "";
    let blastn_result_id = 0;
    let tblastn_result_id = 0;

    if (obj.arr_blastn_result_id.length) {

        blast_engine = "blastn";
        blastn_result_id = obj.arr_blastn_result_id[index];

    } else if (obj.arr_tblastn_result_id.length) {

        blast_engine = "tblastn";
        tblastn_result_id = obj.arr_tblastn_result_id[index];

    }

    // 情報取得
    /// tempura
    const obj_tempura = await get_tempura(tempura_id);

    // tableヘッダー
    const th_index = "#";
    const th_genus_and_species = "生物種名";
    const th_strain = "株名";
    const th_classification = "分類";
    const th_topt = "生育温度";
    const th_gene = "遺伝子名";
    const th_protein = "タンパク質名";
    const th_alignment_length = "長さ";
    const th_evalue = "E Value";
    const th_identity = "相同性";
    const th_gap = "ギャップ";
    const th_bit_score = "bit_score";

    // tableデータ
    const td_index = index + 1;

    /// tempuraからのデータ
    const td_genus_and_species = obj_tempura.genus_and_species;
    const td_strain = obj_tempura.strain;
    const td_classification_superkingdom = obj_tempura.superkingdom;
    const td_classification_phylum = obj_tempura.phylum;
    const td_classification_org_class = obj_tempura.org_class;
    const td_classification_order = obj_tempura.order;
    const td_classification_family = obj_tempura.family;
    const td_classification_genus = obj_tempura.genus;
    const td_topt_ave = obj_tempura.topt_ave;
    const td_tmin = obj_tempura.tmin;
    const td_tmax = obj_tempura.tmax;

    /// blastデータ用変数
    let td_gene, td_protein, td_align_len, td_evalue, td_identity, td_gaps, td_bit_score;

    // リンク作成
    const url_species = `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${obj_tempura.taxonomy_id}`;
    const url_strain = `https://www.ncbi.nlm.nih.gov/datasets/genome/${obj_tempura.assembly_or_accession}/`;

    // リンク説明
    const text_url_species = "NCBI該当菌種ページ (taxonomy id)";
    const text_url_strain = "NCBI該当菌株ページ (genome assembly)";

    /// blastn_resultから
    if (blast_engine == "blastn") {

        const obj_blastn_result = await get_blastn_result(blastn_result_id);

        td_gene = obj_blastn_result.gene;
        td_protein = obj_blastn_result.protein;
        td_align_len = obj_blastn_result.align_len;
        td_evalue = obj_blastn_result.evalue;
        td_identity = obj_blastn_result.identity;
        td_gaps = obj_blastn_result.gaps;
        td_bit_score = obj_blastn_result.bit_score;

    }
    /// tblastn_resultから
    else if (blast_engine == "tblastn") {

        const obj_tblastn_result = await get_tblastn_result(tblastn_result_id);

        td_gene = obj_tblastn_result.gene;
        td_protein = obj_tblastn_result.protein;
        td_align_len = obj_tblastn_result.align_len;
        td_evalue = obj_tblastn_result.evalue;
        td_identity = obj_tblastn_result.identity;
        td_gaps = obj_tblastn_result.gaps;
        td_bit_score = obj_tblastn_result.bit_score;

    }

    // 単位
    /// 配列長
    let td_align_len_counter;

    if (blast_engine == "blastn") {
        td_align_len_counter = "塩基";

    } else if (blast_engine == "tblastn") {
        td_align_len_counter = "残基";

    }

    // 表示形式view_styleによって結果表示の形式を変更する
    switch (view_style) {
        case 1:
            return render_organismInfo_alignmentInfo_alignment();
        
        case 2:
            return render_organismInfo_alignmentInfo();
        
    }

    // 表示形式1 : 生物情報&アライメント情報&アライメント
    function render_organismInfo_alignmentInfo_alignment() {

        // ここに各結果のhtmlを入れる
        const html_result_table = /*html*/`
            <div class="container result_area">
                <table>
                    <tr>
                        ${th_index} ${td_index}
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_genus_and_species}</th>
                        <td>
                            <p>
                                <a
                                    class="less_styled_link"
                                    href="${url_species}"
                                    title="${text_url_species}"
                                    target="_blank"
                                >
                                    ${td_genus_and_species}
                                </a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_strain}</th>
                        <td>
                            <p>
                                <a
                                    class="less_styled_link"
                                    href="${url_strain}"
                                    title="${text_url_strain}"
                                    target="_blank"
                                >
                                    ${show_if_there(td_strain)}
                                </a>
                            </p>    
                        </td>
                    </tr>
                    <tr>
                        <th class="fw-lighter fs_7" scope="row">${th_classification}</th>
                        <td class="fw-lighter fs_7">
                            ${td_classification_superkingdom} >
                            ${td_classification_phylum} >
                            ${td_classification_org_class} >
                            ${td_classification_order} >
                            ${td_classification_family} >
                            ${td_classification_genus}
                        </td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_topt}</th>
                        <td>
                            ${td_topt_ave}℃
                            <small>
                                &nbsp;(${td_tmin}℃ ~ ${td_tmax}℃)
                            </small>
                        </td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_gene}</th>
                        <td>${show_if_there(td_gene)}</td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_protein}</th>
                        <td>${show_if_there(td_protein)}</td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_alignment_length}</th>
                        <td>${show_if_there(td_align_len) + td_align_len_counter}</td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_evalue}</th>
                        <td>${td_evalue}</td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_identity}</th>
                        <td>${td_identity}%</td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_gap}</th>
                        <td>${td_gaps}</td>
                    </tr>
                    <tr>
                        <th class="result_th" scope="row">${th_bit_score}</th>
                        <td>${td_bit_score}</td>
                    </tr>
                </table>
            </div>
        `;

        return html_result_table;
    }

    // 表示形式2 : 生物情報&アライメント情報
    function render_organismInfo_alignmentInfo() {

        const html_result_table = /*html*/`
            <tr>
                <th scope="row" class="text_align_left">${td_index}</th>
                <td>
                    <p>
                        <a
                            class="less_styled_link"
                            href="${url_species}"
                            title="${text_url_species}"
                            target="_blank"
                        >
                            ${td_genus_and_species}
                        </a>
                    </p>
                </td>
                <td>
                    <p>
                        <a
                            class="less_styled_link"
                            href="${url_strain}"
                            title="${text_url_strain}"
                            target="_blank"
                        >
                            ${show_if_there(td_strain)}
                        </a>
                    </p>    
                </td>
                <td>
                    ${td_topt_ave}℃
                    <small>
                        &nbsp;(${td_tmin}℃ ~ ${td_tmax}℃)
                    </small>
                </td>
                <td>${show_if_there(td_protein)}</td>
                <td>${td_evalue}</td>
                <td>${td_identity}%</td>
                <td>${td_bit_score}</td>
            </tr>
        `;

        return html_result_table;
    }

}
require 'net/http'
require 'uri'
require 'json'

module ApiHelper

    # NCBIのE-utilitiesのesearchを使用してprotein_idを取得
    def fetch_protein_id_by_locus_tag(locus_tag)
        base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi"
        db = "protein"
        url = URI("#{base_url}?db=#{db}&term=#{locus_tag}[locus_tag]&retmode=json")
      
        response = Net::HTTP.get(url)
        result = JSON.parse(response)
        result["esearchresult"]["idlist"][0]
    end

    # NCBIのE-utilitiesのefetchを使用してFEATURESのSITE項目を取得
    def fetch_protein_features(protein_id)
        base_url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
        db = "protein"
        rettype = "gb"
        url = URI("#{base_url}?db=#{db}&id=#{protein_id}&rettype=#{rettype}&retmode=text")
      
        response = Net::HTTP.get(url)
      
        # FEATURESセクションのSITE情報を抽出
        features_section = response.match(/FEATURES[\s\S]*ORIGIN/)
        return [] unless features_section

        arr_note_matches = response.scan(/\/note=\"(.*?)\"/m).flatten
        arr_order_matches = response.scan(/order\((.*?)\)/m).flatten

        # 改行コード、ダブルクォーテーション"、空白を削除する
        arr_note_edited = []
        arr_note_matches.length.times do |i|
            arr_note_matches[i].gsub!(/\r?\n/, "")
            arr_note_matches[i].gsub!("\"", "")

            # "site"か"domain"が含まれている場合のみ追加
            if arr_note_matches[i].match?(/site/) 
                arr_note_edited.push(arr_note_matches[i])
            end
        end

        # ","で分けたうえで、".."を含む場合はその間の数も追加した配列に変換する
        arr_order_edited = []
        arr_order_matches.length.times do |i|
            
            arr_order_matches[i].gsub!(/\r?\n/, "")
            arr_order_matches[i].gsub!("\"", "")
            arr_order_matches[i].gsub!(" ", "")
            arr_order_edited.push(convert_to_array(arr_order_matches[i]))
        end

        obj_response = {
            arr_note: arr_note_edited,
            arr_order: arr_order_edited
        }
    end

    private
    # ","で分けたうえで、".."を含む場合はその間の数も追加した配列に変換する
    def convert_to_array(str)
        str.split(',').flat_map do |part|
            if part.include?('..')
                range = part.split('..').map(&:to_i)
                (range.first..range.last).to_a
            else
                part.to_i
            end
        end
    end
end

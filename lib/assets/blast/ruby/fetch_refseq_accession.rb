require 'open-uri'
require 'json'

class FetchRefseqAccession

    # NCBI API URLs
    NCBI_ASSEMBLY_SEARCH_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi'
    NCBI_ASSEMBLY_SUMMARY_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi'

    def initialize(taxonomy_id, strain)
        @taxonomy_id = taxonomy_id
        @strain = strain
    end
    attr_accessor :taxonomy_id, :strain

    def find_refseq_accession()

        puts "取得対象 : #{@taxonomy_id}, #{@strain}"

        result = fetch_assembly_ids()
        puts "HIT ncbi_id 数 : #{result.length}"

        arr_result = []

        result.each do |ncbi_id|

            res = fetch_genome_info(ncbi_id)
            uids = res['result']['uids'][0]
            result = res['result'][uids]
            refseq_accession = result['assemblyaccession']
        
            strain = nil
            arr_species_list = result['biosource']['infraspecieslist']
            if arr_species_list.any?
                arr_species_list.each do |item|
                    if item["sub_type"] == "strain"
                        strain = item["sub_value"]
                        break # strainが見つかったのでループから抜ける
                    end
                end
            end
        
            arr_result.push({
                strain: strain,
                refseq_accession: refseq_accession
            })
        
            puts "strain : #{strain}, refseq_accession : #{refseq_accession}"
        
        end

        # 比較対象の文字列
        target_strain = @strain

        # 最も類似したstrainの情報を見つける
        closest = arr_result.min_by do |assembly|
            # strain名がnilまたは空の場合は比較から除外
            strain = assembly[:strain]
            next Float::INFINITY if strain.nil? || strain.empty?
        
            # strainに対象の文字列が含まれているかどうかを判定
            if strain.include?(target_strain)
                0 # 文字列が含まれている場合は、このアセンブリを優先する
            else
                levenshtein_distance(strain, target_strain)
            end
        end

        puts "closest : #{closest}"

        closest

    end

    private

    def fetch_assembly_ids()
        query = "#{@taxonomy_id}[txid]"
        url = "#{NCBI_ASSEMBLY_SEARCH_URL}?db=assembly&term=#{URI.encode_www_form_component(query)}&retmode=json"
        response = URI.open(url).read
        result = JSON.parse(response)
        result['esearchresult']['idlist']
    end

    def fetch_genome_info(ncbi_id)

        # esummaryを使用してアセンブリのサマリー情報を取得
        url = "#{NCBI_ASSEMBLY_SUMMARY_URL}?db=assembly&id=#{ncbi_id}&retmode=json"

        response = URI.open(url).read
        result = JSON.parse(response)
    end

    # Levenshtein距離を計算する関数
    def levenshtein_distance(str1, str2)
        n = str1.length
        m = str2.length
        return m if n == 0
        return n if m == 0
    
        matrix = Array.new(n+1) { Array.new(m+1) }
    
        (0..n).each { |i| matrix[i][0] = i }
        (0..m).each { |j| matrix[0][j] = j }
    
        (1..n).each do |i|
            (1..m).each do |j|
                cost = (str1[i-1] == str2[j-1]) ? 0 : 1
                matrix[i][j] = [
                    matrix[i-1][j] + 1, # deletion
                    matrix[i][j-1] + 1, # insertion
                    matrix[i-1][j-1] + cost # substitution
                ].min
            end
        end
    
        matrix[n][m]
    end
end
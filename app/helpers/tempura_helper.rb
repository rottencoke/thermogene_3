require 'json'


module TempuraHelper
    
    # 読み込むJSONファイルのパス
    TEMPURA_JSON_PATH = "./lib/assets/tempura/jsons/200617_TEMPURA.json"

    # スーパークラス、TEMPURA読み込み
    class LoadTempura

        def initialize
            # JSONファイルを読み込んで配列に変換する
            File.open(TEMPURA_JSON_PATH) do |file|
                @tempura_array = JSON.load(file)
            end

        end
    end

    # TEMPURA検索
    class SearchTempuraFromTemp < LoadTempura

        # TEMPURA検索の生育温度の下限、上限
        def initialize(tempMin, tempMax)
            super()
            @tempMin = tempMin.to_i
            @tempMax = tempMax.to_i
        end

        # 温度からassemblyを検索
        ## 返り値：assemblyの配列
        def acquire_assembly_from_tempura

            # TMIN_KEY以上、TMAX_KEY以下のデータを取得
            @tempura_array_temp_sorted = @tempura_array.select{ |hash| hash["Topt_ave"] >= @tempMin && hash["Topt_ave"] <= @tempMax } 

            # 取得したそれぞれのデータからassemblyの配列を取り出す
            return @tempura_array_temp_sorted.map{ |hash| hash["assembly_or_accession"] }.compact

        end

        
    end

    # TEMPURAの任意のassemblyを持つデータの取得
    ## LoadTempuraを継承
    class SearchTempuraFromAssembly < LoadTempura

        def initialize(assembly)
            @assembly = assembly
            super()
            @hash_assembly = @tempura_array.select{ |hash| hash["assembly_or_accession"] == assembly }

        end

        # genus_and_speciesの取得
        def get_tempura_result_genus_and_species
            return @hash_assembly.map{ |hash| hash["genus_and_species"] }.to_s.delete!("\"[]")
        end

        # taxonomy_idの取得
        def get_tempura_result_taxonomy_id
            return @hash_assembly.map{ |hash| hash["taxonomy_id"] }.to_s.delete!("\"[]")
        end

        # strainの取得
        def get_tempura_result_strain
            return @hash_assembly.map{ |hash| hash["strain"] }.to_s.delete!("\"[]")
        end

        # superkingdomの取得
        def get_tempura_result_superkingdom
            return @hash_assembly.map{ |hash| hash["superkingdom"] }.to_s.delete!("\"[]")
        end

        # phylumの取得
        def get_tempura_result_phylum
            return @hash_assembly.map{ |hash| hash["phylum"] }.to_s.delete!("\"[]")
        end

        # classの取得
        def get_tempura_result_class
            return @hash_assembly.map{ |hash| hash["class"] }.to_s.delete!("\"[]")
        end

        # orderの取得
        def get_tempura_result_order
            return @hash_assembly.map{ |hash| hash["order"] }.to_s.delete!("\"[]")
        end

        # familyの取得
        def get_tempura_result_family
            return @hash_assembly.map{ |hash| hash["family"] }.to_s.delete!("\"[]")
        end

        # genusの取得
        def get_tempura_result_genus
            return @hash_assembly.map{ |hash| hash["genus"] }.to_s.delete!("\"[]")
        end

        # Genome_GCの取得
        def get_tempura_result_genome_gc
            return @hash_assembly.map{ |hash| hash["Genome_GC"] }.to_s.delete!("\"[]")
        end

        # Genome_sizeの取得
        def get_tempura_result_genome_size
            return @hash_assembly.map{ |hash| hash["Genome_size"] }.to_s.delete!("\"[]")
        end

        # 16S_accssionの取得
        def get_tempura_result_16s_accssion
            return @hash_assembly.map{ |hash| hash["16S_accssion"] }.to_s.delete!("\"[]")
        end

        # 16S_GCの取得
        def get_tempura_result_16s_gc
            return @hash_assembly.map{ |hash| hash["16S_GC"] }.to_s.delete!("\"[]")
        end

        # Tminの取得
        def get_tempura_result_tmin
            return @hash_assembly.map{ |hash| hash["Tmin"] }.to_s.delete!("\"[]")
        end

        # Topt_aveの取得
        def get_tempura_result_topt_ave
            return @hash_assembly.map{ |hash| hash["Topt_ave"] }.to_s.delete!("\"[]")
        end

        # Topt_lowの取得
        def get_tempura_result_topt_low
            return @hash_assembly.map{ |hash| hash["Topt_low"] }.to_s.delete!("\"[]")
        end

        # Topt_highの取得
        def get_tempura_result_topt_high
            return @hash_assembly.map{ |hash| hash["Topt_high"] }.to_s.delete!("\"[]")
        end

        # Tmaxの取得
        def get_tempura_result_tmax
            return @hash_assembly.map{ |hash| hash["Tmax"] }.to_s.delete!("\"[]")
        end

        # Tmax_Tminの取得
        def get_tempura_result_tmax_tmin
            return @hash_assembly.map{ |hash| hash["Tmax_Tmin"] }.to_s.delete!("\"[]")
        end

    end
    

    
end

module TempuraHelper

    # TEMPURA検索
    class SearchTempuraFromTemp

        # TEMPURA検索の生育温度の下限、上限
        def initialize(tempMin, tempMax)

            @tempMin = tempMin.to_i
            @tempMax = tempMax.to_i

        end

        # tempurasテーブルから、検索した温度の範囲に至適生育温度が含まれているデータ（tempura_id）を取得する
        def search_tempura_id_with_optimum_growth_temp

            ans = Tempura.where("topt_ave >= ? and topt_ave <= ?", @tempMin, @tempMax).select("id")

            return ans

        end

        # tempurasテーブルから、検索した温度の範囲に生育温度の範囲がかぶっているデータ（tempura_id）を取得する
        def search_tempura_data_with_growth_temp_range

            ans = Tempura.where("tmax >= ? or tmin <= ?", @tempMin, @tempMax).select("id")

            return ans

        end

        # tempurasテーブルから、検索した温度の範囲に至適生育温度が含まれているデータ（tempura_id）を取得する
        ## idとassemblyのhash
        def search_tempura_assembly_with_optimum_growth_temp

            arr = Tempura.where("topt_ave >= ? and topt_ave <= ?", @tempMin, @tempMax)

            arr2 = arr.select { |hash| hash[:assembly_or_accession] != nil }

            key_to_extract = [:id, :assembly_or_accession]

            ans = arr2.map do |hash|

                new_hash = {}

                key_to_extract.each do |key, value|

                    new_hash[key] = hash[key]

                end
            
                new_hash
            
            end

            return ans
        end

    end
    
end

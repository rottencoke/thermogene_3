module TempuraHelper

    # TEMPURA検索
    class SearchTempuraFromTemp

        # TEMPURA検索の生育温度の下限、上限
        def initialize(tempMin, tempMax)

            @tempMin = tempMin.to_i
            @tempMax = tempMax.to_i

        end

        # tempurasテーブルから、検索した温度の範囲に至適生育温度が含まれているデータ（tempura_id）を取得する
        def search_tempura_data_with_optimum_growth_temp

            ans = Tempura.where("topt_ave >= ? and topt_ave <= ?", @tempMin, @tempMax).select("id")

            return ans

        end

        # tempurasテーブルから、検索した温度の範囲に生育温度の範囲がかぶっているデータ（tempura_id）を取得する
        def search_tempura_data_with_growth_temp_range

            ans = Tempura.where("tmax >= ? or tmin <= ?", @tempMin, @tempMax).select("id")

            return ans

        end
        
    end
    
end

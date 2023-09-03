require 'securerandom'

class SearchesController < ApplicationController

    include SearchesHelper
    include TempuraHelper
    include BlastHelper    
    include BlastDbHelper    

    def create

        # 入力されたパラメータをデータベースに登録
        @search = Search.create(search_params)

        # DBに正常に登録されたか判断
        if @search.save
            puts "[Search Parameter Saved Successfully]"
            # redirect_to @search
        else
            puts "[Search Parameter Saved Failed]"
        end

        puts puts
        puts "-----------------------------------------"
        puts "Search : " + `date +%Y/%m/%d_%H:%M:%S.%3N` + "------------------------------------------"

        # 初期化部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## リクエストIDを作成
        request_id = SecureRandom.hex(5) + "_" + `date +%Y%m%d%H%M%S`.chomp

        # TEMPURA部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## TEMPURA検索結果のインスタンス作成
        @tempura_ins = SearchTempuraFromTemp.new(@search.temp_minimum, @search.temp_maximum)

        ## TEMPURAから温度の条件に当てはまるassemblyの配列を取り出す
        tempura_result_assembly = @tempura_ins.search_tempura_assembly_with_optimum_growth_temp

        # BLAST部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## BLASTn検索結果のインスタンス作成
        @search_blastn_ins = SearchBlastn.new(@search.sequence, request_id)
        
        ## BLASTn実行
        execute_blastn(request_id)

        ## BLASTnの結果のassemblyの配列を取り出す
        blastn_result_assembly = @blastn_result_ins.acquire_blastn_assembly

        # 一致するAssemblyを取得、resultsテーブルに保存する
        acquire_shared_assembly(@search.id, tempura_result_assembly, blastn_result_assembly)

        # 結果表示
        redirect_to @search

    end

    def show

        # Search
        ## Searchをインスタンスにする
        @search = Search.find(params[:id])

        # Result
        ## Resultのidを取得する
        result_id = @search.result_ids

        ## Resultのインスタンス
        @result = Result.find(result_id)

        # Tempura
        ## Tempuraのidをresult_idから取得する
        tempura_ids = @result[0][:tempura_id]

        ## Tempuraの情報を配列にする
        @tempuras = []
        tempura_ids.length.times do |i|
            @tempuras << Tempura.find(tempura_ids[i])
        end

        # BlastResult
        ## BlastResultのidをresult_idから取得する
        blast_result_ids = @result[0][:blast_result_id]

        ## BlastResultの情報を配列にする
        @blast_results = []
        blast_result_ids.length.times do |i|
            @blast_results << BlastResult.find(blast_result_ids[i])
        end

    end

    private
    def search_params
        params.require(:search).permit(
            :jobtitle, 
            :temp_minimum, 
            :temp_maximum, 
            :sequence, 
            :search_method, 
            :search_blast_engine, 
            :identity_minimum, 
            :identity_maximum, 
            :eValue_minimum, 
            :eValue_maximum, 
            :qCoverage_minimum, 
            :qCoverage_maximum
        )
    end

end

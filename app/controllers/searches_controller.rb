require 'securerandom'

class SearchesController < ApplicationController

    include SearchesHelper
    include TempuraHelper
    include BlastnHelper
    include TblastnHelper
    include BlastDbHelper    

    def create

        # 入力されたパラメータをデータベースに登録
        @search = Search.create(search_params)

        puts puts
        puts "-----------------------------------------"
        puts "Search : " + `date +%Y/%m/%d_%H:%M:%S.%3N` + "------------------------------------------"

        # 初期化部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## リクエストIDを作成
        request_id =  `date +%Y%m%d%H%M%S`.chomp + "_" + SecureRandom.hex(5)

        # TEMPURA部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## TEMPURA検索結果のインスタンス作成
        @tempura_ins = SearchTempuraFromTemp.new(@search.temp_minimum, @search.temp_maximum)

        ## TEMPURAから温度の条件に当てはまるassemblyの配列を取り出す
        tempura_result_assembly = @tempura_ins.search_tempura_assembly_with_optimum_growth_temp

        # BLAST部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## Blastnの場合

        if @search.search_blast_engine == "blastn" then

            # BLASTn検索結果のインスタンス作成
            @search_blastn_ins = SearchBlastn.new(@search.sequence, request_id)
            
            # BLASTn実行
            ## BLASTnの結果のassemblyの配列を取り出す
            blastn_result_assembly = execute_blastn(request_id)

            # 一致するAssemblyを取得、resultsテーブルに保存する
            acquire_shared_assembly(@search.id, tempura_result_assembly, blastn_result_assembly)

        ## Blastnの場合
        elsif @search.search_blast_engine == "tblastn" then

            # BLASTn検索結果のインスタンス作成
            @search_tblastn_ins = SearchTblastn.new(@search.sequence, request_id)
        
            # BLASTn実行
            ## tBLASTnの結果のassemblyの配列を取り出す
            tblastn_result_assembly = execute_tblastn(request_id)

            # 一致するAssemblyを取得、resultsテーブルに保存する
            acquire_shared_assembly(@search.id, tempura_result_assembly, tblastn_result_assembly)

        end

        if @search.save
            render json: { search_id: @search.id }, status: :created
        else
            render json: @search.errors, status: :unprocessable_entity
        end
    end

    def show
    end

    private
    def search_params
        params.permit(
            :jobtitle, 
            :temp_minimum, 
            :temp_maximum, 
            :sequence, 
            :search_method, 
            :search_blast_engine,
            :fasta_header
        )
    end

end

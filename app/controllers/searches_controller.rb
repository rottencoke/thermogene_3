require 'securerandom'

class SearchesController < ApplicationController

    def create

        puts puts
        puts "-----------------------------------------"
        puts "Search : " + `date +%Y/%m/%d_%H:%M:%S.%3N` + "------------------------------------------"


        # 初期化部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## リクエストIDを作成
        @request_id = SecureRandom.hex(5) + "_" + `date +%Y%m%d%H%M%S`.chomp

        ## 入力されたパラメータをデータベースに登録
        @search = Search.create(search_params)

        ## 入力された生育温度の最小値を出力用に変数定義
        @search_temp_minimum = search_params[:temp_minimum].to_i

        ## 入力された生育温度の最大値を出力用に変数定義
        @search_temp_maximum = search_params[:temp_maximum].to_i


        # TEMPURA部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## TEMPURA検索結果のインスタンス作成
        @tempura_ins = SearchTempuraFromTemp.new(@search_temp_minimum, @search_temp_maximum)

        ## TEMPURAから温度の条件に当てはまるassemblyの配列を取り出す
        @tempura_result_assembly = @tempura_ins.acquire_assembly_from_tempura

        # BLAST部分~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        ## 入力された配列を渡す
        @temptoorg_seq = search_params[:sequence]

        ## BLASTn検索結果のインスタンス作成
        @blastn_ins = SearchBlastn.new(@temptoorg_seq, @request_id)
        
        ## BLASTn実行
        execute_blastn

        # 2つの結果を比較して、全体の結果を出力する部分~~~~~~~~~~~~~
        
    end

    private
    def search_params
        params.require(:search).permit(:jobtitle, :temp_minimum, :temp_maximum, :sequence, :search_method, :search_blast_engine, :identity_minimum, :identity_maximum, :eValue_minimum, :eValue_maximum, :qCoverage_minimum, :qCoverage_maximum)
    end

end

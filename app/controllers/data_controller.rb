class DataController < ApplicationController

    # Search取得用
    def get_search

        search_id = params[:search_id].to_s

        @search = Search.find(search_id)

        render json: @search

    end

    # Result取得用
    ## search_idを指定してそのresultsをjsonで返す
    def get_result

        search_id = params[:search_id].to_s

        @result = Result.find_by(search_id: search_id)

        render json: @result
    end

    # BlastnResult取得用
    def get_blastn_result

        blastn_result_id = params[:blastn_result_id]

        @blastn_result = BlastnResult.find(blastn_result_id)

        render json: @blastn_result

    end

    # TblastnResult取得用
    def get_tblastn_result

        tblastn_result_id = params[:tblastn_result_id]

        @tblastn_result = TblastnResult.find(tblastn_result_id)

        render json: @tblastn_result

    end

    # Tempura取得用
    def get_tempura

        tempura_id = params[:tempura_id]

        @tempura = Tempura.find(tempura_id)

        render json: @tempura

    end
end

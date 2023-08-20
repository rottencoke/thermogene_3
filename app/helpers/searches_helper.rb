# SearchesControllerの拡張
module SearchesHelper
    
    include BlastHelper
    include TempuraHelper

    # BLASTn実行
    ## controllerに呼び出される、メインのメソッド
    def execute_blastn

        # 結果取得
        ## 結果のpathを定義
        blastn_result_path = ""

        # 入力されたquery配列のファイル保存
        @search_blastn_ins.make_query_file

        begin
            # BLASTn検索
            ## 結果取得をスムーズに行うために別スレッドで実行
            # search_blastn_thread = Thread.new do
            #     @blastn_ins.search_blastn
            # end
            ## 落ち着いたらthreadに入れる
            @search_blastn_ins.search_blastn 

        rescue

            puts "[BLASTn ERROR] blastn search failed"

        ensure

            count = 0
            loop do
                count += 1

                # BLASTnの結果のJSONファイルが出力されたらスレッドkillしてloop終了
                if @search_blastn_ins.is_present_blastn_result then

                    puts "[BLASTn JSON found] " + `date +%Y/%m/%d_%H:%M:%S.%3N`
                    # Thread.kill(search_blastn_thread)
                    break

                end

                # 一定時間 (2秒=1000000) たったら強制終了
                if count > 1000000 then
                    break 
                    puts "[BLASTn] 強制終了 " + `date +%Y/%m/%d_%H:%M:%S.%3N`
                end
            end

        end

        # BLASTnの結果をblast_resultsテーブルに保存する
        @blastn_result_ins = SaveBlastnResult.new(request_id)
        @blastn_result_ins.load_blastn_result
        @blastn_result_ins.save_blastn_result_to_table

    end

    # 一致するAssemblyを取得、resultsテーブルに保存する
    def acquire_shared_assembly(tempura_result_assembly, blastn_result_assembly)

        # 一致するAssemblyを取得する
        ## 一致したAssembly
        shared_assembly = []

        ## 一致するAssemblyを探す
        blastn_result_assembly.length.times do |i|
            
            tempura_result_assembly.length.times do |j|

                if blastn_result_assembly[i] == tempura_result_assembly[j] then

                    shared_assembly << blastn_result_assembly[i]
                end
            end
        end

        # TEMPURAのid（tempura_id）を取得する
        ## 一致したAssemblyのtempuraのid
        shared_tempura_id = Tempura.where(assembly_or_accession: shared_assembly).map{|hash| hash[:id]}

        # BlastResultのid（blast_result_id）を取得する
        shared_blast_result_id = BlastResult.where(assembly: shared_assembly).map{|hash| hash[:id]}

        # resultsテーブルに保存する
        ## Searchのidを取得する
        search_id = @search.id

        ## resultsテーブルに保存する
        Result.create(blast_result_id: shared_blast_result_id, tempura_id: shared_tempura_id, searches_id: search_id)
    
    end

end

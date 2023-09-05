# SearchesControllerの拡張
module SearchesHelper
    
    include BlastHelper
    include TempuraHelper

    # BLASTn実行
    ## controllerに呼び出される、メインのメソッド
    def execute_blastn(request_id)

        # 結果取得
        ## 結果のpathを定義
        blastn_result_path = ""

        # 入力されたquery配列のファイル保存
        @search_blastn_ins.make_query_file

        begin
            # BLASTn検索
            ## 結果取得をスムーズに行うために別スレッドで実行
            search_blastn_thread = Thread.new do
                @search_blastn_ins.search_blastn
            end

        rescue

            puts "[BLASTn ERROR] blastn search failed"

        ensure

            count = 0
            loop do
                count += 1

                # BLASTnの結果のJSONファイルが出力されたらスレッドkillしてloop終了
                if @search_blastn_ins.is_present_blastn_result then

                    puts "[BLASTn JSON created] " + `date +%Y/%m/%d_%H:%M:%S.%3N`
                    Thread.kill(search_blastn_thread)
                    break

                end

            end

        end

        # Search idの取得
        search_id = @search.id

        # BLASTnの結果をblast_resultsテーブルに保存する
        @blastn_result_ins = SaveBlastnResult.new(request_id)
        @blastn_result_ins.load_blastn_result
        @blastn_result_ins.save_blastn_result_to_table(search_id)

    end

    # 一致するAssemblyを取得、resultsテーブルに保存する
    def acquire_shared_assembly(search_id, tempura_result_assembly, blastn_result_assembly)

        # 一致するAssemblyを取得する
        ## 一致したAssembly
        shared_assembly = []

        ## 一致したAssemblyのtempuraのid
        shared_tempura_id = []

        ## BlastResultのid
        shared_blast_result_id = []

        ## 一致するAssemblyを探す
        blastn_result_assembly.length.times do |i|
            
            tempura_result_assembly.length.times do |j|

                if blastn_result_assembly[i][:assembly] == tempura_result_assembly[j][:assembly_or_accession] then

                    # 一致したAssemblyを代入
                    shared_assembly << blastn_result_assembly[i][:assembly]

                    # TEMPURAのid（tempura_id）を取得する
                    shared_tempura_id << tempura_result_assembly[j][:id]

                    # BlastResultのidを取得する
                    shared_blast_result_id << blastn_result_assembly[i][:id]

                end
            end
        end

        # resultsテーブルに保存する
        ## resultsテーブルに保存する
        Result.create(blast_result_id: shared_blast_result_id, tempura_id: shared_tempura_id, search_id: search_id)
    
    end

end

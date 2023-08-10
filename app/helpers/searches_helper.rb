# SearchesControllerの拡張
module SearchesHelper
    
    include BlastHelper
    include TempuraHelper

    # BLASTn実行
    ## controllerに呼び出される、メインのメソッド
    def execute_blastn

        # 結果取得
        ## 結果のpathを定義
        @blastn_result_path = ""

        # 入力されたquery配列のファイル保存
        @blastn_ins.make_query_file

        begin
            # BLASTn検索
            ## 結果取得をスムーズに行うために別スレッドで実行
            # search_blastn_thread = Thread.new do
            #     @blastn_ins.search_blastn
            # end
            ## 落ち着いたらthreadに入れる
            @blastn_ins.search_blastn 

        rescue

            puts "[BLASTn ERROR] blastn search failed"

        ensure

            count = 0
            loop do
                count += 1

                # BLASTnの結果のJSONファイルが出力されたらスレッドkillしてloop終了
                unless @blastn_ins.acquire_blastn_result_json_path == "" then

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

            # BLASTnの結果の場所を取得
            @blastn_result_path = @blastn_ins.acquire_blastn_result_json_path

            # BLASTnの結果のファイルの中身が生成されるまで時間調整
            ## 100000 = 0.2秒
            count = 0
            loop do
                count += 1
                if count > 800000 then 
                    break 
                end
            end

            # BLASTnの結果の内、assemblyのみを取得
            acquire_blastn_result_assembly

        end
    end

    # BLASTnのassembly取得
    def acquire_blastn_result_assembly

        # インスタンス作成
        @blastn_result_assembly_ins = AcquireBlastnAssembly.new(@blastn_result_path)

        # 結果の読み込み
        @blastn_result_assembly_ins.acquire_blastn_result_json_content

        # アライメントの結果の数を取得
        result_len = @blastn_result_assembly_ins.get_blastn_result_length

        # 配列の繰り返し外での宣言を行う
        @blastn_result_assembly = Array.new(result_len)

        # 結果の数の回数繰り返す
        result_len.times do |i|

            # 結果のassemblyを取得する
            @blastn_result_assembly[i] = @blastn_result_assembly_ins.get_blastn_result_align_assembly(i)
        
        end

    end


    # 一致したassemblyを使ってTEMPURAとBLASTnの結果を参照
    def acquire_blastn_tempura_from_assembly

        # 一致したassemblyの長さの取得
        @match_result_len = @match_result_assembly.length

        # Blastnの結果の詳細取得用のインスタンス
        @blastn_result_ins = VariablizeBlastnResult.new(@blastn_result_path, @match_result_assembly)

        # BLASTnの基本的な結果の読み込み
        @blastn_result_ins.acquire_blastn_result_json_content

        # BLASTnの結果の各種変数の取得
        acquire_blastn_result_variables

        # 各種変数の定義（繰り返しの外で定義しとく）
        ## BLASTn用
        @blastn_result_align_id = Array.new(@match_result_len)
        @blastn_result_align_accession = Array.new(@match_result_len)
        @blastn_result_align_gene = Array.new(@match_result_len)
        @blastn_result_align_location = Array.new(@match_result_len)
        @blastn_result_align_protein = Array.new(@match_result_len)
        @blastn_result_align_protein_id = Array.new(@match_result_len)
        @blastn_result_align_gbkey = Array.new(@match_result_len)
        @blastn_result_align_length = Array.new(@match_result_len)
        @blastn_result_align_bit_score = Array.new(@match_result_len)
        @blastn_result_align_score = Array.new(@match_result_len)
        @blastn_result_align_evalue = Array.new(@match_result_len)
        @blastn_result_align_identities = Array.new(@match_result_len)
        @blastn_result_align_query_from = Array.new(@match_result_len)
        @blastn_result_align_query_to = Array.new(@match_result_len)
        @blastn_result_align_query_strand = Array.new(@match_result_len)
        @blastn_result_align_hit_from = Array.new(@match_result_len)
        @blastn_result_align_hit_to = Array.new(@match_result_len)
        @blastn_result_align_hit_strand = Array.new(@match_result_len)
        @blastn_result_align_align_len = Array.new(@match_result_len)
        @blastn_result_align_gaps = Array.new(@match_result_len)
        @blastn_result_align_hseq = Array.new(@match_result_len)
        @blastn_result_align_qseq = Array.new(@match_result_len)
        @blastn_result_align_midline = Array.new(@match_result_len)

        @match_result_len.times do |i|

            unless @match_result_assembly[i] == "" then 

                # BLASTnの結果の各種変数の取得
                acquire_blastn_each_results_variables(i)

            end
        
        end

        @match_result_len.times do |i|
            acquire_blastn_align_variables(i)
        end
    end


    # ===========ここから下は具体的な変数の取得を行う=================
    # BLASTnの結果の各種変数の取得
    ## 全体の結果の変数
    def acquire_blastn_result_variables

        # query_id
        @blastn_result_query_id = @blastn_result_ins.get_blastn_result_query_id

        # query_len
        @blastn_result_query_len = @blastn_result_ins.get_blastn_result_query_len

    end

    # BLASTnの結果の各種変数の取得
    ## 各種結果の変数
    def acquire_blastn_each_results_variables(i)

        # id
        @blastn_result_align_id[i] = @blastn_result_ins.get_blastn_result_align_id(i)

        # accession
        @blastn_result_align_accession[i] = @blastn_result_ins.get_blastn_result_align_accession(i)


        # gene
        @blastn_result_align_gene[i] = @blastn_result_ins.get_blastn_result_align_gene(i)

        # location
        @blastn_result_align_location[i] = @blastn_result_ins.get_blastn_result_align_location(i)

        # protein
        @blastn_result_align_protein[i] = @blastn_result_ins.get_blastn_result_align_protein(i)

        # protein_id
        @blastn_result_align_protein_id[i] = @blastn_result_ins.get_blastn_result_align_protein_id(i)

        # gbkey
        @blastn_result_align_gbkey[i] = @blastn_result_ins.get_blastn_result_align_gbkey(i)

        # length
        @blastn_result_align_length[i] = @blastn_result_ins.get_blastn_result_align_length(i)

        # bit_score
        @blastn_result_align_bit_score[i] = @blastn_result_ins.get_blastn_result_align_bit_score(i)

        # score
        @blastn_result_align_score[i] = @blastn_result_ins.get_blastn_result_align_score(i)

        # evalue
        @blastn_result_align_evalue[i] = @blastn_result_ins.get_blastn_result_align_evalue(i)

        # identities
        @blastn_result_align_identities[i] = @blastn_result_ins.get_blastn_result_align_identity(i)

        # query_from
        @blastn_result_align_query_from[i] = @blastn_result_ins.get_blastn_result_align_query_from(i)

        # query_to
        @blastn_result_align_query_to[i] = @blastn_result_ins.get_blastn_result_align_query_to(i)

        # query_strand
        @blastn_result_align_query_strand[i] = @blastn_result_ins.get_blastn_result_align_query_strand(i)

        # hit_from
        @blastn_result_align_hit_from[i] = @blastn_result_ins.get_blastn_result_align_hit_from(i)

        # hit_to
        @blastn_result_align_hit_to[i] = @blastn_result_ins.get_blastn_result_align_hit_to(i)

        # hit_strand
        @blastn_result_align_hit_strand[i] = @blastn_result_ins.get_blastn_result_align_hit_strand(i)

        # align_len
        @blastn_result_align_align_len[i] = @blastn_result_ins.get_blastn_result_align_align_len(i)

        # gaps
        @blastn_result_align_gaps[i] = @blastn_result_ins.get_blastn_result_align_gaps(i)

        # hseq
        @blastn_result_align_hseq[i] = @blastn_result_ins.get_blastn_result_align_hseq(i)

        # qseq
        @blastn_result_align_qseq[i] = @blastn_result_ins.get_blastn_result_align_qseq(i)

        # midline
        @blastn_result_align_midline[i] = @blastn_result_ins.get_blastn_result_align_midline(i)

    end


    # BLASTnのアライメントの表示用変数の取得
    def acquire_blastn_align_variables(i)

        @search_result_align_view_width = 60

        # アライメントの長さを横幅で割ったもの
        @search_result_align_height = @blastn_result_align_align_len[i] / @search_result_align_view_width

        ## もし余りがある場合、+1
        if  @blastn_result_align_align_len[i] % @search_result_align_view_width != 0 then
            @search_result_align_height += 1
        end

        ## 余りの値


        # hseqとqseq、midlineを3次元配列にする
        ## 1次元目はblastnの結果の数
        ## 2次元目はアライメント表示の縦の長さ
        ## 3次元目はアライメント表示の横の長さ
        ## hseq
        ### hseq定義
        @blastn_result_align_view_hseq = Array.new(@match_result_len, Array.new(@search_result_align_height, Array.new(@search_result_align_view_width, "")))

        ### 元の文字列を配列にする
        blastn_result_align_hseq_arr = @blastn_result_align_hseq[i]

        ### 繰り返しで代入
        @search_result_align_height.times do |j|

            @search_result_align_view_width.times do |k|

                blastn_result_align_pos = j * @search_result_align_view_width + k

                @blastn_result_align_view_hseq[i][j][k] = blastn_result_align_hseq_arr[blastn_result_align_pos]

            end

        end
        
        ## qseq
        @blastn_result_align_view_qseq = Array.new(@match_result_len, Array.new(@search_result_align_height, Array.new(@search_result_align_view_width, "")))

        ## midline
        @blastn_result_align_view_midline = Array.new(@match_result_len, Array.new(@search_result_align_height, Array.new(@search_result_align_view_width, "")))


    end

    
end

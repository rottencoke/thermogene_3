require 'json'

# BLASTの検索を実行し、結果に直接アクセスする
module BlastHelper

    # BLAST DBの場所
    BLAST_DB_PATH = "./lib/assets/blast/blast_db/blast_db_nucleotide/db_230512"

    # BLASTの検索に使うQuery配列のファイルの保存場所
    ## 保存期間決めて過ぎたら削除する
    BLASTN_QUERY_PATH = "./tmp/storage/blast_query/"

    # BLASTの検索結果のJSONファイルを保存する場所
    ## 保存期間決めて過ぎたら削除する
    BLAST_RESULT_PATH = "./tmp/storage/blast_result/"

    # BLASTnの場所
    BLASTN_PATH = "./lib/assets/blast/ncbi_blast/blastn"

    # テスト用のBLAST検索query配列の場所
    BLASTN_TEST_QUERY_PATH = "./tmp/storage/blast_query/test_query_0628.txt"

    # blastnの検索を行う
    class SearchBlastn
    
        # query_seqとrequest_idを初期化
        ## query_seqは利用者が送信する問い合わせ配列
        ### 現時点では塩基配列のみ受け付ける
        ## request_idはリクエストごとにつけられる文字列
        ### controllerが作成
        ### BLASTnの検索結果のJSONファイルの名前につけて識別
        def initialize(query_seq, request_id)
            @query_seq = query_seq
            @request_id = request_id
        end
        attr_accessor :query_seq, :request_id

        # query_seqを一時的にファイルに保存する
        ## ファイルでないとBLASTが使ってくれないため
        def make_query_file

            # 作成する配列のファイルのパス
            @blastn_query_path = BLASTN_QUERY_PATH + "blastn_query_" + @request_id + ".txt"

            # ファイル作成
            File.open(@blastn_query_path, "w") { |f| 
                f.print @query_seq
            }

        end

        # BLASTn検索を実行する
        def search_blastn

            # BLASTn検索開始時間表示
            puts "[BLASTn start]  " + `date +%Y/%m/%d_%H:%M:%S.%3N`

            # BLASTnのオプション
            ## 問い合わせ配列
            blastn_opt_query = @blastn_query_path

            ## BLAST DB
            blastn_opt_db = BLAST_DB_PATH

            ## BLAST検索の種類:BLASTn
            blastn_opt_task = "blastn"

            ## 出力する結果のフォーマット:13 (JSON形式)
            blastn_opt_outfmt = 13

            ## 結果の保存場所
            blastn_opt_out = BLAST_RESULT_PATH + "blastn_result_" + @request_id + ".txt"

            ## オプション全体
            blastn_opts = "-query #{blastn_opt_query} -db #{blastn_opt_db} -task #{blastn_opt_task} -outfmt #{blastn_opt_outfmt} -out #{blastn_opt_out}"

            # BLASTn検索実行
            %x{ #{BLASTN_PATH} #{blastn_opts} }

            # BLASTn検索終了時間表示
            puts "[BLASTn finish] " + `date +%Y/%m/%d_%H:%M:%S.%3N`

        end

        # BLASTn検索で得られたJSONファイルを取得する
        ## BLASTn検索が終わるのには時間がかかるが、検索結果のJSONファイル自体は検索開始後すぐに得られる
        ## これをcontrollerで定期実行して監視、存在すればクライアントに送信
        def acquire_blastn_result_json_path

            # 結果の保存場所
            blastn_opt_out = BLAST_RESULT_PATH + "blastn_result_" + @request_id + ".txt"

            # BLASTnの結果のパス
            ## このメソッドの返り値になる
            blastn_result_path = blastn_opt_out + "_1.json"

            # ファイルが存在するか判定
            ## 存在すればファイルのパスを返す
            ## 存在しなければnilを返す
            if File.exist?(blastn_result_path) then

                return blastn_result_path
                puts "[BLASTn result outputted] " + `date`

            else
                
                return ""
            end

        end

    end

    # BLASTnの結果の読み込み
    class LoadBlastnResult

        # 初期化
        ## JSONファイルのパス
        def initialize(blastn_result_path)

            @blastn_result_path = blastn_result_path

        end
        attr_accessor :blastn_result_path

        ## JSONファイルの読み込み
        def acquire_blastn_result_json_content

            # JSONファイル読み込み
            File.open(@blastn_result_path) do |file|

                # JSON読み込み
                raw_hash = JSON.load(file)

                # "BlastOutput2" > "report"
                @blastn_result = raw_hash["BlastOutput2"]["report"]

                # "BlastOutput2" > "report" > "results" > "search"
                @blastn_result_desc = @blastn_result["results"]["search"]

                # "BlastOutput2" > "report" > "results" > "search" > "hits"
                @blastn_result_hits = @blastn_result_desc["hits"]

                # 一定以上の相同性を有する配列の数
                @blastn_result_length = @blastn_result_hits.length

            end
        end

        ## search > hits の配列の数
        def get_blastn_result_length
            return @blastn_result_length
        end

        # 配列の中に特定の文字列が含まれているかを判定
        ## 引数：調べたい文字列
        ## 返り値：含まれている場合->その要素、ない場合-> ""
        def acquire_elem_in_array(arr, str)
            ans = ""

            for i in 0..arr.length-1 do
                if arr[i].include?(str) then
                    ans = arr[i].split("=")[1]
                end
            end

            return ans
        end

        # @blastn_result_hits[i]["title"]の中身を"] ["で分ける
        ## 返り値：配列 ( "] [" で分けられてる)
        def split_title(i)
            str = @blastn_result_hits[i]["description"][0]["title"]
            ans = str.split("] [")
            ans_len = ans.length

            # 最初と最後の"[]"は削除しとく
            ans[0].delete!("[")
            ans[ans_len-1].delete!("]")

            return ans
        end
    end

    # 結果を読み込んで、assemblyだけを返す
    class AcquireBlastnAssembly < LoadBlastnResult

        # 初期化
        def initialize(blastn_result_path)

            # スーパークラスのinitializeに渡す
            super
        end

        ## description > title > assembly
        ### assemblyが欠けてるデータにはこの処理を行わないようにする
        ### (また後日すべてのデータにassemblyが正常に記載されているようにする)
        def get_blastn_result_align_assembly(i)
            raw_arr = split_title(i)
            ans = acquire_elem_in_array(raw_arr, "assembly")

            # " "を含むものは正常なassemblyではないと判断
            if ans.include?(" ") then return nil end

            return ans
        end
        
    end

    # BLASTnの結果の解析を行う
    class VariablizeBlastnResult < LoadBlastnResult
        
        # 初期化
        def initialize(blastn_result_path, match_result_assembly)

            super(blastn_result_path)
            @match_result_assembly = match_result_assembly

        end

        # 各種変数の取得
        ## program
        def get_blastn_result_program
            return @blastn_result["program"]
        end

        ## version
        def get_blastn_result_version
            return @blastn_result["version"]
        end

        ## reference
        def get_blastn_result_reference
            return @blastn_result["reference"]
        end

        ## search_target > db
        def get_blastn_result_db
            return @blastn_result["search_target"]["db"]
        end

        ## params > expect
        def get_blastn_result_expect
            return @blastn_result["params"]["expect"]
        end

        ## params > sc_match
        def get_blastn_result_sc_match
            return @blastn_result["params"]["sc_match"]
        end

        ## params > sc_mismatch
        def get_blastn_result_sc_mismatch
            return @blastn_result["params"]["sc_mismatch"]
        end

        ## params > gap_open
        def get_blastn_result_gap_open
            return @blastn_result["params"]["gap_open"]
        end

        ## params > gap_extend
        def get_blastn_result_gap_extend
            return @blastn_result["params"]["gap_extend"]
        end

        ## params > filter
        def get_blastn_result_filter
            return @blastn_result["params"]["filter"]
        end

        ## search > query_id
        def get_blastn_result_query_id
            return @blastn_result_desc["query_id"]
        end

        ## search > query_len
        def get_blastn_result_query_len
            return @blastn_result_desc["query_len"]
        end

        # アライメントの結果の取得
        # 0 ≤ i < @blastn_result_length
        
        ## description > id
        def get_blastn_result_align_id(i)
            return @blastn_result_hits[i]["description"][0]["id"]
        end

        ## description > accession
        def get_blastn_result_align_accession(i)
            return @blastn_result_hits[i]["description"][0]["accession"]
        end

        ## description > title > gene
        def get_blastn_result_align_gene(i)
            raw_arr = split_title(i)
            return acquire_elem_in_array(raw_arr, "gene")
        end

        ## description > title > locus_tag

        ## description > title > protein
        ### "protein="で分けるのは"protein_id"との区別のため
        def get_blastn_result_align_protein(i)
            raw_arr = split_title(i)
            return acquire_elem_in_array(raw_arr, "protein=").gsub(/assembly /, "")
        end

        ## description > title > protein_id
        def get_blastn_result_align_protein_id(i)
            raw_arr = split_title(i)
            return acquire_elem_in_array(raw_arr, "protein_id")
        end

        ## description > title > location
        def get_blastn_result_align_location(i)
            raw_arr = split_title(i)
            return acquire_elem_in_array(raw_arr, "location")
        end

        ## description > title > gbkey
        def get_blastn_result_align_gbkey(i)
            raw_arr = split_title(i)
            return acquire_elem_in_array(raw_arr, "gbkey")
        end

        ## len
        def get_blastn_result_align_length(i)
            return @blastn_result_hits[i]["len"]
        end

        ## hsps > num
        def get_blastn_result_align_num(i)
            return @blastn_result_hits[i]["hsps"][0]["num"]
        end

        ## hsps > bit_score
        def get_blastn_result_align_bit_score(i)
            return @blastn_result_hits[i]["hsps"][0]["bit_score"]
        end

        ## hsps > score
        def get_blastn_result_align_score(i)
            return @blastn_result_hits[i]["hsps"][0]["score"]
        end

        ## hsps > evalue
        def get_blastn_result_align_evalue(i)
            return @blastn_result_hits[i]["hsps"][0]["evalue"]
        end

        ## hsps > identity
        def get_blastn_result_align_identity(i)
            raw_identity = @blastn_result_hits[i]["hsps"][0]["identity"].to_i.to_f
            raw_aling_len = @blastn_result_hits[i]["hsps"][0]["align_len"].to_i.to_f
            final_identity = (raw_identity.quo(raw_aling_len) * 100).ceil(3).to_s
            return final_identity
        end

        ## hsps > query_from
        def get_blastn_result_align_query_from(i)
            return @blastn_result_hits[i]["hsps"][0]["query_from"]
        end

        ## hsps > query_to
        def get_blastn_result_align_query_to(i)
            return @blastn_result_hits[i]["hsps"][0]["query_to"]
        end

        ## hsps > query_strand
        def get_blastn_result_align_query_strand(i)
            return @blastn_result_hits[i]["hsps"][0]["query_strand"]
        end

        ## hsps > hit_from
        def get_blastn_result_align_hit_from(i)
            return @blastn_result_hits[i]["hsps"][0]["hit_from"]
        end

        ## hsps > hit_to
        def get_blastn_result_align_hit_to(i)
            return @blastn_result_hits[i]["hsps"][0]["hit_to"]
        end

        ## hsps > hit_strand
        def get_blastn_result_align_hit_strand(i)
            return @blastn_result_hits[i]["hsps"][0]["hit_strand"]
        end

        ## hsps > align_len
        def get_blastn_result_align_align_len(i)
            return @blastn_result_hits[i]["hsps"][0]["align_len"]
        end

        ## hsps > gaps
        def get_blastn_result_align_gaps(i)
            return @blastn_result_hits[i]["hsps"][0]["gaps"]
        end

        ## hsps > qseq
        ### 配列
        def get_blastn_result_align_qseq(i)
            return @blastn_result_hits[i]["hsps"][0]["qseq"].split("")
        end

        ## hsps > hseq
        ### 配列
        def get_blastn_result_align_hseq(i)
            return @blastn_result_hits[i]["hsps"][0]["hseq"].split("")
        end

        ## hsps > midline
        ### 配列 (true or false)
        def get_blastn_result_align_midline(i)
            arr = @blastn_result_hits[i]["hsps"][0]["midline"].split("")
            ans = Array.new(arr.length, false)
            for i in 0..arr.length do
                if arr[i] == "|" then
                    ans[i] = true
                end
            end
            return ans                
        end

        ## stat > db_num
        def get_blastn_result_stat_db_num
            return @blastn_result_desc["stat"]["db_num"]
        end

        ## stat > db_len
        def get_blastn_result_stat_db_len
            return @blastn_result_desc["stat"]["db_len"]
        end

        ## stat > hsp_len
        def get_blastn_result_stat_hsp_len
            return @blastn_result_desc["stat"]["hsp_len"]
        end

        ## stat > eff_space
        def get_blastn_result_stat_eff_space
            return @blastn_result_desc["stat"]["eff_space"]
        end

        ## stat > kappa
        def get_blastn_result_stat_kappa
            return @blastn_result_desc["stat"]["kappa"]
        end

        ## stat > lambda
        def get_blastn_result_stat_lambda
            return @blastn_result_desc["stat"]["lambda"]
        end

        ## stat > entropy
        def get_blastn_result_stat_entropy
            return @blastn_result_desc["stat"]["entropy"]
        end

    end

    # tBLASTnの検索を行う
    class SearchTblastn
    end

    # 保存期間の過ぎたJSONファイルの削除
    def delete_blast_result_json
    end
end
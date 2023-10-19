require 'json'

module TblastnHelper

    # BLAST DBの場所
    BLAST_DB_PATH = "./lib/assets/blast/blast_db/blast_db_nucleotide/db_230512"

    # BLASTの検索に使うQuery配列のファイルの保存場所
    ## 保存期間決めて過ぎたら削除する
    BLAST_QUERY_PATH = "./tmp/storage/blast_query/"

    # BLASTの検索結果のJSONファイルを保存する場所
    ## 保存期間決めて過ぎたら削除する
    BLAST_RESULT_PATH = "./tmp/storage/blast_result/"

    # tBLASTnの場所
    TBLASTN_PATH = "./lib/assets/blast/ncbi_blast/tblastn"

    # テスト用のBLAST検索query配列の場所
    BLASTN_TEST_QUERY_PATH = "./tmp/storage/blast_query/test_query_0628.txt"

    # tblastnの検索を行う
    class SearchTblastn
    
        # query_seqとrequest_idを初期化
        ## query_seqは利用者が送信する問い合わせ配列
        ### 現時点では塩基配列のみ受け付ける
        ## request_idはリクエストごとにつけられる文字列
        ### controllerが作成
        ### tBLASTnの検索結果のJSONファイルの名前につけて識別
        def initialize(query_seq, request_id)
            @query_seq = query_seq
            @request_id = request_id
        end
        attr_accessor :query_seq, :request_id

        # query_seqを一時的にファイルに保存する
        ## ファイルでないとBLASTが使ってくれないため
        def make_query_file

            # 作成する配列のファイルのパス
            @tblastn_query_path = BLAST_QUERY_PATH + "tblastn_query_" + @request_id + ".txt"

            # ファイル作成
            File.open(@tblastn_query_path, "w") { |f| 
                f.print @query_seq
            }

        end

        # tBLASTn検索を実行する
        def search_tblastn

            # tBLASTn検索開始時間表示
            puts "[tBLASTn start]        " + `date +%Y/%m/%d_%H:%M:%S.%3N`

            # tBLASTnのオプション
            ## 問い合わせ配列
            tblastn_opt_query = @tblastn_query_path

            ## BLAST DB
            tblastn_opt_db = BLAST_DB_PATH

            ## BLAST検索の種類:tBLASTn
            tblastn_opt_task = "tblastn"

            ## 出力する結果のフォーマット:13 (JSON形式)
            tblastn_opt_outfmt = 13

            ## 結果の保存場所
            tblastn_opt_out = BLAST_RESULT_PATH + "tblastn_result_" + @request_id + ".txt"

            ## オプション全体
            tblastn_opts = "-query #{tblastn_opt_query} -db #{tblastn_opt_db} -task #{tblastn_opt_task} -outfmt #{tblastn_opt_outfmt} -out #{tblastn_opt_out}"

            # tBLASTn検索実行
            %x{ #{TBLASTN_PATH} #{tblastn_opts} }

            # tBLASTn検索終了時間表示
            puts "[tBLASTn finish]       " + `date +%Y/%m/%d_%H:%M:%S.%3N`

        end

        # tBLASTn検索で得られたJSONファイルを取得する
        ## tBLASTn検索が終わるのには時間がかかるが、検索結果のJSONファイル自体は検索開始後すぐに得られる
        ## これをcontrollerで定期実行して監視、存在すればクライアントに送信
        def is_present_tblastn_result

            # 結果の保存場所
            tblastn_result_path = BLAST_RESULT_PATH + "tblastn_result_" + @request_id + ".txt_1.json"

            # ファイルが存在するか判定
            ## 存在すればファイルのパスを返す
            ## 存在しなければnilを返す
            if File.exist?(tblastn_result_path) then

                # JSONファイル読み込み
                File.open(tblastn_result_path) do |file|

                    begin
                    
                        # JSON読み込み
                        raw_hash = JSON.load(file)

                        unless raw_hash.blank? then return true end

                    rescue JSON::ParserError => e
                        $stderr.puts "ERROR: #{e}"
                    end

                end

            else
                return false
            end
        end

    end

    class SaveTblastnResult

        # BLAST結果のJSONファイルのパス
        def initialize(request_id)

            @request_id = request_id

        end
        attr_accessor :request_id

        # クラス変数を定義する
        @@tblastn_result, @@tblastn_result_desc = {}
        @@tblastn_result_hits = []
        @@tblastn_result_length = 0

        # JSONファイルの読み込み
        def load_tblastn_result

            tblastn_result_path = BLAST_RESULT_PATH + "tblastn_result_" + @request_id + ".txt_1.json"

            # JSONファイル読み込み
            File.open(tblastn_result_path) do |file|

                # JSON読み込み
                raw_hash = JSON.load(file)

                # "BlastOutput2" > "report"
                @@tblastn_result = raw_hash["BlastOutput2"]["report"]

                # "BlastOutput2" > "report" > "results" > "search"
                @@tblastn_result_desc = @@tblastn_result["results"]["search"]

                # "BlastOutput2" > "report" > "results" > "search" > "hits"
                @@tblastn_result_hits = @@tblastn_result_desc["hits"]

                # 一定以上の相同性を有する配列の数
                @@tblastn_result_length = @@tblastn_result_hits.length

            end
        end

        # tBLASTnの結果を保存する
        def save_tblastn_result_to_table(search_id)

            # 繰り返ししない変数の代入
            ## program
            program = @@tblastn_result["program"]

            ## version
            version = @@tblastn_result["version"]

            ## reference
            reference = @@tblastn_result["reference"]

            ## db
            db = @@tblastn_result["search_target"]["db"]

            ## matrix
            matrix = @@tblastn_result["params"]["matrix"]

            ## expect
            expect = @@tblastn_result["params"]["expect"].to_i

            ## gap_open
            gap_open = @@tblastn_result["params"]["gap_open"].to_i

            ## gap_extend
            gap_extend = @@tblastn_result["params"]["gap_extend"].to_i

            ## filter
            filter = @@tblastn_result["params"]["filter"]

            ## cbs
            cbs = @@tblastn_result["params"]["cbs"].to_i

            ## db_gencode
            db_gencode = @@tblastn_result["params"]["db_gencode"].to_i

            ## query_id
            query_id = @@tblastn_result_desc["query_id"]

            ## query_title
            query_title = @@tblastn_result_desc["query_title"]

            ## query_len
            query_len = @@tblastn_result_desc["query_len"].to_i

            ## db_num
            db_num = @@tblastn_result_desc["stat"]["db_num"]

            ## db_len
            db_len = @@tblastn_result_desc["stat"]["db_len"]

            ## hsp_len
            hsp_len = @@tblastn_result_desc["stat"]["hsp_len"]

            ## eff_space
            eff_space = @@tblastn_result_desc["stat"]["eff_space"]

            ## kappa
            kappa = @@tblastn_result_desc["stat"]["kappa"]

            ## lambda
            lambda = @@tblastn_result_desc["stat"]["lambda"]

            ## entropy
            entropy = @@tblastn_result_desc["stat"]["entropy"]

            # 繰り返しする変数の代入
            @@tblastn_result_length.times do |i|
                
                # title切り分ける
                raw_arr = split_title(i)

                # num
                num = @@tblastn_result_hits[i]["num"].to_i

                # description > accession
                accession = @@tblastn_result_hits[i]["description"][0]["accession"]

                # description > title > gene
                gene = acquire_elem_in_array(raw_arr, "gene")

                # description > title > locus_tag
                locus_tag = acquire_elem_in_array(raw_arr, "locus_tag")

                # description > title > protein
                ## "protein="で分けるのは"protein_id"との区別のため
                protein = acquire_elem_in_array(raw_arr, "protein=").gsub(/assembly /, "")

                # description > title > protein_id
                protein_id = acquire_elem_in_array(raw_arr, "protein_id")

                # description > title > location
                location = acquire_elem_in_array(raw_arr, "location")

                # description > title > gbkey
                gbkey = acquire_elem_in_array(raw_arr, "gbkey")

                # description > title > assembly
                assembly = get_tblastn_result_align_assembly(raw_arr)

                ## len
                len = @@tblastn_result_hits[i]["len"].to_i

                # hsps > num
                num = @@tblastn_result_hits[i]["hsps"][0]["num"]

                # hsps > bit_score
                bit_score = @@tblastn_result_hits[i]["hsps"][0]["bit_score"]

                # hsps > score
                score = @@tblastn_result_hits[i]["hsps"][0]["score"]

                # hsps > evalue
                evalue = @@tblastn_result_hits[i]["hsps"][0]["evalue"]

                # hsps > identity
                identity = get_tblastn_result_align_identity(i)
                
                # hsps > positive
                positive = @@tblastn_result_hits[i]["hsps"][0]["evpositivealue"]

                # hsps > query_from
                query_from = @@tblastn_result_hits[i]["hsps"][0]["query_from"]

                # hsps > query_to
                query_to = @@tblastn_result_hits[i]["hsps"][0]["query_to"]

                # hsps > hit_from
                hit_from = @@tblastn_result_hits[i]["hsps"][0]["hit_from"]

                # hsps > hit_to
                hit_to = @@tblastn_result_hits[i]["hsps"][0]["hit_to"]

                # hsps > hit_frame
                hit_frame = @@tblastn_result_hits[i]["hsps"][0]["hit_frame"]

                # hsps > align_len
                align_len = @@tblastn_result_hits[i]["hsps"][0]["align_len"]

                # hsps > gaps
                gaps = @@tblastn_result_hits[i]["hsps"][0]["gaps"]

                # hsps > qseq
                ## 配列
                qseq = @@tblastn_result_hits[i]["hsps"][0]["qseq"].split("")

                # hsps > hseq
                ## 配列
                hseq = @@tblastn_result_hits[i]["hsps"][0]["hseq"].split("")

                # hsps > midline
                midline = @@tblastn_result_hits[i]["hsps"][0]["midline"].split("")

                # 変数のtblastn_resultsへの保存
                TblastnResult.create(
                    request_id: @request_id, 
                    program: program, 
                    version: version, 
                    reference: reference, 
                    db: db, 
                    matrix: matrix, 
                    expect: expect, 
                    gap_open: gap_open, 
                    gap_extend: gap_extend, 
                    filter: filter,
                    cbs: cbs,
                    db_gencode: db_gencode,
                    query_id: query_id, 
                    query_title: query_title, 
                    query_len: query_len, 
                    num: num,
                    accession: accession, 
                    gene: gene, 
                    locus_tag: locus_tag, 
                    protein: protein, 
                    protein_id: protein_id, 
                    location: location, 
                    gbkey: gbkey, 
                    assembly: assembly, 
                    bit_score: bit_score, 
                    score: score, 
                    evalue: evalue, 
                    identity: identity, 
                    query_from: query_from, 
                    query_to: query_to, 
                    hit_from: hit_from, 
                    hit_to: hit_to, 
                    hit_frame: hit_frame, 
                    align_len: align_len, 
                    gaps: gaps, 
                    midline: midline, 
                    hseq: hseq, 
                    qseq: qseq, 
                    search_id: search_id
                )

            end

        end

        # 保存期間の過ぎたJSONファイルの削除
        def delete_tblastn_result_json
        end

        # 保存したtBLASTnの結果のassemblyを取り出す
        def acquire_tblastn_assembly

            raw_hash = BlastnResult.where(request_id: @request_id)

            key_to_extract = [:id, :assembly, :identity]

            ans = raw_hash.map do |hash|

                new_hash = {}

                key_to_extract.each do |key, value|

                    new_hash[key] = hash[key]

                end

                new_hash

            end

            return ans
        end

        private

        # 各種変数の取得

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

        # @tblastn_result_hits[i]["title"]の中身を"] ["で分ける
        ## 返り値：配列 ( "] [" で分けられてる)
        def split_title(i)
            str = @@tblastn_result_hits[i]["description"][0]["title"]
            ans = str.split("] [")
            ans_len = ans.length

            # 最初と最後の"[]"は削除しとく
            ans[0].delete!("[")
            ans[ans_len-1].delete!("]")

            return ans
        end

        ## hsps > identity
        def get_tblastn_result_align_identity(i)
            raw_identity = @@tblastn_result_hits[i]["hsps"][0]["identity"].to_i.to_f
            raw_aling_len = @@tblastn_result_hits[i]["hsps"][0]["align_len"].to_i.to_f
            final_identity = (raw_identity.quo(raw_aling_len) * 100).ceil(3).to_s
            return final_identity
        end

        ## hsps > midline
        ### 配列 (true or false)
        def get_tblastn_result_align_midline(i)
            arr = @@tblastn_result_hits[i]["hsps"][0]["midline"].split("")
            ans = Array.new(arr.length, false)
            for i in 0..arr.length do
                if arr[i] == "|" then
                    ans[i] = true
                end
            end
            return ans                
        end

        ## description > title > assembly
        ### assemblyが欠けてるデータにはこの処理を行わないようにする
        ### (また後日すべてのデータにassemblyが正常に記載されているようにする)
        def get_tblastn_result_align_assembly(raw_arr)
            
            ans = acquire_elem_in_array(raw_arr, "assembly")

            # " "を含むものは正常なassemblyではないと判断
            if ans.include?(" ") then return nil end

            return ans
        end


    end

end
require 'json'

# BLASTの検索を実行し、結果に直接アクセスする
module BlastnHelper

    # BLAST DBの場所
    BLAST_DB_PATH = "./lib/assets/blast/blast_db/blast_db_nucleotide/db_231020"

    # BLASTの検索に使うQuery配列のファイルの保存場所
    ## 保存期間決めて過ぎたら削除する
    BLAST_QUERY_PATH = "./tmp/storage/blast_query/"

    # BLASTの検索結果のJSONファイルを保存する場所
    ## 保存期間決めて過ぎたら削除する
    BLAST_RESULT_PATH = "./tmp/storage/blast_result/"

    # BLASTnの場所
    BLASTN_PATH = "./lib/assets/blast/ncbi_blast/blastn"

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
            @blastn_query_path = BLAST_QUERY_PATH + "blastn_query_" + @request_id + ".txt"

            # ファイル作成
            File.open(@blastn_query_path, "w") { |f| 
                f.print @query_seq
            }

        end

        # BLASTn検索を実行する
        def search_blastn

            # BLASTn検索開始時間表示
            puts "[BLASTn start]        " + `date +%Y/%m/%d_%H:%M:%S.%3N`

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
            puts "[BLASTn finish]       " + `date +%Y/%m/%d_%H:%M:%S.%3N`

        end

        # BLASTn検索で得られたJSONファイルを取得する
        ## BLASTn検索が終わるのには時間がかかるが、検索結果のJSONファイル自体は検索開始後すぐに得られる
        ## これをcontrollerで定期実行して監視、存在すればクライアントに送信
        def is_present_blastn_result

            # 結果の保存場所
            blastn_result_path = BLAST_RESULT_PATH + "blastn_result_" + @request_id + ".txt_1.json"

            # ファイルが存在するか判定
            ## 存在すればファイルのパスを返す
            ## 存在しなければnilを返す
            if File.exist?(blastn_result_path) then

                # JSONファイル読み込み
                File.open(blastn_result_path) do |file|

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

    class SaveBlastnResult

        # BLAST結果のJSONファイルのパス
        def initialize(request_id)

            @request_id = request_id

        end
        attr_accessor :request_id

        # クラス変数を定義する
        @@blastn_result, @@blastn_result_desc = {}
        @@blastn_result_hits = []
        @@blastn_result_length = 0

        # JSONファイルの読み込み
        def load_blastn_result

            blastn_result_path = BLAST_RESULT_PATH + "blastn_result_" + @request_id + ".txt_1.json"

            # JSONファイル読み込み
            File.open(blastn_result_path) do |file|

                # JSON読み込み
                raw_hash = JSON.load(file)

                # "BlastOutput2" > "report"
                @@blastn_result = raw_hash["BlastOutput2"]["report"]

                # "BlastOutput2" > "report" > "results" > "search"
                @@blastn_result_desc = @@blastn_result["results"]["search"]

                # "BlastOutput2" > "report" > "results" > "search" > "hits"
                @@blastn_result_hits = @@blastn_result_desc["hits"]

                # 一定以上の相同性を有する配列の数
                @@blastn_result_length = @@blastn_result_hits.length

            end
        end

        # BLASTnの結果を保存する
        def save_blastn_result_to_table(search_id)

            # 繰り返ししない変数の代入
            ## program
            program = @@blastn_result["program"]

            ## version
            version = @@blastn_result["version"]

            ## reference
            reference = @@blastn_result["reference"]

            ## db
            db = @@blastn_result["search_target"]["db"]

            ## expect
            expect = @@blastn_result["params"]["expect"].to_i

            ## sc_match
            sc_match = @@blastn_result["params"]["sc_match"].to_i

            ## sc_mismatch
            sc_mismatch = @@blastn_result["params"]["sc_mismatch"].to_i

            ## gap_open
            gap_open = @@blastn_result["params"]["gap_open"].to_i

            ## gap_extend
            gap_extend = @@blastn_result["params"]["gap_extend"].to_i

            ## filter
            filter = @@blastn_result["params"]["filter"]

            ## query_id
            query_id = @@blastn_result_desc["query_id"]

            ## query_len
            query_len = @@blastn_result_desc["query_len"].to_i

            ## db_num
            db_num = @@blastn_result_desc["stat"]["db_num"]

            ## db_len
            db_len = @@blastn_result_desc["stat"]["db_len"]

            ## hsp_len
            hsp_len = @@blastn_result_desc["stat"]["hsp_len"]

            ## eff_space
            eff_space = @@blastn_result_desc["stat"]["eff_space"]

            ## kappa
            kappa = @@blastn_result_desc["stat"]["kappa"]

            ## lambda
            lambda = @@blastn_result_desc["stat"]["lambda"]

            ## entropy
            entropy = @@blastn_result_desc["stat"]["entropy"]

            # 繰り返しする変数の代入
            @@blastn_result_length.times do |i|
                
                # title切り分ける
                raw_arr = split_title(i)

                # num
                num = @@blastn_result_hits[i]["num"].to_i

                # description > accession
                accession = @@blastn_result_hits[i]["description"][0]["accession"]

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
                assembly = get_blastn_result_align_assembly(raw_arr)

                ## len
                len = @@blastn_result_hits[i]["len"].to_i

                # hsps > num
                num = @@blastn_result_hits[i]["hsps"][0]["num"]

                # hsps > bit_score
                bit_score = @@blastn_result_hits[i]["hsps"][0]["bit_score"]

                # hsps > score
                score = @@blastn_result_hits[i]["hsps"][0]["score"]

                # hsps > evalue
                evalue = @@blastn_result_hits[i]["hsps"][0]["evalue"]

                # hsps > identity
                identity = get_blastn_result_align_identity(i)

                # hsps > query_from
                query_from = @@blastn_result_hits[i]["hsps"][0]["query_from"]

                # hsps > query_to
                query_to = @@blastn_result_hits[i]["hsps"][0]["query_to"]

                # hsps > query_strand
                query_strand = @@blastn_result_hits[i]["hsps"][0]["query_strand"]

                # hsps > hit_from
                hit_from = @@blastn_result_hits[i]["hsps"][0]["hit_from"]

                # hsps > hit_to
                hit_to = @@blastn_result_hits[i]["hsps"][0]["hit_to"]

                # hsps > hit_strand
                hit_strand = @@blastn_result_hits[i]["hsps"][0]["hit_strand"]

                # hsps > align_len
                align_len = @@blastn_result_hits[i]["hsps"][0]["align_len"]

                # hsps > gaps
                gaps = @@blastn_result_hits[i]["hsps"][0]["gaps"]

                # hsps > qseq
                ## 配列
                qseq = @@blastn_result_hits[i]["hsps"][0]["qseq"].split("")

                # hsps > hseq
                ## 配列
                hseq = @@blastn_result_hits[i]["hsps"][0]["hseq"].split("")

                # hsps > midline
                ## 配列 (boolean)
                midline = get_blastn_result_align_midline(i)

                # 変数のblastn_resultsへの保存
                BlastnResult.create(
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
                    query_strand: query_strand, 
                    hit_from: hit_from, 
                    hit_to: hit_to, 
                    hit_strand: hit_strand, 
                    align_len: align_len, 
                    gaps: gaps, 
                    midline: midline, 
                    hseq: hseq, 
                    qseq: qseq, 
                    request_id: @request_id, 
                    program: program, 
                    version: version, 
                    reference: reference, 
                    db: db, 
                    expect: expect, 
                    sc_match: sc_match, 
                    sc_mismatch: sc_mismatch, 
                    gap_open: gap_open, 
                    gap_extend: gap_extend, 
                    filter: filter, 
                    query_id: query_id, 
                    query_len: query_len, 
                    num: num,
                    search_id: search_id
                )

            end

        end

        # 保存期間の過ぎたJSONファイルの削除
        def delete_blastn_result_json
        end

        # 保存したBLASTnの結果のassemblyを取り出す
        def acquire_blastn_assembly

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

        # @blastn_result_hits[i]["title"]の中身を"] ["で分ける
        ## 返り値：配列 ( "] [" で分けられてる)
        def split_title(i)
            str = @@blastn_result_hits[i]["description"][0]["title"]
            ans = str.split("] [")
            ans_len = ans.length

            # 最初と最後の"[]"は削除しとく
            ans[0].delete!("[")
            ans[ans_len-1].delete!("]")

            return ans
        end

        ## hsps > identity
        def get_blastn_result_align_identity(i)
            raw_identity = @@blastn_result_hits[i]["hsps"][0]["identity"].to_i.to_f
            raw_aling_len = @@blastn_result_hits[i]["hsps"][0]["align_len"].to_i.to_f
            final_identity = (raw_identity.quo(raw_aling_len) * 100).ceil(3).to_s
            return final_identity
        end

        ## hsps > midline
        ### 配列 (true or false)
        def get_blastn_result_align_midline(i)
            arr = @@blastn_result_hits[i]["hsps"][0]["midline"].split("")
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
        def get_blastn_result_align_assembly(raw_arr)
            
            ans = acquire_elem_in_array(raw_arr, "assembly")

            # " "を含むものは正常なassemblyではないと判断
            if ans.include?(" ") then return nil end

            return ans
        end


    end

end
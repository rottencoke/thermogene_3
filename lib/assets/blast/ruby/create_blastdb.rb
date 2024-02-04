# makeblastdbのパス
MAKEBLASTDB_PATH = "./lib/assets/blast/ncbi_blast/makeblastdb"

#読み込むDBのパス
DB_PATH = "./lib/assets/blast/blast_db/"

# tmpのncbi_fasta系の情報を保存する場所
TMP_NCBI_PATH = "./tmp/storage/ncbi_fasta/"

# fnaファイルをmfaファイルに変換
def convert_fna_to_mfa
    puts "mfaファイルに変換中"

    # まずfnaファイルをmfaファイルに変換する
    %x{ cat #{TMP_NCBI_PATH}/cds_from_genomic_assembly/*.fna > #{TMP_NCBI_PATH}/cds_from_genomic_mfa/raw_data.mfa }

    puts "mfaファイル変換完了"
end


# fastaファイル等で保存したDB用の配列情報をDB形式に変換する
def convert_mfa_to_blast_db
    
    puts "DB作成中"

    # makeblastdbのオプション
    ## 元のファイル(.mfa形式)
    makeblastdb_option_in = "#{TMP_NCBI_PATH}/cds_from_genomic_mfa/raw_data.mfa"

    ## DBの種類
    makeblastdb_option_dbtype = "nucl"

    ## 出力されるDBのファイルの名前
    makeblastdb_option_out = "#{DB_PATH}blast_db_nucleotide/db_240204"

    ## DBの名前
    makeblastdb_option_title = "species from TEMPURA"

    ## ログファイルの指定
    makeblastdb_option_logfile = "#{DB_PATH}log/makeblastdb.log.txt"

    ## DBの最大ファイルサイズ
    ### number of bites
    ### 3GB = 20 * 1000 * 1000
    ### 4GiB以下じゃないとだめらしい
    makeblastdb_option_max_file_sz = 3 * 1_000_000_000

    ## オプションをまとめる
    makeblastdb_options = "-in \"#{makeblastdb_option_in}\" -dbtype #{makeblastdb_option_dbtype} -parse_seqids -out \"#{makeblastdb_option_out}\" -title \"#{makeblastdb_option_title}\" -max_file_sz #{makeblastdb_option_max_file_sz} -logfile \"#{makeblastdb_option_logfile}\" -hash_index" 
    
    # makeblastdbを実行してBLAST DBを作成する
    %x{ #{MAKEBLASTDB_PATH} #{makeblastdb_options}}

    # %x{ ./lib/assets/blast/ncbi_blast/makeblastdb -in #{TMP_NCBI_PATH}/cds_from_genomic_mfa/raw_data.mfa -dbtype nucl -parse_seqids -out ./lib/assets/blast/blast_db/blast_db_nucleotide/db_230512 -title db_tempura_40_more -max_file_sz 20000000 -logfile ./lib/assets/blast/blast_db/log/makeblastdb.log.txt -hash_index }

    puts "DB作成完了"
    
end
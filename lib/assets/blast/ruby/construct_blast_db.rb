require 'open-uri'
# require 'zip' # エラーが起こったからコメントアウトした
require 'json'

# libディレクトリはautoloadの対象外なので手動でmodelの読み込みを行う
require_relative '../../../../config/environment'
require_dependency "#{Rails.root}/app/models/tempura"

# makeblastdbのパス
MAKEBLASTDB_PATH = "./lib/assets/blast/ncbi_blast/makeblastdb"

#読み込むDBのパス
DB_PATH = "./lib/assets/blast/blast_db/"

# tmpのncbi_fasta系の情報を保存する場所
TMP_NCBI_PATH = "./tmp/storage/ncbi_fasta/"


# ダウンロードに必要なURL
URL1 = 'https://api.ncbi.nlm.nih.gov/datasets/v2alpha/genome/accession/'
URL2 = '/download?include_annotation_type=GENOME_FASTA,GENOME_GFF,RNA_FASTA,CDS_FASTA,PROT_FASTA,SEQUENCE_REPORT&filename='
URL3 = '.zip'

# TEMPURAに登録されている情報の取得を行う
## 全体で扱う情報だからクラスメソッド(self.~)で定義
## 引数：なし
## 返り値：assembly（配列）
## require 'json'
def acquire_tempura_assembly

    # Tempuraからassemblyがあるデータからassemblyを取得する
    ans_assembly = Tempura.where.not(assembly_or_accession: nil).pluck(:assembly_or_accession)

    # ans_assembly = Tempura.pluck(:assembly_or_accession)

    #抽出されたassemblyを返す（配列）
    return  ans_assembly
    
end

# BLASTのDBの構築を行う
class ConstructBlastDb

    # インスタンス化した時の引数をインスタンス変数に設定して利用しやすくする
    def initialize(assembly)
        @assembly = assembly
    end
    attr_accessor :assembly

    # NCBIからゲノム情報をzipファイルでダウンロードする
    ## 引数：ゲノム情報をダウンロードするのに必要なassembly
    ## 返り値：なし
    ## require 'open-uri'
    def download_genome_as_zip

        url = URL1 + @assembly + URL2 + @assembly + URL3

        file_name = "#{TMP_NCBI_PATH}/cds_zip/#{@assembly}.zip"

        # URLにアクセス
        URI.open(url) do |file|

            puts file

            # ファイルを展開
            File.open(file_name, "w+b") do |out|
                out.write(file.read)
            end
        end
    end

    # 取得したzipファイルから中のファイルを取り出す
    ## 引数：assembly
    ## 返り値：なし
    ## require 'zip'
    def extract_genome_from_zip
    
        # このファイルをまとめる
        target = "cds_from_genomic.fna"

        file_name = "#{TMP_NCBI_PATH}/cds_zip/#{@assembly}.zip"
        
        # 解凍するzipファイルのパスを引数に指定
        Zip::File.open(file_name) do |zip|
            
            zip.each do |entry|

                # entry.nameでzipファイルのパスを取得
                file_name = entry.name

                puts file_name 
            
                if file_name.include?(target) then

                    path_to_extract = "#{TMP_NCBI_PATH}/cds_from_genomic/#{@assembly}.fna"

                    zip.extract(entry, path_to_extract) { true } 

                end
            end
        end
    end

    # zipファイルを削除する
    # fnaファイルの保存が完了したら使用
    def delete_zip
        zip = "#{TMP_NCBI_PATH}/cds_zip/#{@assembly}.zip"

        File.delete(zip) if File.exist?(zip)
    end

    # fastaファイルにassemblyを記載する
    def add_assembly_to_fasta

        # puts "assembly追記中"

        fasta_path = "#{TMP_NCBI_PATH}/cds_from_genomic/#{@assembly}.fna"

        assembly_desc = " [assembly=" + @assembly + "]"

        # 新規ファイルに書き込んでいく
        ## 新規ファイル名
        file_assembly_path = "#{TMP_NCBI_PATH}/cds_from_genomic_assembly/#{@assembly}.fna"

        ## 新規ファイル作成
        file_new = File.open(file_assembly_path, "w")

        # ファイルが存在しない場合飛ばす
        return if !File.exist?(fasta_path) 

        # 一行ずつ読み込む
        File.open(fasta_path, "r") do |file|
            file.each_line do |line|

                # もし行のはじめに">"があれば
                if line.include?(">") && !line.include?("assembly") then

                    # 追記する文字列を作成
                    str = line.chomp + assembly_desc

                    # 文字列を追記
                    file_new.puts(str)

                # そうでない場合
                else

                    # そのまま記入
                    file_new.puts(line)
                end
            end
        end

    end
end

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
    makeblastdb_option_out = "#{DB_PATH}blast_db_nucleotide/db_231020"

    ## DBの名前
    makeblastdb_option_title = "species with 40 degrees or higher growth temp."

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
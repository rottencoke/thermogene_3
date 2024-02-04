require 'open-uri'
require 'zip' # エラーが起こったからコメントアウトした
require 'json'

# libディレクトリはautoloadの対象外なので手動でmodelの読み込みを行う
require_relative '../../../../config/environment'
require_dependency "#{Rails.root}/app/models/tempura"

# BLASTのDBの構築を行う
class FetchFasta

    # tmpのncbi_fasta系の情報を保存する場所
    TMP_NCBI_PATH = "./tmp/storage/ncbi_fasta/"
    
    # ダウンロードに必要なURL
    URL1 = 'https://api.ncbi.nlm.nih.gov/datasets/v2alpha/genome/accession/'
    URL2 = '/download?include_annotation_type=GENOME_FASTA,GENOME_GFF,RNA_FASTA,CDS_FASTA,PROT_FASTA,SEQUENCE_REPORT&filename='
    URL3 = '.zip'

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

        # ファイルの存在を確認
        unless File.exist?(file_name)
            puts "#{file_name} does not exist."
            return
        end

        # ファイルのサイズを確認（0または非常に小さい場合は、ファイルが破損している可能性があります）
        if File.size(file_name) < 1024 # 1KBより小さい場合は警告
            puts "#{file_name} seems to be too small or corrupted."
            return
        end
        
        begin
            Zip::File.open(file_name) do |zip|
                zip.each do |entry|
                    file_name = entry.name
                    if file_name.include?(target)
                        path_to_extract = "#{TMP_NCBI_PATH}/cds_from_genomic/#{@assembly}.fna"
                        zip.extract(entry, path_to_extract) { true }
                    end
                end
            end
        rescue OpenURI::HTTPError => e
            # HTTPエラーが発生した場合の処理
            puts "Failed to download #{file_name}: #{e.message}"
            return nil
        rescue StandardError => e
            # その他のエラーが発生した場合の処理
            puts "An error occurred: #{e.message}"
            return nil
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

        # 使い終わった元のfastaファイルは削除する
        File.delete(fasta_path)

    end
end
require 'open-uri'
# require 'zip'

# BLASTのDBの管理構築
module BlastDbHelper

    #読み込むDBのパス
    DB_PATH = "./lib/assets/blast/db"

    #読み込むJSONファイルのパス
    TEMPURA_JSON_PATH = "./lib/assets/tempura/jsons/200617_TEMPURA.json"

    # TEMPURAに登録されている情報の取得を行う
    class AcquireTempuraForBlastDb

        # TEMPURAに登録されている情報の取得を行う
        ## 引数：なし
        ## 返り値：assembly（配列）
        def acquire_tempura

            #JSONファイルを読み込んで配列に変換する
            File.open(TEMPURA_JSON_PATH) do |file| #test.json

                tempura_array = JSON.load(file)

                #assembly_or_accessionが空ではないデータを取得
                tempura_array_selected = tempura_array.select{|hash| hash["assembly_or_accession"] != nil}

                #取得したそれぞれのデータからassemblyを取り出す
                assembly_target = tempura_array_selected.map{|hash| hash["assembly_or_accession"]}

                #抽出されたassemblyを返す（配列）
                return assembly_target
            end
        end
    end

    # BLASTのDBの構築を行う
    class ConstructBlastDb

        # インスタンス化した時の引数をインスタンス変数に設定して利用しやすくする
        def initialize(assembly)
            @assembly = assembly
        end

        # NCBIからゲノム情報をzipファイルでダウンロードする
        ## 引数：ゲノム情報をダウンロードするのに必要なassembly
        ## 返り値：なし
        ## require 'open-uri'
        # ダウンロードに必要なURL
        URL1 = "https://api.ncbi.nlm.nih.gov/datasets/v2alpha/genome/accession/"
        URL2 = "/download?include_annotation_type=GENOME_FASTA,GENOME_GFF,RNA_FASTA,CDS_FASTA,PROT_FASTA,SEQUENCE_REPORT&filename="
        URL3 = ".zip"
        def download_genome_as_zip
            

            url = URL1 + @assembly + URL2 + @assembly + URL3

            file_name= "../../tmp/storage/zip/" + @assembly + ".zip"

            URI.open(url) do |file|
                URI.open(file_name, "w+b") do |out|
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

            # fnaファイル抽出先のディレクトリ
            out = "../../lib/assets/blast/db/cds_from_genomic"

            
            # 解凍するzipファイルのパスを引数に指定
            Zip::File.open(@assembly + ".zip") do |zip|
                
                zip.each do |entry|

                    # entry.nameでzipファイルのパスを取得
                    file_name = entry.name

                    puts file_name 
                
                    if file_name.include?(target) then 
                        zip.extract(entry, out + @assembly + ".fna") { true } 
                    end
                end
            end
        end

        # zipファイルを削除する
        # fnaファイルの保存が完了したら使用
        def delete_zip
            zip = "../../tmp/storage/zip/" + @assembly + ".zip"
            File.delete(zip) if File.exist?(zip)
        end
    end

    # サーバー内に構築されているDBの確認を行う
    class ConfirmBlastDb
        
        # DBの確認
        def confirm_blast_db
        end
        

    end

end

require './lib/assets/blast/ruby/fetch_refseq_accession'
require './lib/assets/blast/ruby/fetch_fasta'
require './lib/assets/blast/ruby/create_blastdb'
require_dependency "#{Rails.root}/app/models/tempura"
require File.expand_path("#{Rails.root}/config/environment", __dir__) # テーブル操作に必要

puts "start construct_blast_db : #{`date +%Y/%m/%d_%H:%M:%S.%3N`}"

num_fetch_fasta = 0
num_fail_fetch_refseq_accession = 0
num_tempura = Tempura.count

# TEMPURAの行数繰り返してassemblyを取得、genomeの保存を行う
# Tempura.find_each do |data|
Tempura.find_each do |data|

    # if data.id < 969 then next end

    puts "TEMPURA id = #{data.id} / #{num_tempura}"
    puts "生物種 : #{data.genus_and_species} / 生育温度 #{data.topt_ave}"

    # refseq_accession (元assembly) を格納
    refseq_accession = ""

    # refseq_accessionがある場合
    if data.assembly_or_accession

        refseq_accession = data.assembly_or_accession

        # 元のTEMPURAのデータにassembly_or_accessionがあった場合
        unless data.is_assembly_or_accession_added
            # strainカラムをstrain_blastdbカラムに保存
            data.update(strain_blastdb: data.strain)
        end

    # refseq_accessionがない場合
    else

        puts "refseq_accession取得中"

        taxonomy_id = data.taxonomy_id.to_s
        strain = data.strain

        ins = FetchRefseqAccession.new(taxonomy_id, strain)
        result = ins.find_refseq_accession()

        # refseq_accessionの取得失敗した場合飛ばす
        if !result then
            puts "refseq_accessionの取得失敗"
            num_fail_fetch_refseq_accession += 1
            puts ""
            next
        end

        puts result

        refseq_accession = result[:refseq_accession]
        strain = result[:strain]

        # 得られたstrainをstrain_blastdbに保存
        data.update(strain_blastdb: strain)

        # 得られたrefseq_accessionをassembly_or_accessionに保存
        data.update(assembly_or_accession: refseq_accession)

        # assemblyをncbiから取得したデータを区別するためにis_assembly_or_accession_addedをtrueに
        data.update(is_assembly_or_accession_added: true)

    end

    # インスタンス作成
    ins_assembly = FetchFasta.new(refseq_accession)

    begin

        puts "fasta保存開始"
        # NCBIからゲノム情報をzipファイルでダウンロードする
        ins_assembly.download_genome_as_zip()
    
        # 取得したzipファイルから中のファイルを取り出す
        ins_assembly.extract_genome_from_zip()
    
        # fastaファイルにassemblyを記載する
        ins_assembly.add_assembly_to_fasta()

        # zipファイルを削除する
        ins_assembly.delete_zip()

    rescue OpenURI::HTTPError => e
        # HTTPエラーが発生した場合の処理
        puts "A download error occurred: #{e.message}. Skipping all subsequent steps."
        # ここでrescueブロックから抜け出し、後続の処理を全てスキップ
    rescue StandardError => e
        # その他のエラーが発生した場合の処理
        puts "An unexpected error occurred: #{e.message}. Skipping all subsequent steps."
        # ここでrescueブロックから抜け出し、後続の処理を全てスキップ
    else
        puts "fasta保存成功"
        num_fetch_fasta += 1
    end

    puts ""

end

puts "fasta取得結果 成功 : #{num_fetch_fasta} / #{num_tempura} (refseq_accession取得失敗 : #{num_fail_fetch_refseq_accession})"

convert_fna_to_mfa()

# convert_mfa_to_blast_db()

puts "finish construct_blast_db"
require './lib/assets/blast/ruby/construct_blast_db'

puts "start construct_blast_db"

assembly = acquire_tempura_assembly

puts assembly.length

# assembly.length.times do |i|

#     # assemblyごとにインスタンスを作成
#     assembly_inst = ConstructBlastDb.new(assembly[i])

#     puts i.to_s + " : " + assembly_inst.assembly.to_s

#     assembly_inst.add_assembly_to_fasta
# end

# convert_fna_to_mfa

convert_mfa_to_blast_db

puts "finish construct_blast_db"
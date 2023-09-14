class CreateTempuras < ActiveRecord::Migration[7.0]
    def change
        create_table :tempuras do |t|

            t.string :genus_and_species
            t.integer :taxonomy_id
            t.string :strain
            t.string :superkingdom
            t.string :phylum
            t.string :class
            t.string :order
            t.string :family
            t.string :genus
            t.string :assembly_or_accession
            t.integer :Genome_GC
            t.integer :Genome_size
            t.string :r16S_accssion
            t.integer :r16S_GC
            t.integer :Tmin
            t.integer :Topt_ave
            t.integer :Topt_low
            t.integer :Topt_high
            t.integer :Tmax
            t.integer :Tmax_Tmin
            
            t.timestamps
        end
    end
end

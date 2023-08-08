class CreateBlastResults < ActiveRecord::Migration[7.0]
    def change
        create_table :blast_results do |t|

            t.string :accession
            t.string :gene
            t.string :locus_tag
            t.string :protein
            t.string :protein_id
            t.string :location
            t.string :gbkey
            t.string :assembly

            t.integer :bit_score
            t.integer :score
            t.string :evalue
            t.integer :identities
            t.integer :query_from
            t.integer :query_to
            t.string :query_strand
            t.integer :hit_from
            t.integer :hit_to
            t.string :hit_strand
            t.integer :align_len
            t.integer :gaps
            t.boolean :midline, array: true, default: []
            t.string :hseq, array: true, default: []
            t.string :qseq, array: true, default: []

            t.timestamps
        end
    end
end

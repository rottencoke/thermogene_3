class CreateTblastnResults < ActiveRecord::Migration[7.0]
    def change
        create_table :tblastn_results do |t|

            t.string :request_id
            t.string :program
            t.string :version
            t.string :reference
            t.string :db
            t.integer :expect
            t.integer :gap_open
            t.string :matrix
            t.integer :gap_extend
            t.string :filter
            t.integer :cbs
            t.integer :db_gencode
            t.string :query_id
            t.string :query_title
            t.integer :query_len
            t.integer :num

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
            t.integer :identity
            t.integer :positive
            t.integer :query_from
            t.integer :query_to
            t.integer :hit_from
            t.integer :hit_to
            t.integer :hit_frame
            t.integer :align_len
            t.integer :gaps
            t.string :midline, array: true, default: []
            t.string :hseq, array: true, default: []
            t.string :qseq, array: true, default: []

            t.references :search, null: false, foreign_key: true

            t.timestamps
        end
    end
end

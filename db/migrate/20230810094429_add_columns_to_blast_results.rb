class AddColumnsToBlastResults < ActiveRecord::Migration[7.0]
    def change
        add_column :blast_results, :request_id, :string
        add_column :blast_results, :program, :string
        add_column :blast_results, :version, :string
        add_column :blast_results, :reference, :string
        add_column :blast_results, :db, :string
        add_column :blast_results, :expect, :integer
        add_column :blast_results, :sc_match, :integer
        add_column :blast_results, :sc_mismatch, :integer
        add_column :blast_results, :gap_open, :integer
        add_column :blast_results, :gap_extend, :integer
        add_column :blast_results, :filter, :string
        add_column :blast_results, :query_id, :string
        add_column :blast_results, :query_len, :integer
        add_column :blast_results, :num, :integer

    end
end

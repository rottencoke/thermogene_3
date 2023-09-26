class RenameBlastResultIdColumnToResults < ActiveRecord::Migration[7.0]
    def change
        rename_column :results, :blast_result_id, :blastn_result_id
    end
end

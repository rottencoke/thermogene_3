class RenameColumnToBlastResults < ActiveRecord::Migration[7.0]
    def change
        rename_column :blast_results, :identities, :identity
    end
end

class ChangeBlastResultsToBlastnResults < ActiveRecord::Migration[7.0]
    def change
        rename_table :blast_results, :blastn_results
    end
end

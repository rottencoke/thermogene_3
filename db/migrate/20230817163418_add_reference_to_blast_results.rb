class AddReferenceToBlastResults < ActiveRecord::Migration[7.0]
    def change
        add_reference :blast_results, :search, null: false, foreign_key: true
    end
end

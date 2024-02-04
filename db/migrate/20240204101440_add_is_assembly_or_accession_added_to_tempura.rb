class AddIsAssemblyOrAccessionAddedToTempura < ActiveRecord::Migration[7.0]
    def change
        add_column :tempuras, :is_assembly_or_accession_added, :boolean, default: false, null: false
    end
end

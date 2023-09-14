class AddColumnsToResults < ActiveRecord::Migration[7.0]
    def change
        add_column :results, :tempura_id, :integer, array: true, default: []
        add_column :results, :blast_result_id, :integer, array: true, default: []
    end
end

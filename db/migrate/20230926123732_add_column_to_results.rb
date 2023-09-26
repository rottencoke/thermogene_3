class AddColumnToResults < ActiveRecord::Migration[7.0]
    def change
        add_column :results, :tblastn_result_id, :integer
    end
end

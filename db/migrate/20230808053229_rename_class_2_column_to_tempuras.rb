class RenameClass2ColumnToTempuras < ActiveRecord::Migration[7.0]
    def change
        rename_column :tempuras, :Class, :org_class
    end
end
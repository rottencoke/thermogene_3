class RenameClassColumnToTempuras < ActiveRecord::Migration[7.0]
    def change
        rename_column :tempuras, :class, :Class
    end
end
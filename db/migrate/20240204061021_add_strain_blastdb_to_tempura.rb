class AddStrainBlastdbToTempura < ActiveRecord::Migration[7.0]
    def change
        add_column :tempuras, :strain_blastdb, :string
    end
end

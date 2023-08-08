class ChangeDatatypeColumnsOfTempuras < ActiveRecord::Migration[7.0]
    def change
		change_column :tempuras, :Genome_GC, :float
		change_column :tempuras, :Genome_size, :float
		change_column :tempuras, :r16S_GC, :float
		change_column :tempuras, :Tmin, :float
		change_column :tempuras, :Topt_ave, :float
		change_column :tempuras, :Topt_low, :float
		change_column :tempuras, :Topt_high, :float
		change_column :tempuras, :Tmax, :float
		change_column :tempuras, :Tmax_Tmin, :float
    end
end

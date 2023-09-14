class RenameColumnsToTempuras < ActiveRecord::Migration[7.0]
    def change
        rename_column :tempuras, :Genome_GC, :genome_GC
        rename_column :tempuras, :Genome_size, :genome_size
        rename_column :tempuras, :Tmin, :tmin
        rename_column :tempuras, :Topt_ave, :topt_ave
        rename_column :tempuras, :Topt_low, :topt_low
        rename_column :tempuras, :Topt_high, :topt_high
        rename_column :tempuras, :Tmax, :tmax
        rename_column :tempuras, :Tmax_Tmin, :tmax_tmin
    end
end

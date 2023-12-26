class RemoveColumnsFromSearches < ActiveRecord::Migration[7.0]
    def change
        remove_column :searches, :identity_minimum, :float
        remove_column :searches, :identity_maximum, :float
        remove_column :searches, :eValue_minimum, :float
        remove_column :searches, :eValue_maximum, :float
        remove_column :searches, :qCoverage_minimum, :float
        remove_column :searches, :qCoverage_maximum, :float
    end
end

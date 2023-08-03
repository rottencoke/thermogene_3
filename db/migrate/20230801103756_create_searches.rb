class CreateSearches < ActiveRecord::Migration[7.0]
    def change
        create_table :searches do |t|
            t.string :jobtitle
            t.integer :temp_minimum
            t.integer :temp_maximum
            t.text :sequence
            t.string :search_method
            t.string :search_blast_engine
            t.float :identity_minimum
            t.float :identity_maximum
            t.float :eValue_minimum
            t.float :eValue_maximum
            t.float :qCoverage_minimum
            t.float :qCoverage_maximum
            
            t.timestamps
        end
    end
end

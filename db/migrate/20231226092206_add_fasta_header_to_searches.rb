class AddFastaHeaderToSearches < ActiveRecord::Migration[7.0]
  def change
    add_column :searches, :fasta_header, :text
  end
end

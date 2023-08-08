class AddReferencesToResults < ActiveRecord::Migration[7.0]
  def change
    add_reference :results, :searches, null: false, foreign_key: true
  end
end

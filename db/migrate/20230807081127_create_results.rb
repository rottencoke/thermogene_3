class CreateResults < ActiveRecord::Migration[7.0]
  def change
    create_table :results do |t|
      t.references :blast_result, null: false, foreign_key: true
      t.references :tempura, null: false, foreign_key: true

      t.timestamps
    end
  end
end

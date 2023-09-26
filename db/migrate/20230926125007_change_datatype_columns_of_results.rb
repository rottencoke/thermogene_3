class ChangeDatatypeColumnsOfResults < ActiveRecord::Migration[7.0]
    def change
        execute <<-SQL
            ALTER TABLE results
            ALTER COLUMN tblastn_result_id
            TYPE integer[] USING ARRAY[tblastn_result_id::INTEGER]
        SQL

        # Defaultの設定も追加できますが、この変更によりすでにデータが存在する場合、配列の形になります。
        # 例えば、もとの値が5だった場合、[5]という形の配列に変わります。
        change_column_default :results, :tblastn_result_id, []
    end
end

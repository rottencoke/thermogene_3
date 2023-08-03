# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_08_01_103756) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "searches", force: :cascade do |t|
    t.string "jobtitle"
    t.integer "temp_minimum"
    t.integer "temp_maximum"
    t.text "sequence"
    t.string "search_method"
    t.string "search_blast_engine"
    t.float "identity_minimum"
    t.float "identity_maximum"
    t.float "eValue_minimum"
    t.float "eValue_maximum"
    t.float "qCoverage_minimum"
    t.float "qCoverage_maximum"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end

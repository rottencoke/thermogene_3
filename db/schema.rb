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

ActiveRecord::Schema[7.0].define(version: 2023_09_26_094703) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "blastn_results", force: :cascade do |t|
    t.string "accession"
    t.string "gene"
    t.string "locus_tag"
    t.string "protein"
    t.string "protein_id"
    t.string "location"
    t.string "gbkey"
    t.string "assembly"
    t.integer "bit_score"
    t.integer "score"
    t.string "evalue"
    t.integer "identity"
    t.integer "query_from"
    t.integer "query_to"
    t.string "query_strand"
    t.integer "hit_from"
    t.integer "hit_to"
    t.string "hit_strand"
    t.integer "align_len"
    t.integer "gaps"
    t.boolean "midline", default: [], array: true
    t.string "hseq", default: [], array: true
    t.string "qseq", default: [], array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "request_id"
    t.string "program"
    t.string "version"
    t.string "reference"
    t.string "db"
    t.integer "expect"
    t.integer "sc_match"
    t.integer "sc_mismatch"
    t.integer "gap_open"
    t.integer "gap_extend"
    t.string "filter"
    t.string "query_id"
    t.integer "query_len"
    t.integer "num"
    t.bigint "search_id", null: false
    t.index ["search_id"], name: "index_blastn_results_on_search_id"
  end

  create_table "results", force: :cascade do |t|
    t.bigint "search_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "tempura_id", default: [], array: true
    t.integer "blast_result_id", default: [], array: true
    t.index ["search_id"], name: "index_results_on_search_id"
  end

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

  create_table "tempuras", force: :cascade do |t|
    t.string "genus_and_species"
    t.integer "taxonomy_id"
    t.string "strain"
    t.string "superkingdom"
    t.string "phylum"
    t.string "org_class"
    t.string "order"
    t.string "family"
    t.string "genus"
    t.string "assembly_or_accession"
    t.float "genome_GC"
    t.float "genome_size"
    t.string "r16S_accssion"
    t.float "r16S_GC"
    t.float "tmin"
    t.float "topt_ave"
    t.float "topt_low"
    t.float "topt_high"
    t.float "tmax"
    t.float "tmax_tmin"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "blastn_results", "searches"
  add_foreign_key "results", "searches"
end

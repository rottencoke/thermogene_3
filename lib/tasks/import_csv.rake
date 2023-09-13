namespace :import_csv do
    desc "Import CSV data"
    task tempura: :environment do
        require './lib/assets/tempura/ruby/import_csv.rb'
        ImportCsv.execute(model: Tempura, file_name: 'db/csv_data/200617_TEMPURA')
    end
end
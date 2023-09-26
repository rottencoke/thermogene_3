class Search < ApplicationRecord
    has_many :results
    has_many :blastn_results
end

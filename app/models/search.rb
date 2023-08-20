class Search < ApplicationRecord
    has_many :results
    has_many :blast_results
end

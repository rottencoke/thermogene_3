require 'net/http'
require 'uri'

class ApiController < ApplicationController
    include ApiHelper

    def get_ncbi_protein
        
        locus_tag = params[:locus_tag]

        protein_id = fetch_protein_id_by_locus_tag(locus_tag)

        sleep(1)

        obj_response = fetch_protein_features(protein_id)

        render json: obj_response, status: :ok
    end
end

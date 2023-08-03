class HomesController < ApplicationController
    def index
        @search = Search.new
    end

end

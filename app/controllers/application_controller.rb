class ApplicationController < ActionController::Base
    include SearchesHelper
    include TempuraHelper
    include BlastHelper    
    include BlastDbHelper    

end

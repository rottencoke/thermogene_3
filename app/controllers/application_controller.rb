class ApplicationController < ActionController::Base
    include SearchHelper
    include TempuraHelper
    include BlastHelper    
    include BlastDbHelper    

end

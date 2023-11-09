Rails.application.routes.draw do
    root 'homes#index'
    resources :searches

    get 'data/get_search/:search_id', to: 'data#get_search'
    get 'data/get_result/:search_id', to: 'data#get_result'
    get 'data/get_tempura/:tempura_id', to: 'data#get_tempura'
    get 'data/get_blastn_result/:blastn_result_id', to: 'data#get_blastn_result'
    get 'data/get_tblastn_result/:tblastn_result_id', to: 'data#get_tblastn_result'
end
  
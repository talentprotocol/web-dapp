Rails.application.routes.draw do
  namespace :api, constraints: {format: :json} do
    namespace :v1 do
      resources :users
    end
  end

  get "investor(/*path)" => "pages#investor", :as => :investor
  get "talent(/*path)" => "pages#talent", :as => :talent
  get "admin(/*path)" => "pages#admin", :as => :admin

  root to: "pages#home", as: :root
end

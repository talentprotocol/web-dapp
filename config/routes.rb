Rails.application.routes.draw do
  # Admin area
  constraints Clearance::Constraints::SignedIn.new { |user| user.admin? } do
    root to: "admin/dashboards#show", as: :admin_root

    namespace :admin do
      resources :dashboards, only: [:show]
      resources :investors
      resources :talent do
        resources :coins, only: [:show, :edit, :update], module: "talent"
        resources :career_goals, only: [:show, :edit, :update], module: "talent"
        resources :rewards, module: "talent"
      end
      resources :wait_list
    end
  end

  # end Admin

  # Auth - Clearance generated routes
  resources :passwords, controller: "clearance/passwords", only: [:create, :new]
  resource :session, controller: "sessions", only: [:create]

  resources :users, controller: "clearance/users", only: [:create] do
    resource :password,
      controller: "clearance/passwords",
      only: [:edit, :update]
  end

  get "/sign_in" => "sessions#new", :as => "sign_in"
  delete "/sign_out" => "sessions#destroy", :as => "sign_out"
  get "/sign_up" => "clearance/users#new", :as => "sign_up"

  # end Auth

  # Business - require log-in
  constraints Clearance::Constraints::SignedIn.new do
    root to: "talent#index", as: :user_root

    # Show investor list (remove?)
    resources :investors, only: [:index, :show]

    # Talent pages & search
    get "/talent/active", to: "talent/searches#active"
    get "/talent/upcoming", to: "talent/searches#upcoming"
    resources :talent, only: [:index, :show]

    # Portfolio
    resources :portfolio, only: [:index, :show]

    # Chat
    resources :messages, only: [:index, :show, :create]
    mount ActionCable.server => "/cable"
  end

  post "/wait_list", to: "pages#wait_list"

  root to: "pages#home", as: :root

  match "*unmatched", to: "application#route_not_found", via: :all
end

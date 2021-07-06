Rails.application.routes.draw do
  # Admin area
  constraints Clearance::Constraints::SignedIn.new { |user| user.admin? } do
    root to: "admin/dashboards#show", as: :admin_root

    namespace :admin do
      resources :dashboards, only: [:show]
      resources :investors
      resources :talent
    end
  end

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

  # Business - require log-in
  constraints Clearance::Constraints::SignedIn.new do
    resources :investors, only: [:index, :show]

    get "/talent/active", to: "talent/searches#active"
    get "/talent/upcoming", to: "talent/searches#upcoming"
    resources :talent, only: [:index, :show]

    resources :messages, only: [:index, :show, :create]
    mount ActionCable.server => "/cable"
  end

  root to: "pages#home", as: :root
end

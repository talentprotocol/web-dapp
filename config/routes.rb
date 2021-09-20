require "sidekiq/web"

Rails.application.routes.draw do
  # Admin area
  constraints Clearance::Constraints::SignedIn.new { |user| user.admin? } do
    root to: "feeds#show", as: :admin_root

    get "/admin", to: "admin/dashboards#show"

    mount Sidekiq::Web => "/sidekiq"

    namespace :admin do
      resources :dashboards, only: [:show]
      resources :investors
      resources :talent do
        resources :tokens, only: [:show, :edit, :update], module: "talent"
        resources :career_goals, only: [:show, :edit, :update], module: "talent"
        resources :rewards, module: "talent"
        resources :tags, module: "talent"
      end
      resources :wait_list
      resources :users
    end
  end
  # end Admin

  # Business - require log-in
  constraints Clearance::Constraints::SignedIn.new do
    root to: "feeds#show", as: :user_root

    # file uploads
    unless Rails.env.test?
      mount Shrine.uppy_s3_multipart(:cache) => "/s3/multipart"
    end

    # Talent pages & search
    get "/talent/active", to: "talent/searches#active"
    get "/talent/upcoming", to: "talent/searches#upcoming"
    resources :talent, only: [:index, :show, :update] do
      resources :rewards, only: [:create, :update, :destroy], module: "talent"
      resources :sponsors, only: [:index], module: "talent"
    end

    # Portfolio
    resource :portfolio, only: [:show] do
      resources :tokens, only: [:show], module: "portfolio"
    end

    # Chat
    resources :messages, only: [:index, :show, :create]
    mount ActionCable.server => "/cable"

    # Profile
    resources :settings, only: [:index, :update]
    resources :investors, only: [:update]

    # Feeds
    resource :feed, only: [:show]
    resources :follows, only: [:index, :create]
    delete "follows", to: "follows#destroy"

    resources :posts, only: [:show, :create, :destroy] do
      resources :comments, only: [:index, :create, :destroy], module: "posts"
    end

    # Swap
    resource :swap, only: [:show]
    resources :transactions, only: [:create]

    namespace :api, defaults: {format: :json} do
      namespace :v1 do
        resources :tokens, only: [:show]
        resources :users, only: [:update]
        resources :notifications, only: [:update]
        resources :career_goals, only: [] do
          resources :goals, only: [:update, :create, :delete], module: "career_goals"
        end
        resources :talent, only: [:update] do
          resources :milestones, only: [:create, :update, :delete], module: "talent"
          resources :perks, only: [:create, :update, :delete], module: "talent"
          resources :services, only: [:create, :update, :delete], module: "talent"
          resources :tokens, only: [:update], module: "talent"
          resources :career_goals, only: [:update, :create], module: "talent"
        end
      end
    end
  end

  # Public routes
  # Auth - Clearance generated routes
  resources :passwords, controller: "clearance/passwords", only: [:create, :new]
  resource :session, controller: "sessions", only: [:create]

  resources :users, only: [:create, :index] do
    resource :password,
      controller: "clearance/passwords",
      only: [:edit, :update]
  end

  get "/sign_up" => "pages#home", :as => :sign_up
  get "/" => "sessions#new", :as => "sign_in"
  delete "/sign_out" => "sessions#destroy", :as => "sign_out"
  get "/confirm_email(/:token)" => "email_confirmations#update", :as => "confirm_email"
  # end Auth

  resources :wait_list, only: [:create, :index]

  root to: "sessions#new", as: :root

  match "*unmatched", to: "application#route_not_found", via: :all
end

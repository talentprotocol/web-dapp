require "sidekiq/web"
require "sidekiq-scheduler/web"

Rails.application.routes.draw do
  # Admin area
  constraints Clearance::Constraints::SignedIn.new { |user| user.admin? } do
    mount Sidekiq::Web => "/sidekiq"
  end
  # end Admin

  # Public API
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      resources :supporters, only: [:index]
      resources :talent, only: [:show]
      get "/public_talent" => "talent#public_index"
      resources :users, only: [:show]
    end
  end
  # end Public API

  # Business - require log-in
  constraints Clearance::Constraints::SignedIn.new do
    root to: "discovery#index", as: :user_root

    # file uploads
    unless Rails.env.test?
      mount Shrine.uppy_s3_multipart(:cache) => "/s3/multipart"
    end

    # Talent pages & search
    resources :talent, only: [:index]
    # Portfolio
    resource :portfolio, only: [:show]

    # Chat
    resources :messages, only: [:index, :show, :create]
    mount ActionCable.server => "/cable"

    # Rewards
    resources :rewards, only: [:index]

    # Feed
    resources :posts, only: [:show, :create, :destroy] do
      resources :comments, only: [:index, :create, :destroy], module: "posts"
    end

    # Edit profile
    get "/u/:username/edit_profile", to: "users#edit_profile"

    namespace :api, defaults: {format: :json} do
      namespace :v1 do
        resources :tokens, only: [:show]
        resources :users, only: [:index, :update, :destroy]
        resources :follows, only: [:index, :create]
        delete "follows", to: "follows#destroy"
        resources :notifications, only: [] do
          put :mark_as_read
        end
        post "clear_notifications", to: "notifications#mark_all_as_read"

        resources :career_goals, only: [] do
          resources :goals, only: [:update, :create, :destroy], module: "career_goals"
        end
        resources :talent, only: [:index, :update] do
          resources :milestones, only: [:create, :update, :destroy], module: "talent"
          resources :perks, only: [:create, :update, :destroy], module: "talent"
          resources :tokens, only: [:update], module: "talent"
          resources :career_goals, only: [:update, :create], module: "talent"
        end
        resources :stakes, only: [:create]
        resources :investor, only: [:update]
        resources :perks, only: [:show]
      end
    end
  end

  # Public routes
  # Auth - Clearance generated routes
  resources :passwords, controller: "passwords", only: [:create, :new]
  resource :session, controller: "sessions", only: [:create]

  resources :users, only: [:create, :index] do
    post :send_confirmation_email
    resource :password,
      controller: "passwords",
      only: [:edit, :update]
  end

  get "/sign_up" => "pages#home", :as => :sign_up
  get "/" => "sessions#new", :as => "sign_in"
  delete "/" => "sessions#new", :as => "sign_in_redirect"
  delete "/sign_out" => "sessions#destroy", :as => "sign_out"
  get "/confirm_email(/:token)" => "email_confirmations#update", :as => "confirm_email"
  # end Auth

  resources :wait_list, only: [:create, :index]

  get "/u/:username" => "users#show", :as => "user"
  # redirect /talent to /u so we have the old route still working
  get "/talent/:username", to: redirect("/u/%{username}")

  root to: "sessions#new", as: :root

  if Rails.env.development?
    mount LetterOpenerWeb::Engine, at: "/letter_opener"
  end

  match "*unmatched", to: "application#route_not_found", via: :all
end

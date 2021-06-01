Rails.application.routes.draw do
  resources :investors, only: [:index, :show]
  resources :talents, only: [:index, :show]

  root to: "pages#home", as: :root
end

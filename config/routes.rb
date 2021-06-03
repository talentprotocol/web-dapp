Rails.application.routes.draw do
  constraints Clearance::Constraints::SignedIn.new { |user| user.admin? } do
    root to: "admin/dashboards#show", as: :admin_root

    namespace :admin do
      resources :dashboards, only: [:show]
      resources :investors
      resources :talents
    end
  end

  resources :investors, only: [:index, :show]
  resources :talents, only: [:index, :show]

  root to: "pages#home", as: :root
end

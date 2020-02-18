Rails.application.routes.draw do
  root to: "home#index"

  devise_for :users, only: [:sessions]
  as :user do
    get 'users/edit' => 'users/registrations#edit', :as => 'edit_user_registration'
    put 'users' => 'users/registrations#update', :as => 'user_registration'
  end

  resources :patients, only: [:index, :new, :create, :show, :edit, :update, :new_group_member]

  resources :admin, only: [:index]

  resources :histories, only: [:create]

  get '/patients/:id/group', to: 'patients#new_group_member'

  resources :patients, param: :submission_token do
    resources :assessments, only: [:create, :new, :index]
  end

  post '/patients/:patient_submission_token/assessments/:id', to: 'assessments#update'

  get '/monitor_dashboard', to: 'monitor_dashboard#index', as: :monitor_dashboard

end

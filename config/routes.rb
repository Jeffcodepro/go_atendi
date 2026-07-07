Rails.application.routes.draw do
  root "pages#home"

  devise_for :users,
             path: "",
             path_names: {
               sign_in: "entrar",
               sign_out: "sair",
               sign_up: "cadastro"
             },
             controllers: {
               omniauth_callbacks: "users/omniauth_callbacks"
             }


  get "privacidade", to: "pages#privacidade", as: :privacidade
  get "termos", to: "pages#termos", as: :termos
  get "cookies", to: "pages#cookies_policy", as: :cookies_policy
  get "lgpd", to: "pages#lgpd", as: :lgpd
  get "exclusao-de-dados", to: "pages#data_deletion", as: :data_deletion

  get "solucoes", to: "solutions#index", as: :solucoes
  get "funcionalidades", to: "features#index", as: :funcionalidades
  get "resultado", to: "results#index", as: :resultado
  get "preco", to: "pricing#index", as: :preco

end

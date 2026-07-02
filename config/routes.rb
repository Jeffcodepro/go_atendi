Rails.application.routes.draw do
  root "pages#home"

  get "privacidade", to: "pages#privacidade", as: :privacidade
  get "termos", to: "pages#termos", as: :termos
  get "cookies", to: "pages#cookies_policy", as: :cookies_policy
  get "lgpd", to: "pages#lgpd", as: :lgpd
  get "exclusao-de-dados", to: "pages#data_deletion", as: :data_deletion

  get "solucoes", to: "solutions#index", as: :solucoes
  get "funcionalidades", to: "features#index", as: :funcionalidades
  get "resultado", to: "results#index", as: :resultado
  get "preco", to: "pricing#index", as: :preco

  get "inscrever-se", to: "leads#new", as: :inscricao
  post "inscrever-se", to: "leads#create"

  get "entrar", to: "access#login", as: :entrar
end

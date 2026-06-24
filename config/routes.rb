Rails.application.routes.draw do
  root "pages#home"

  get "solucoes", to: "solutions#index", as: :solucoes
  get "funcionalidades", to: "features#index", as: :funcionalidades
  get "resultado", to: "results#index", as: :resultado
  get "preco", to: "pricing#index", as: :preco

  get "inscrever-se", to: "leads#new", as: :inscricao
  post "inscrever-se", to: "leads#create"

  get "entrar", to: "access#login", as: :entrar
end

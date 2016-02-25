require 'sinatra'
require "sinatra/reloader" if development?
require 'pagarme'
require 'pry'

ENV['RACK_ENV'] ||= 'development'

get '/' do
  erb :index
end

get '/sucesso' do
  erb :success
end

get '/erro' do
  @status = params["status"]
  erb :unsuccess
end

post '/transactions/new' do

  CARD_HASH = params["card_hash"]
  AMOUNT = params["amount"]

  PagarMe.api_key = ENV['PAGARME_SECRET']

  transaction = PagarMe::Transaction.new({
      :amount => AMOUNT,
      :card_hash => CARD_HASH
  })

  transaction.charge

  status = transaction.status # status da transação

  if status == 'paid' then
    redirect '/sucesso'
  else
    redirect to("/erro?status=#{status}")
  end

end

require 'sinatra'
require 'pagarme'

ENV['RACK_ENV'] ||= 'development'

get '/' do
  erb :index
end

get '/payment_success.erb' do
  erb :payment_success
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

end

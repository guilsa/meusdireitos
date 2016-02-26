require 'pry'

get '/' do
  erb :index
end

get '/sucesso' do
  @status = params["status"]
  erb :success
end

get '/erro' do
  @status = params["status"]
  erb :unsuccess
end

post '/boletotransactions/new' do

  BOLETO_AMOUNT = params["amount"]

  PagarMe.api_key = ENV['PAGARME_SECRET']

  transaction = PagarMe::Transaction.new({
      :amount => BOLETO_AMOUNT,
      :payment_method => "boleto"
  })

  transaction.charge

  boleto_url = transaction.boleto_url # URL do boleto bancário
  boleto_barcode = transaction.boleto_barcode # código de barras do boleto bancário

  status = transaction.status

  if status == 'waiting_payment' then
    redirect to("/sucesso?status=#{status}")
  else
    redirect to("/erro?status=#{status}")
  end

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

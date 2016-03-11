# require 'pry'

get '/pagamento' do
  redirect to("/?pagamento")
end

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

post '/reclamacao' do

  name = params["name"]
  email = params["email"]

  t = Time.now

  Trello.configure do |trello|
    trello.developer_public_key = ENV['TRELLO_CONSUMER_KEY']
    trello.member_token = ENV['TRELLO_CONSUMER_SECRET']
  end

  Trello::Card.create(name: "#{name} (#{t.strftime('%v')}) - #{email}", list_id: '56e26982c47dc355306f9f9d')

  erb :reclamacao_confirmation

end

post '/contact' do
  SENDGRID_APIKEY = ENV['SENDGRID_APIKEY']

  name = params["name"]
  email = params["email"]
  subject = params["subject"]
  message = params["message"]

  client = SendGrid::Client.new(api_key: SENDGRID_APIKEY)

  res = client.send(SendGrid::Mail.new(to: ['guilsa001@gmail.com', 'bpascowitch@gmail.com'],
                                       from: email,
                                       subject: subject,
                                       text: message))

  erb :duvida_confirmation
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
    redirect to("/sucesso?status=#{status}")
  else
    redirect to("/erro?status=#{status}")
  end

end

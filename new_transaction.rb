require 'sinatra'
require 'pry'

get '/' do
  erb :index
end


get '/transactions/new' do
  binding.pry
end

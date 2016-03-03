# Require the necessary libraries.
require 'rubygems'
require 'sinatra'
require 'pagarme'
if development? then
  require "sinatra/reloader"
  require 'dotenv'
  Dotenv.load
end
require 'sendgrid-ruby'

# add controllers and views
configure do
  root = File.expand_path(File.dirname(__FILE__))
  set :views, File.join(root, 'views')
end

# Set the not found page for URIs that don't match to any specified route.
not_found do
  status 404
  erb :not_found
end

# Load the controllers.
Dir["controllers/*.rb"].each { |file| load file }

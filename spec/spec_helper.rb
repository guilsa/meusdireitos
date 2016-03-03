
ENV["BUNDLE_GEMFILE"] = File.expand_path("../../Gemfile", __FILE__)
require 'bundler/setup'
require 'capybara/rspec'
Bundler.require

Capybara.default_driver = :selenium

# Capybara.ignore_hidden_elements = true

# Capybara.configure do |config|
#   config.default_max_wait_time = 2
# end

# Capybara.register_driver :selenium do |app|
#   Capybara::Selenium::Driver.new(app, :browser => :chrome)
# end

# Capybara.current_driver = :selenium

RSpec.configure do |config|
  # config.expect_with :rspec do |expectations|
  #   expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  # end
  #
  # config.mock_with :rspec do |mocks|
  #   mocks.verify_partial_doubles = true
  # end

end

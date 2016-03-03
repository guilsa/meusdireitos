require 'pry'

describe 'pay button', type: :feature do

  before do
    Capybara.app_host = 'http://localhost:5000'
  end

  it 'should exist' do
    visit '/'
    expect(page.find_by_id('btn-pagar'))
  end

  # it 'should show error when clicked if textbox is invalid' do
  #   http://stackoverflow.com/questions/2458632/how-to-test-a-confirm-dialog-with-cucumber
  #   visit '/'
  #   page.find('#btn-pagar').click
  #   expect(page.find('#alert_placeholder'))
  # end

  it 'should show the select payment modal upon click' do
    visit '/#privacidade'
    fill_in 'input-pagar', with: '50'
    execute_script("scroll(0, 3300)")
    page.find('#btn-pagar').click
    expect(page.find('.modal-content').visible?)
  end
end

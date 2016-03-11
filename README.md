# Dependecies

* Install Ruby + Heroku toolbelt

# Run locally

* `bundle install`
* `heroku git:remote -a meusdireitos` (need to be a collaborator on Heroku for this)

To import all environment variables from Heroku (copy Heroku's config vars to a local .env file):

* `heroku config:get PAGARME_SECRET -s  >> .env`
* `heroku config:get SENDGRID_APIKEY -s  >> .env`
* `heroku config:get TRELLO -s  >> .env`

Start server:

* `ruby init.rb -p 5000`
*  open browser to http://localhost:5000

# Run automated test

* `rspec`

# Missing edge cases

* `col-sm` grid layout needs fixing.
* Should we restrict to a claims worth at least $100? Because payment amount currently does not support cents. Ex: If user types 10, it'll return 1, not 1.50.
* JS optimization - some non-minimized .js and .css files have been referenced, need to recompile and reference.
* On mobile payment success page the html background image doesn't cover 100% of the bg.

# Dependecies

* Install Ruby + Heroku toolbelt

# Run locally

* `bundle install`
* `heroku git:remote -a meusdireitos` (need to be a collaborator on heroku for this)
* `heroku config:get CONFIG-VAR-NAME -s  >> .env` (where CONFIG-VAR-NAME are environment vars from Heroku; this will copy Heroku's config vars to your local .env file)
* `ruby init.rb -p 5000`
*  open browser to http://localhost:5000

# Missing edge cases

* Should we restrict to a claims worth at least $100? Because payment amount currently does not support cents. Ex: If user types 10, it'll return 1, not 1.50.
* Some non-minimized .js and .css files have been referenced, need to recompile and reference.
* On mobile payment success page the html background image doesn't cover 100% of the bg.

# UX improvements

* Payment flow: Ajaxify payment success/error messages so that they happen from a follow up modal.

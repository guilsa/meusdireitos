# Dependecies

* Install Ruby + Heroku toolbelt

# Run locally

* `bundle install`
* `heroku git:remote -a meusdireitos` (need to be a collaborator on heroku for this)
* `ruby init.rb -p 5000`
*  open browser to http://localhost:5000

# Missing edge cases

* Should we restrict to a claims worth at least $100? Because payment amount currently does not support cents. Ex: If user types 10, it'll return 1, not 1.50.
* Some non-minimized .js and .css files have been referenced, need to recompile and reference.
* On mobile payment success page the html background image doesn't cover 100% of the bg.

# UX improvements

* Payment flow: Ajaxify it so that everything (payment type, payment, success/error) happens in a single page inside a modal.

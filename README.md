# Dependecies

* Install Ruby + Heroku toolbelt

# Run locally

* `bundle install`
* `heroku git:remote -a meusdireitos` (need to be a collaborator on heroku for this)
*  download your heroku environment variables following instructions from [heroku-config](https://github.com/ddollar/heroku-config) all the way to step `heroku config:pull`
* `heroku local`
*  then go to your browser and open http://localhost:5000

# Missing edge cases

* Should we restrict to a claims worth at least $100? Because payment amount currently does not support cents. Ex: If user types 10, it'll return 1, not 1.50.

var players = require('../models/playersSchema.js');

var auth = function(req,res,next){
  if(req.url == '/login' || req.url == '/register'){
    if(req.session.user == 'undefined' || req.session.user == undefined){
      return next();
    } else{
      res.redirect('/menu');
    }
  } else {
    if(req.session.user != 'undefined' && req.session.user != undefined){
      return next();
    } else{
      res.redirect('/login');
    }
  }
}

module.exports = auth;

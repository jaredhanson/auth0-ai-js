var express = require('express');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer');
var auth0AI = require('@auth0/ai');

// `@auth0/ai` can add human-in-the-loop orchestration to agents written in any
// framework.  Uncomment the example agent written in your preferred framework
// to host it as a stateless HTTP-driven agent using CIBA to obtain
// authorization.
//var agent = require('../../agent-llamaindex');
// -- OR --
var agent = require('../../agent-genkit');



const store = new auth0AI.FSStateStore('.');

const authorizer = new auth0AI.NotificationCIBAAuthorizer({
  authorizationURL: 'http://localhost:8080/oauth2/bc-authorize',
  clientId: process.env['CLIENT_ID'],
  clientSecret: process.env['CLIENT_SECRET'],
  store: store
});

const interactivePrompt = auth0AI.interact(agent.prompt, authorizer);


var router = express.Router();

router.post('/',
  function(req, res, next) {
    const user = {
      id: 'auth0|672d15e3a67830e930d6679b'
    }
  
    interactivePrompt({ user: user }, req.body.message)
      .then(function(result) {
        console.log(result)
      
        return res.json({ message: result.message.content })
      })
      .catch(function(error) {
        console.log('ERRROR')
        console.log(error)
      })
  });

var notificationStrategy = new BearerStrategy(function(token, cb) {
  console.log('AUTH NOTIFICATION');
  console.log(token);
  
  store.get(token)
    .then(function(data) {
      console.log(data);
      
      
      cb(null, true, data);
      
    })
    .catch(cb);
});

router.post('/cb',
  passport.authenticate(notificationStrategy, { session: false }),
  function validateAuthReqIdBinding(req, res, next) {
    if (req.authInfo.authReqId !== req.body.auth_req_id) {
      // TODO: make it an http 402 error
      return next(new Error('invalid auth req id binding'));
    }
    next();
  },
  function(req, res, next) {
    console.log('GOT NOTIFICATION CALLBACK');
    console.log(req.headers)
    console.log(req.body)
    console.log(req.user);
    console.log(req.authInfo);
  })

module.exports = router;

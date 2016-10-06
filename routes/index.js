var express = require('express');
var redis = require('redis');
var router = express.Router();
var client = redis.createClient(process.env.REDIS_URL);

client.on("error", function (err) {
  console.log("Redis error", err);
});

router.get('/', function(req, res) {
  res.render('index');
});

router.post('/save', function (req, res) {
  var randomId = Math.random().toString(36).substr(2, 8);
  var content = {
    name: req.body.name,
    text: req.body.text
  };

  if (content.name && content.text) {
    client.set(randomId, JSON.stringify(content), redis.print);
  }

  res.json({id: randomId});
});

router.get('/:id', function (req, res) {
  var id = req.params.id;
  client.get(id, function (err, contentString) {
    var content = {};
    if (!err && contentString) {
      try {
        content = JSON.parse(contentString);
      } catch (error) {
        console.log('Parse error', error);
      }
    }
    res.render('text', {
      content: content
    });
  });
});

module.exports = router;

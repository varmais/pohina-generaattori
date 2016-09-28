var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var sentences = require('./sentences');
var router = express.Router();

const URL = 'http://digitalistnetwork.com/profiles/';
const selector = '.entry-summary';

router.get('/random', function(req, res) {
  var entries = [];
  for (let i = 0; i < 4; i++) {
    let randomKey = Math.floor(Math.random() * sentences.length);
    entries.push(sentences[randomKey]);
  }
  res.json({text: entries.join(' ')});
});

router.get('/texts', function (req, res) {
  request(URL, function (error, body, html) {
    var $ = cheerio.load(html);

    var allEntries = $(selector)
      .text()
      .replace(/\s\s+/g, ' ')
      .replace('...', '.')
      .split('. ')
      .map((text) => text.trim() + '.');

    res.json(allEntries);
  });
});

module.exports = router;

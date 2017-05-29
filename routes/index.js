var express = require('express');
var router = express.Router();
var request = require('request');
var winston = require('winston');
//var himalaya = require('himalaya')
const cheerio = require('cheerio');
const Horseman = require('node-horseman');

/* GET home page. */
router.get('/', function(req, res, next) {

  const pages = [0,1,2,3,4,5,6]; //list of page we want to parse
  const articles = []; //put all the article info in

  console.log('start webscraping');

  var scrap = function(_count, _pages, _articles){
    console.log('webscraping an other page');
    var url = "http://www.welcometothejungle.co/stacks?q=&hPP=30&idx=cms_companies_stacks_production&p=";
    var count = _count;
    var pages = _pages;
    var articles = _articles;

    if(count >= pages.length){
      console.log('nb pages = '+ articles.length);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(articles, null, 3));
    }else{
      console.log("scrapping pages:" + count);
      var page = pages[count];
      const horseman = new Horseman();

      horseman
          .on('error', console.error)
          .open(url + '' + page)
          .evaluate(function() {
            try{
              var articlesData = [];
              $('article').each(function(index, element){
                 var article = {}; // all the data of this article

                 var stackF = [];
                 $(this).find('div[class=company-stack-category]').each(function(i, elem) {
                   var obj = {}; //one stack categorie
                   var stacks = []; //list of item in the aimed stack
                   obj.stackName = $(this).children('.category-title').text(); //name of the stakc
                   $(this).children('.company-stack-list').children('.stack-item').each(function(c, elem) {
                     if($(this).text().indexOf('+')==-1){
                       stacks[c] = $(this).text().replace(/\s+/g, ''); //one stack element
                     }
                   });
                   obj.stackValue = stacks;
                   stackF.push(obj);
                 });
                 article.stacks = stackF;

                 var t = $(this).find('h4[class=company-name]').text().replace(/\s+/g, '').replace(/\d+/g, '');
                 var tRes = t.substr(0, t.length-4);
                 article.title = tRes;

                 articlesData.push(article);
               });
               return articlesData;
            }catch (err) {
                return [err];
            }
          })
          .then(article => {
            console.log('ending scraping pages');
            articles.push(article);
            scrap(++count, pages, articles);
          })
          .close();
    }
  }

  scrap(0,pages,articles);

});

router.get('/stats', function(req, res, next) {
  res.render('stats', {

  });
});

router.get('/light', function(req, res, next) {

  const pages = [0]; //list of page we want to parse
  const articles = []; //put all the article info in

  console.log('start webscraping');

  var scrap = function(_count, _pages, _articles){
    console.log('webscraping an other page');
    var url = "http://www.welcometothejungle.co/stacks?q=&hPP=30&idx=cms_companies_stacks_production&p=";
    var count = _count;
    var pages = _pages;
    var articles = _articles;

    if(count >= pages.length){
      console.log('nb pages = '+ articles.length);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(articles, null, 3));
    }else{
      console.log("scrapping pages:" + count);
      var page = pages[count];
      const horseman = new Horseman();

      horseman
          .on('error', console.error)
          .open(url + '' + page)
          .evaluate(function() {
            try{
              var articlesData = [];
              $('article').each(function(index, element){
                 var article = {};
                 var stackF = [];

                 $(this).find('div[class=company-stack-category]').each(function(i, elem) {
                   $(this).children('.company-stack-list').children('.stack-item').each(function(c, elem) {
                     if($(this).text().indexOf('+')==-1){
                       stackF.push($(this).text().replace(/\s+/g, '')); //one stack element
                     }
                   });
                 });
                 article.stacks = stackF;

                 var t = $(this).find('h4[class=company-name]').text().replace(/\s+/g, '').replace(/\d+/g, '');
                 var tRes = t.substr(0, t.length-4);
                 article.title = tRes;

                 articlesData.push(article);
               });
               return articlesData;
            }catch (err) {
                return [err];
            }
          })
          .then(article => {
            console.log('ending scraping pages');
            articles.push(article);
            scrap(++count, pages, articles);
          })
          .close();
    }
  }

  scrap(0,pages,articles);

});

module.exports = router;

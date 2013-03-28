var request = require('request'),
    cheerio = require('cheerio'),
    querystring = require('querystring'),
    util = require('util');


var linkSel = 'h3.r',
    itemSel = 'li.g',
    nextSel = 'td.b a span';

var URL = 'http://www.google.com/search?hl=en&q=%s&start=%s&sa=N&num=%s';

function myGoogle(query, startSearch, callback) {
    
    igoogle(query, startSearch, callback);
}

myGoogle.resultsPerPage;
myGoogle.experiment;
myGoogle.startIndicator;

var igoogle = function(query, start, callback) {
    
    
    var newUrl = util.format(URL, querystring.escape(query), start, myGoogle.resultsPerPage);
    request(newUrl, function(err, resp, body) {
        if ((err === null) && resp.statusCode === 200) {
            var $ = cheerio.load(body),
                links = [];


            $(itemSel).each(function(i, elem) {
                var linkElem="",
                qsObj,
                tagName = $(elem).children().first()['0']['name'],
                    item = {
                        experiment: null,
                        searchItem: query,
                        url: null,
                        html: null
                    };
                item.experiment = myGoogle.experiment;
                
                
                
             if(tagName === "h3") linkElem = $(elem).children(linkSel).first().children('a');
             else if(tagName === 'table') {
                 linkElem= $(elem).children().children().children().children(linkSel).children('a');
                 if(!$(linkElem).attr('href')){
                    linkElem="";
                 }
             }
             
             if (linkElem !== "") {

                 qsObj = querystring.parse($(linkElem).attr('href'));
                 if (qsObj['/url?q']) {
                     qsObj = qsObj['/url?q']
                     console.log(qsObj);

                     item.url = qsObj;
                     links.push(item);
                 }

             }
  
            });

            var nextFunc = null;
            if ($(nextSel).last().text() === 'Next') {
                nextFunc = function() {
                    igoogle(query, start + myGoogle.startIndicator, callback);
                }
            }

            callback(null, nextFunc, links);
        }
        else {
            callback(new Error('Error on response.'), null, null);
        }
    });
}

module.exports = myGoogle;

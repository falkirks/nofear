'use strict';
var merge = require('merge');
var redis = require("redis");
var vsprintf = require("sprintf-js").vsprintf;
var request = require("request");
var cheerio = require("cheerio");
var _ = require('underscore');

var NoFear = function (options) {
    this.options = merge({
        useRedis: false,
        endPoints: {
            playList: "http://nfs.sparknotes.com",
            toc: "http://nfs.sparknotes.com/%s/",
            characters: "http://nfs.sparknotes.com/%s/characters.html",
            page: "http://nfs.sparknotes.com/%s/page_%u.html"
        },
        debug: false
    }, options);
    if(this.options.useRedis){
        this.redisClient = redis.createClient();
        this.redisClient.on("error", function (err) {
            console.log("Error " + err);
        });
        console.log("--- Redis is not yet supported ---");
    }
    this.playList = null;
};
NoFear.prototype.getEndpoint = function(name, data, callback){
  //console.log(name);
  //console.log(data);
    if(this.options.endPoints[name] == null){
        callback("Bad endpoint name", null);
    }
    else{
      request({uri: vsprintf(this.options.endPoints[name], data)},
        function(error, response, body) {
          if (error != null) {
            callback("Request error", null);
          }
          else {
            var $ = cheerio.load(body);
            callback(null, $);
          }
      });
    }
  return this;
};
NoFear.prototype.find = function(quote, locator, callback){
  //TODO
  console.log(callback + locator + quote); // For jshint
};
NoFear.prototype.findQuoteOnPage = function(quote, play, page, callback){
    this.getPage(play, page, (function(er, lines){
      if(er != null){
        callback(true, null);
        return;
      }
      var out = [];
      for(var i = 0; i < lines.length; i++){
        if(lines[i].original.indexOf(quote) !== -1){
          out.push(lines[i]);
        }
      }
      if(out.length === 0){
        callback(true, null);
      }
      else{
        callback(null, out);
      }
    }).bind(this));
    return this;
};
NoFear.prototype.nextScene = function(playObject, act, scene){
  if(scene < playObject[act].length){
    return [act, scene++];
  }
};
NoFear.prototype.findQuoteInScene = function(quote, play, act, scene, callback){
  this.getPlay(play, (function(er, play) {
    if (er != null || play.toc[act][scene] == null) {
      callback(true, null);
      return;
    }
    var fromTo = play.toc[act][scene];
    var finished = _.after(((fromTo[1]-fromTo[0])/2)+1, (function(){
      if(out.length > 0){
        callback(null, out);
      }
      else{
        callback(true, null);
      }
    }).bind(this));
    var out = [];
    var func = (function(er, lines){
      if(lines != null){
        out = out.concat(lines);
      }
      finished();
    }).bind(this);
    for (var i = parseInt(fromTo[0]); i <= fromTo[1]; i += 2) {
      this.findQuoteOnPage(quote, play.linkName, i, func);
    }
  }).bind(this));
  return this;
};
NoFear.prototype.findQuoteInAct = function(quote, play, acty, callback){ //FIXME "act" doesn't work
  this.getPlay(play, (function(er, play){
    if(er != null || play.toc[acty] == null) {
      callback(true, null);
      return;
    }
    var act = play.toc[acty];
    var out = [];
    var props = 0;
    for(var prop in act) {
      if (act.hasOwnProperty(prop)) {
        props++;
      }
    }
    var finished = _.after(props, (function(){
      if(out.length > 0){
        callback(null, out);
      }
      else{
        callback(true, null);
      }
    }).bind(this));
    var func = (function(er, lines){
      if(lines != null){
        out = out.concat(lines);
      }
      finished();
    }).bind(this);
    for(var sceneId in act){
      if(act.hasOwnProperty(sceneId)){
        this.findQuoteInScene(quote, play.linkName, acty, sceneId, func);
      }
    }
  }).bind(this));
  return this;
};
NoFear.prototype.findQuoteInPlay = function(quote, play, callback){
  this.getPlay(play, (function(er, play){
    if(er != null || play.toc == null) {
      callback(true, null);
      return;
    }
    var out = [];
    var props = 0;
    for(var prop in play.toc) {
      if (play.toc.hasOwnProperty(prop)) {
        props++;
      }
    }
    var finished = _.after(props, (function(){
      if(out.length > 0){
        callback(null, out);
      }
      else{
        callback(true, null);
      }
    }).bind(this));
    var func = (function(er, lines){
      if(lines != null){
        out = out.concat(lines);
      }
      finished();
    }).bind(this);
    for(var actId in play.toc){
      if(play.toc.hasOwnProperty(actId)){
        this.findQuoteInAct(quote, play.linkName, actId, func);
      }
    }
  }).bind(this));
  return this;
};
NoFear.prototype.findQuote = function(quote, callback){
    //TODO
    console.log(quote + callback); //For jshint
};
NoFear.prototype.getPage = function(play, id, callback){
  this.getPlay(play, (function(er, play){ //FIXME this is overkill: only one request is needed
    if(er != null){
      callback(true, null);
    }
    else{
      this.getEndpoint('page', [play.linkName, id], (function(er, $){
        if(er != null){
          callback(true, null);
        }
        var items = $("#noFear-comparison tr").get();
        if(items.length > 0) {
          var lines = [];
          for (var i = 0; i < items.length; i++) {
            lines.push({
              original: $(items[i]).find(".original-line").text(),
              modern: $(items[i]).find(".modern-line").text()
            });
          }
          callback(null, lines);
        }
        else{
          callback(true, null);
        }
      }).bind(this));
    }
  }).bind(this));
  return this;
};
NoFear.prototype.getPlay = function(name, callback){
    this.getAvailablePlays((function(er, playList){
      var play = null;
      var playKey = null;
      if(playList[name] != null){
        play = playList[name];
        playKey = name;
      }
      else{
        for (var key in playList) {
          if (playList.hasOwnProperty(key)) {
            if(name === playList[key].linkName){
              play = playList[key];
              playKey = key;
              break;
            }
          }
        }
      }

      if(play != null){
        if(play.toc != null){
          callback(null, play);
        }
        else {
          this.getEndpoint("toc", [play.linkName], (function (er, $) {
            if (er != null){
              callback(true, null);
            }
            else {
              var results = $("a").get();
              play.toc = {};
              var previous = null;
              var id = "";
              for (var i = 0; i < results.length - 1; i++) { // The last link is garbage
                var link = $(results[i]);
                if (link.attr("href") != null && link.attr("href").indexOf("page_") !== -1) {
                  var actScene = link.text().split(", ");
                  if (actScene.length === 2) {
                    actScene[0] = actScene[0].slice(actScene[0].length - 1);
                    if (actScene[1].indexOf("Scene") !== -1) {
                      actScene[1] = actScene[1].slice(actScene[1].length - 1);
                    }
                    if (play.toc[actScene[0]] == null){
                      play.toc[actScene[0]] = {};
                    }
                    id = link.attr("href").slice(link.attr("href").indexOf("_") + 1, -5);
                    play.toc[actScene[0]][actScene[1]] = [id];
                    if(previous != null){
                      play.toc[previous[0]][previous[1]].push(id-2);
                    }
                    previous = actScene;
                  }
                }
              }
              this.getEndpoint('page', [play.linkName, id], (function(er, $){
                var items = $(".dropdownMenu option").get();
                play.toc[previous[0]][previous[1]].push($(items[items.length-2]).attr('value').slice($(items[items.length-2]).attr("value").indexOf("_") + 1, -5));
                play.loaded = true;
                this.playList[playKey] = play;
                callback(null, play);
              }).bind(this));
            }
          }).bind(this));
        }
      }
      else{
        callback(true, null);
      }
    }).bind(this));
  return this;
};

NoFear.prototype.getAvailablePlays = function (callback) {
  if(this.playList != null){
    callback(null, this.playList);
    return this;
  }
  this.getEndpoint('playList', [], (function(er, $){
      if(er != null){
        callback(true, null);
      }
      else{
        this.playList = {};
        var results = $(".entry > p > a").get();
        for(var i = 0; i < results.length - 1; i++){ // The last link is garbage
          var link = $(results[i]);
          this.playList[link.text()] = {
            linkName: link.attr("href").slice(0, -1),
            loaded: false,
            ensureLoaded: (function(play){
              this.getPlay(play, function(){});
            }).bind(this, link.text())
          };
        }
      }
      callback(null, this.playList);
  }).bind(this));
  return this;
};
//(new NoFear()).findQuoteInPlay("a muse of fire", "Henry V", function(er, play){
//  console.log("CALL");
//  console.log(play);
//});
module.exports = NoFear;

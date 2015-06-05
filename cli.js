#!/usr/bin/env node
'use strict';
var meow = require('meow');
var NoFear = require('./');
var nofear = new NoFear();
var Table = require('cli-table');
var wrap = require('wordwrap')(35);

var cli = meow({
  help: [
    'Usage',
    '  nofear "quote"',
    '--play   Specify a play to restrict serch to.',
    '--act    Specify an act to search.',
    '--scene  Specify a scene to confine search to.',
    '--at     Use a locator tag to find data. More details by running `nofear --locator`',
    '--debug  Enable verbose debugging output',
    '--list   List all available plays',
    '',
    'Example',
    '  nofear Unicorn'
  ].join('\n')
});
if(cli.flags.list != null){
  nofear.getAvailablePlays(function(er, data){
    if(er != null){
      console.log("Error occurred while fetching list.");
    }
    else {
      var table = new Table({
        head: ['Name']
        , colWidths: [35]
      });
      for(var key in data){
        if(data.hasOwnProperty(key)){
          table.push([key]);
        }
      }
      console.log(table.toString());
    }
  });

}
else{
  if(cli.input.length > 0) {
    cli.input[0] = cli.input[0].replace("\\", "");
    if (cli.flags.play != null) {
      if (cli.flags.act != null) {
        if (cli.flags.scene != null) {
          nofear.findQuoteInScene(cli.input[0], cli.flags.play, cli.flags.act, cli.flags.scene, function(er, data){
            if(er != null){
              console.log("Error occurred while fetching quote.");
            }
            else{
              var table = new Table({
                head: ['Original', 'Modern']
                , colWidths: [50, 50]
              });
              for(var i = 0; i < data.length; i++){
                table.push([wrap(data[i].text.original), wrap(data[i].text.modern)]);
              }
              console.log(table.toString());
            }
          });
        }
        else {
          nofear.findQuoteInAct(cli.input[0], cli.flags.play, cli.flags.act, function(er, data){
            if(er != null){
              console.log("Error occurred while fetching quote.");
            }
            else{
              var table = new Table({
                head: ['Original', 'Modern']
                , colWidths: [50, 50]
              });
              for(var i = 0; i < data.length; i++){
                table.push([wrap(data[i].text.original), wrap(data[i].text.modern)]);
              }
              console.log(table.toString());
            }
          });
        }
      }
      else {
        console.log(cli.input[0]);
        nofear.findQuoteInPlay(cli.input[0], cli.flags.play, function(er, data){
          if(er != null){
            console.log("Error occurred while fetching quote.");
          }
          else{
            var table = new Table({
              head: ['Original', 'Modern']
              , colWidths: [50, 50]
            });
            for(var i = 0; i < data.length; i++){
              table.push([wrap(data[i].text.original), wrap(data[i].text.modern)]);
            }
            console.log(table.toString());
          }
        });
      }
    }
    else {
      nofear.find(cli.input[0], function(er, data){
        if(er != null){
          console.log("Error occurred while fetching quote.");
        }
        else{
          var table = new Table({
            head: ['Original', 'Modern']
            , colWidths: [50, 50]
          });
          for(var i = 0; i < data.length; i++){
            table.push([wrap(data[i].text.original), wrap(data[i].text.modern)]);
          }
          console.log(table.toString());
        }
      });
    }
  }
  else{
    cli.showHelp();
  }
}

#!/usr/bin/env node
'use strict';
var meow = require('meow');
//var nofear = require('./');

var cli = meow({
  help: [
    'Usage',
    '  nofear "quote"',
    '--play   Specify a play to restrict serch to.',
    '--act    Specify an act to search.',
    '--scene  Specify a scene to confine search to.',
    '--at     Use a locator tag to find data. More details by running `nofear --locator`',
    '--debug  Enable verbose debugging output',
    '--toes   Experimental: Run in toes mode (rate-limited access and caching)',
    '--list   List all available plays',
    '',
    'Example',
    '  nofear Unicorn'
  ].join('\n')
});
if(cli.flags.locator != null){
  console.log("--- LOCATOR INFO HERE ---");
}
else{

}

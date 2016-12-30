/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('extentions.module');
 * mod.thing == 'a thing'; // true
 */
// Load global settings from our first spawn.
var spawns = _.filter(Game.spawns);
var spawn = spawns[0];

var extentions = {
}

module.exports = extentions;
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
    fn_build_roads: function() {
        // Load all our rooms.
        for(var room_it in Game.rooms) {
            // Check if controller is upgraded to a minimum level.
            if (Game.rooms[room_it].controller.level > 1) {
                // Check if energy level is over the minimum requirements.
                if (Game.rooms[room_it].controller.progress > spawn.memory.settings.build_roads_on) {
                    // Get all structures in the room.
                    // Connect all structures.
                }
            }
        }
    }
}

module.exports = extentions;
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('routines');
 * mod.thing == 'a thing'; // true
 */
var routines = {
    settings: {
        sources: {},
        units: {
            harvester: {
                needed: 8,
                build_on: 1,
            },
            upgrader: {
                needed: 8,
                build_on: 1,
            },
            builder: {
                needed: 6,
                build_on: 1,
            },
            scout: {
                needed: 1,
                build_on: 1,
            },
        },
        constructions: {},
        settings: {
          build_roads_on: 1,  
        },
    },
    fn_unit_settings_to_memory: function(){
        // Save settings to game memory.
        var spawns = _.filter(Game.spawns);
        for (var index_spawns in spawns) { 
            var spawn = spawns[index_spawns];
            spawn.memory.units = this.settings.units;
            if (!spawn.memory.units) {
                spawn.memory = this.settings;
            }
        }
    },
}
module.exports = routines;
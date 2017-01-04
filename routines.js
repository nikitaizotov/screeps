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
                needed: 5,
                build_on: 1,
            },
            upgrader: {
                needed: 0,
                build_on: 1,
            },
            builder: {
                needed: 0,
                build_on: 1,
            },
            scout: {
                needed: 0,
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
            this.fn_remove_road_sites(spawn);
            spawn.memory.units = this.settings.units;
            if (!spawn.memory.units) {
                spawn.memory = this.settings;
            }
        }
    },
    fn_remove_road_sites: function(spawn) {
        // var csites = spawn.room.find(FIND_CONSTRUCTION_SITES);
        // for (var csite_i in csites) {
        //     if (csites[csite_i].structureType == 'road') {
        //         csites[csite_i].remove();
        //     }
        // }
    }
}
module.exports = routines;
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('cleaner');
 * mod.thing == 'a thing'; // true
 */
var cleaner = {
    fn_clean_creeps: function() {
        // Clean not existed creeps.
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    fn_clean_sources: function () {
        var spawns = _.filter(Game.spawns);
        for (var index_spawns in spawns) {
            var room = spawns[index_spawns].room;
                        if (room) {
                if (room.memory.sources) {
                    for (var s_indx in room.memory.sources) {
                        var source_list = room.memory.sources[s_indx];
                        for (var screep_i in source_list) {
                            var creep_name = source_list[screep_i];
                            if(!Game.creeps[creep_name]) {
                                room.memory.sources[s_indx].splice(screep_i,1);
                            }
                        }
                    }
                }
                for (var room_connected in room.memory.connected) {
                    for (var sid in room.memory.connected[room_connected].sources) {
                        for (var i in room.memory.connected[room_connected].sources[sid]) {
                            var creep_name = room.memory.connected[room_connected].sources[sid][i];
                            if(!Game.creeps[creep_name]) {
                                room.memory.connected[room_connected].sources[sid].splice(screep_i,1);
                            }
                        }
                    }
                }
            }
        }
    }
}
module.exports = cleaner;
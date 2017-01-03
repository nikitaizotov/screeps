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
        // Clean rooms.
        // var rooms = _.filter(Game.rooms);
        // for (var index in rooms) {
        //     var room = rooms[index];
        //     if (room.memory.sources) {
        //         for (var s_indx in room.memory.sources) {
        //             var source_list = room.memory.sources[s_indx];
        //             for (var screep_i in source_list) {
        //                 var creep_name = source_list[screep_i];
        //                 if(!Game.creeps[creep_name]) {
        //                     room.memory.sources[s_indx].splice(screep_i,1);
        //                 }
        //             }
        //         }
        //     }
        // }
    }
}
module.exports = cleaner;
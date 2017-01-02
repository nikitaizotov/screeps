/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scout');
 * mod.thing == 'a thing'; // true
 */
var scout = {
    // Function will get all neigbour rooms.
    fn_get_avail_rooms: function(creep) {
        // Get current room name.
        var current_room = creep.room.name;
        // Get all availible exits from this room
        var current_room_connecions = Game.map.describeExits(current_room);
        
        for(var room_i in current_room_connecions) {
            console.log(current_room_connecions[room_i])
        }
        
        // Check if room is discovered already.
        //if (Game.memory.rooms[])
        //console.log(current_room)
    },
    run: function(creep) {
        this.fn_get_avail_rooms(creep);
    }
}

module.exports = scout;
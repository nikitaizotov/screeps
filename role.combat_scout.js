/*
 * Memory:
 *	creep.memory.room
 *	creep.memory.target_room
 */
var roleCombatScout = {
    run: function(creep) {
    	this.fn_collect_info(creep);
    	this.fn_run_somewhere(creep);
    },
    fn_run_somewhere: function(creep) {
    	if (creep.room.name == creep.memory.target_room || creep.memory.target_room == '') {
    		// Get current room name.
	        var current_room = creep.room.name;
	        // Get all availible exits from this room
	        var current_room_connecions = Game.map.describeExits(current_room);
	        var exit_i = parseInt(Math.random() * (current_room_connecions.length - 0) + 0);
	        creep.memory.target_room = current_room_connecions[this.fn_rand_key(current_room_connecions)];

    	}
    	else {
    		var route = Game.map.findRoute(creep.room.name, creep.memory.target_room);
            var exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit);
    	}
    },
    fn_rand_key: function(obj) {
    	var result;
	    var count = 0;
	    for (var prop in obj)
	        if (Math.random() < 1/++count)
	           result = prop;
	    return result;
    },
    fn_collect_info: function(creep) {
    	if (creep.room.name != creep.memory.room) {
			var room = Game.rooms[creep.memory.room];
			if (!room.memory.military) {
				room.memory.military = {};
			}
			
			var host_spawns = creep.room.find(FIND_HOSTILE_SPAWNS);
			var host_struct = creep.room.find(FIND_HOSTILE_STRUCTURES);
            var host_units = creep.room.find(FIND_HOSTILE_CREEPS);

            if (host_spawns.length > 0 || host_units.length > 0 || host_struct.length > 0) {
            	var waves = 0;
	            if (!room.memory.military[creep.room.name]) {
					room.memory.military[creep.room.name] = {};
				}
				if (room.memory.military[creep.room.name].waves) {
					waves = room.memory.military[creep.room.name].waves;
				}
				room.memory.military[creep.room.name] = {
						units: host_units.length,
						structures: host_struct.length,
						spawn: host_spawns.length,
						waves: waves,
					};
			}
			else {
				delete room.memory.military[creep.room.name];
			}
		}
    },
}

module.exports = roleCombatScout;
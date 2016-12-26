var creepRoleController = require('role.controller');
var spawns = _.filter(Game.spawns);
var spawn = spawns[0];

if (!spawn.memory.sources) {
    spawn.memory.sources = {};
}

// Clean spurces.
for (var sid in spawn.memory.sources) {
    for (var n in spawn.memory.sources[sid]) {
        var creep_name = spawn.memory.sources[sid][n];
        var flag_found = false;
        for(var name in Memory.creeps) {
            if (creep_name == name) {
                flag_found = true;
            }
        }
        if (flag_found == false) {
            delete spawn.memory.sources[sid].splice(n,1);
        }
    }
}

var roleUpgrader = {
    sources: spawn.memory.sources,
    // Check if creep is in the given souce list.
    // Will return true if found or false.
    check_creep_sources: function(creep_name, sid) {
        if (spawn.memory.sources[sid]) {
            var list = spawn.memory.sources[sid];
            // Run over the elements and search for a name.
            for (var index in list) {
               if (list[index] == creep_name) {
                   return true;
               }
            }
        }
        return false;
    },
    interact_with_source: function(creep) {
        // If creep is having something inside of tid - he have his source.
        if (creep.memory.tid == '') {
            // Load sources.
            var found_sources = creep.room.find(FIND_SOURCES);
            var sid = '';
            // Run over the sources and find something for our creep.
            for (var s_index in found_sources) {
                var source = found_sources[s_index];
                var sid = source.id;
                // Check for a user in that source list.
                if(this.check_creep_sources(creep.name, sid) === false) {
                    // In this case creep is not in the list.
                    // At first we need to check if that list even exists.
                    if (spawn.memory.sources[sid]) {
                        // In this case list is exists, add creep in to it.
                        // Also check for a creeps inside of that list.
                        if (spawn.memory.sources[sid].length < 1) {
                            spawn.memory.sources[sid].push(creep.name);
                            creep.memory.tid = sid;
                            return creep;
                        }
                    }
                    else {
                        // Add new sid in sources.
                        spawn.memory.sources[sid] = new Array();
                        // Add creep in to it.
                        spawn.memory.sources[sid].push(creep.name);
                        creep.memory.tid = sid;
                        return creep;
                    }
                }
            }
            if (creep.memory.tid == '') {
                creep.say("Zzz...");
            }
        }
        else {
            var source = Game.getObjectById(creep.memory.tid);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        return creep;
    },
    /** @param {Creep} creep **/
    run: function(creep) {
        //this.sources = temp_data.sources;
        // Set role back if creep has other role before.
        if (creep.memory.role != creep.memory.temp_role) {
            var creep = creepRoleController.checkBack(creep);
        }
        // Only for creeps with upgrader role.
        if (creep.memory.role == 'upgrader') {
            if(creep.carry.energy == 0) {
                creep.memory.charging = true;
                //var source = Game.getObjectById('5836b6588b8b9619519ee8c5');
                //var source = creep.pos.findClosestByPath(FIND_SOURCES);
                creep = this.interact_with_source(creep);
    	    }
    	    else {
    	        // Check if we are not full, continue charging.
    	        if (creep.memory.charging == true && creep.carryCapacity != creep.carry.energy) {
    	            creep = this.interact_with_source(creep);
    	        }
    	        // Reset flag to false, ot will say that we are charged.
    	        if (creep.memory.charging == true && creep.carryCapacity == creep.carry.energy) {
    	            creep.memory.charging = false;
    	        }
    	        // Find upgradeController and upgrade it.
    	        if ( creep.memory.charging == false) {
    	            if (creep.memory.tid != '') {
    	                for (var n in spawn.memory.sources[creep.memory.tid]) {
    	                    if (spawn.memory.sources[creep.memory.tid][n]) {
        	                    if (spawn.memory.sources[creep.memory.tid][n] == creep.name) {
        	                        spawn.memory.sources[creep.memory.tid].splice(n, 1);
        	                        break;
        	                    }
    	                    }
    	                }
    	                creep.memory.tid = '';
    	            }
    	            
        	        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                  }
    	        }
    	    }
        }
	}
};

module.exports = roleUpgrader;
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.controller');
 * mod.thing == 'a thing'; // true
 */

// Save settings to game memory.
var spawns = _.filter(Game.spawns);
var spawn = spawns[0];

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

var roleController = {
    fn_creep_move_to_source: function(creep) {
        if (creep.memory.tid) {
            var source = Game.getObjectById(creep.memory.tid);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }  
    },
    fn_creem_from_source: function(creep){
        if (creep.memory.tid != '') {
            var source = Game.getObjectById(creep.memory.tid);
            for (var n in source.room.memory.sources[creep.memory.tid]) {
    	        if (source.room.memory.sources[creep.memory.tid][n]) {
        	        if (source.room.memory.sources[creep.memory.tid][n] == creep.name) {
        	            source.room.memory.sources[creep.memory.tid].splice(n, 1);
        	           // break;
        	        }
    	        }
    	    }
    	    creep.memory.tid = '';
    	}
        return creep;
    },
    // Check if creep is in the given souce list.
    // Will return true if found or false.
    check_creep_sources: function(creep, sid) {
        if (creep.room.memory.sources[sid]) {
            var list = creep.room.memory.sources[sid];
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
            var room_name = creep.room.name;
            var found_sources = creep.room.find(FIND_SOURCES);
            var sid = '';
            for (var s_index in found_sources) {
                var source = found_sources[s_index];
                var sid = source.id;
                // Check if room is having sources in memory.
                if (creep.room.memory.sources[sid].length < 4) {
                    creep.room.memory.sources[sid].push(creep.name);
                    creep.memory.tid = sid;
                    break;
                }
            }
        }
        else {
            //creep.say("I have direction");
            var source = Game.getObjectById(creep.memory.tid);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        
        return creep;
    },
    checkIfHarvesterIsFree: function(creep) {
        var target = this.checkCap(creep);
        if (!target) {
            console.log("Role switched to upgrader");
            //creep.memory.temp_role = 'harvester';
            creep.memory.role = "upgrader";
            creep.memory.charging = true;
        }
        return creep;
    },
    checkBack: function(creep) {
        // Switch back to original role.
        var target = this.checkCap(creep);
        if (creep.carry.energy == 0) {
            if (target && creep.memory.temp_role != creep.role) {
                console.log(creep.name + ' role switched from [' + creep.memory.temp_role + '] back to original [' + creep.memory.role + ']');
                creep.memory.role = creep.memory.temp_role;
                return creep;
            }
        }
        return creep;
    },
    checkCap: function(creep) {
        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && 
                                structure.energy < structure.energyCapacity;
                    }
            });
        return target;
    }
}

module.exports = roleController;
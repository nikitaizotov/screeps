/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */
var creepRoleController = require('role.controller');
var roleBuilder = {
    run: function (creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep = creepRoleController.fn_creem_from_source(creep);
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
	        var flag_tower_found = false;
	        
	        // Search for a targets that will be a tower.
	        for (var i in targets) {
	            // If this is tower change flag to false and move creep to it.
	            if (targets[i].structureType == 'tower') {
	                if(creep.build(targets[i]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[i]);
                        flag_tower_found = true;
	                    break;
                    }
	            } 
	        }
	        
	        // If tower was found this code should be not launced.
	        if (flag_tower_found == false) {
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
	        }
	    }
	    else {
	       creep = creepRoleController.interact_with_source(creep);
    	   creepRoleController.fn_creep_move_to_source(creep);
	    }
    },
}

module.exports = roleBuilder;
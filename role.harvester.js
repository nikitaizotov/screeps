//var creepPos = require('creep.positioning');
var creepRoleController = require('role.controller');
// var roleUpgrader = require('role.upgrader');
var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        //////////////////////////////////
        var creep = creepRoleController.checkIfHarvesterIsFree(creep);
       
        if (creep.memory.role == 'harvester') {
            if (creep.carry.energy < creep.carryCapacity) {
                creep = creepRoleController.interact_with_source(creep);
    	        creepRoleController.fn_creep_move_to_source(creep);
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity;
                        }
                });
                if(targets.length > 0) {
                    creep = creepRoleController.fn_creem_from_source(creep);
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }
        }
	}
};

module.exports = roleHarvester;
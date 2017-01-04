var creepRoleController = require('role.controller');

var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep) {
        // Set role back if creep has other role before.
        if (creep.memory.role != creep.memory.temp_role) {
            var creep = creepRoleController.checkBack(creep);
        }
        // Only for creeps with upgrader role.
        if (creep.memory.role == 'upgrader') {
            if(creep.carry.energy == 0) {
                creep.memory.charging = true;
                creep = creepRoleController.interact_with_source(creep);

            }
            else {
                // Check if we are not full, continue charging.
                if (creep.memory.charging == true && creep.carryCapacity != creep.carry.energy) {
                    creep = creepRoleController.interact_with_source(creep);
                    //creepRoleController.fn_creep_move_to_source(creep);
                }
                // Reset flag to false, ot will say that we are charged.
                if (creep.memory.charging == true && creep.carryCapacity == creep.carry.energy) {
                    creep.memory.charging = false;
                }
                
                // Find upgradeController and upgrade it.
                if (creep.memory.charging == false) {
                    creep = creepRoleController.fn_creem_from_source(creep);
                   // creepRoleController.fn_creep_move_to_source(creep);
                    if (creep.memory.room == creep.room.name) {
                        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                    else {
                        var route = Game.map.findRoute(creep.room.name, creep.memory.room);
                        if(route.length > 0) {
                            var exit = creep.pos.findClosestByRange(route[0].exit);
                            creep.moveTo(exit);
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;
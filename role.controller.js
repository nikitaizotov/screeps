/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.controller');
 * mod.thing == 'a thing'; // true
 */

// // Save settings to game memory.
// var spawns = _.filter(Game.spawns);
// var spawn = spawns[0];

// // Clean spurces.
// for (var sid in spawn.memory.sources) {
//     for (var n in spawn.memory.sources[sid]) {
//         var creep_name = spawn.memory.sources[sid][n];
//         var flag_found = false;
//         for(var name in Memory.creeps) {
//             if (creep_name == name) {
//                 flag_found = true;
//             }
//         }
//         if (flag_found == false) {
//             delete spawn.memory.sources[sid].splice(n,1);
//         }
//     }
// }

var roleController = {
    fn_creep_move_to_source: function(creep) {
        if (creep.memory.tid) {
            var source = Game.getObjectById(creep.memory.tid);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }  
    },
    // Will not getObjectById
    fn_creem_from_source: function(creep){
        var sid = creep.memory.tid;
        var base_room = Game.rooms[creep.memory.home_room];
        if (creep.memory.home_room != creep.memory.tid_room) {
            if (base_room.memory.connected[creep.memory.tid_room].sources[sid]) {
                var index = base_room.memory.connected[creep.memory.tid_room].sources[sid].indexOf(creep.name);
                base_room.memory.connected[creep.memory.tid_room].sources[sid].splice(index, 1);
            }
        }
        else {
            if (base_room.memory.sources[sid]) {
                var index = base_room.memory.sources[sid].indexOf(creep.name);
                base_room.memory.sources[sid].splice(index, 1);
            }
        }
        creep.memory.tid = '';
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
            for (var sid in creep.room.memory.sources) {
                if (creep.room.memory.sources[sid].length < 4) {
                    creep.room.memory.sources[sid].push(creep.name);
                    creep.memory.tid = sid;
                    creep.memory.tid_room = creep.room.name;
                    creep.memory.home_room = creep.room.name;
                    break;
                }
            }
            if (creep.memory.tid == '') {
                var flag_found = false;
                for (var room in creep.room.memory.connected) {
                    if (creep.room.memory.connected[room].danger != 0) {
                        continue;
                    }
                    for (var sid in creep.room.memory.connected[room].sources) {
                        if (creep.room.memory.connected[room].sources[sid].length < 3) {
                            creep.room.memory.connected[room].sources[sid].push(creep.name);
                            creep.memory.tid = sid;
                            creep.memory.tid_room = room;
                            creep.memory.home_room = creep.room.name;
                            flag_found = true;
                            break;
                        }
                    }
                    if (flag_found == true) {
                        break;
                    }
                }
            }
        }
        else {
            // Move to source.
            if (creep.room.name == creep.memory.tid_room) {
                var source = Game.getObjectById(creep.memory.tid);
                if (source) {
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
            else {
                var room_pos_name =  creep.memory.tid_room;
                var route = Game.map.findRoute(creep.room.name, room_pos_name);
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }
        }
        return creep;
    },
    checkIfHarvesterIsFree: function(creep) {
        var target = this.checkCap(creep);
        if (!target) {
            //console.log("Role switched to upgrader");
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
                //console.log(creep.name + ' role switched from [' + creep.memory.temp_role + '] back to original [' + creep.memory.role + ']');
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
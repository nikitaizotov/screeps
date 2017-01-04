// Basic functions.
var Routines = require('routines');
// Memory cleaning functions.
var Cleaner = require('cleaner');
// Roles.
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleScout = require('role.scout');
var roleBuilder = require('role.builder');
// Extend spawn class.
require('construction.spawn');

module.exports.loop = function () {
    // Clean not existed creeps from sources.
    Cleaner.fn_clean_sources();
    // Remove not existed creeps from game.
    Cleaner.fn_clean_creeps();
    // Settings to memory.
    Routines.fn_unit_settings_to_memory();
    
    var spawns = _.filter(Game.spawns);
    for (var index_spawns in spawns) {
        var spawn_obj = spawns[index_spawns];
        spawn_obj.fn_discover_room();
        spawn_obj.fn_build_extentions();
        spawn_obj.fn_build_towers();
        spawn_obj.fn_controll_towers();
        
        // Run over the spawns units and controll population.
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.temp_role == 'harvester', (room) => spawn_obj.room.name);
        var builders = _.filter(Game.creeps, (creep) => creep.memory.temp_role == 'builder', (room) => spawn_obj.room.name);
        //console.log(builders.length);
        // Spawn new creeps if needed,
        for (var unit in spawn_obj.memory.units) {
            var built = _.filter(Game.creeps, (creep) => creep.memory.temp_role == unit, (room) => spawn_obj.room.name);
            var needed = spawn_obj.memory.units[unit].needed;
            var build_on = spawn_obj.memory.units[unit].build_on;
            if (harvesters.length < 3 && harvesters.length < spawn_obj.memory.units['harvester'].needed) {
                spawn_rooter('harvester', spawn_obj);
            } else {
                if (needed > built.length && build_on <= spawn_obj.room.controller.level) {
                    spawn_rooter(unit, spawn_obj);
                }
            }
        }
    }
    
    // Contoll creeps.
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (Memory.creeps[name] == false) {
            console.log("Not legal creep, removing.");
            creep.suicide();
        }
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'scout') {
            // creep.memory.role = 'harvester';
            //  creep.memory.temp_role = 'harvester';
            roleScout.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

// Function will spawn creep from given name.
function spawn_rooter(uname, spawn) {
    switch (uname) {
        case "harvester":
                spawn_harvester(spawn);
            break;
        case "upgrader":
                spawn_upgrader(spawn);
            break;
        case "builder":
                spawn_builder(spawn);
            break;
        case "scout":
                spawn_scout(spawn);
            break;
    }
}

// Spawn upgrader.
function spawn_upgrader(spawn) {
    var body = fn_get_worker_body(spawn);
    var creeps_memory = {
        role: 'upgrader', 
        temp_role: 'upgrader', 
        tid: '',
        tid_room: '',
        home_room: '',
    }
    spawn_creep(spawn.name, body, undefined, creeps_memory);
}

// Spawn builder.
function spawn_builder(spawn) {
    var body = fn_get_worker_body(spawn);
    var creeps_memory = {
        role: 'builder', 
        temp_role: 'builder', 
        tid: '',
        tid_room: '',
        home_room: '',
    }
    spawn_creep(spawn.name, body, undefined, creeps_memory);
}

// Spawn havester.
function spawn_harvester(spawn) {
    var body = fn_get_worker_body(spawn);
        var creeps_memory = {
        role: 'harvester', 
        temp_role: 'harvester', 
        tid: '',
        tid_room: '',
        home_room: '',
    }
    spawn_creep(spawn.name, body, undefined, creeps_memory);
}

// Spawn scout.
function spawn_scout(spawn) {
    var body = [MOVE,MOVE,MOVE];
    spawn_creep(spawn.name, body, undefined, {
        role: 'scout', 
        temp_role: 'scout', 
        tid: '', data: {},
        room: spawn.room.name,
    });
}

function spawn_creep(spawn, body, name, options) {
    if(Game.spawns.Spawn1.canCreateCreep(body, name) == OK) {
        var newName = Game.spawns[spawn].createCreep(body, name, options);
        console.log('Spawning new ' + options.role + ': ' + newName);
    }
}

function fn_get_worker_body(spawn) {
    var body = [];
    switch (spawn.room.controller.level) {
        case 1:
            body = [WORK,CARRY,MOVE];
        break;
        case 2:
            if(spawn.canCreateCreep([WORK, WORK ,WORK, CARRY, MOVE], undefined) == OK) {
                body = [WORK, WORK ,WORK, CARRY, MOVE];
            }
            else {
                body = [WORK,CARRY,MOVE];
            }
            break;
        default:
            if(spawn.canCreateCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], undefined) == OK) {
               body = [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE];
            }
            else {
                if(spawn.canCreateCreep([WORK, WORK ,WORK, CARRY, MOVE], undefined) == OK) {
                    body = [WORK, WORK ,WORK, CARRY, MOVE];
                }
                else {
                    body = [WORK,CARRY,MOVE];
                }
            }
    }
   return body;
}

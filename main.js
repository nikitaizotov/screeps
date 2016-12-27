var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
// var roleGuard = require('role.guard');
var roleBuilder = require('role.builder');
var temp_data = {
    sources: {},
    units: {
        harvester: {
            needed: 3,
        },
        ugrader: {
            needed: 3,
        },
        builder: {
            needed: 1,
        },
    },
};

// Save settings to game memory.
var spawns = _.filter(Game.spawns);
var spawn = spawns[0];
if (!spawn.memory.units) {
    spawn.memory.units = temp_data.units;
}

module.exports.loop = function () {
    // Clean not existed creeps.
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            for(var n in roleUpgrader.sources) {
                for (var z in roleUpgrader.sources[n]) {
                    if (roleUpgrader.sources[n][z] == name) {
                        delete roleUpgrader.sources[n][z];
                    }
                }
            }
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    // Spawn new creeps if needed,
    for (var unit in spawn.memory.units) {
        var built = _.filter(Game.creeps, (creep) => creep.memory.temp_role == unit);
        var needed = spawn.memory.units[unit].needed;
        if (needed > built.length) {
            spawn_rooter(unit);
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
        // if(creep.memory.role == 'guard') {
        //     roleGuard.run(creep);
        // }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

// Function will spawn creep from given name.
function spawn_rooter(uname) {
    switch (uname) {
        case "harvester":
                spawn_harvester();
            break;
        case "upgrader":
                spawn_upgrader();
            break;
        case "builder":
                spawn_builder();
            break;
    }
}

// Spawn upgrader.
function spawn_upgrader() {
    var body = [WORK,CARRY,MOVE];
    spawn_creep('Spawn1', body, undefined, {role: 'upgrader', temp_role: 'upgrader', tid: ''});
}

// Spawn builder.
function spawn_builder() {
    var body = [WORK,CARRY,MOVE];
    spawn_creep('Spawn1', body, undefined, {role: 'builder', temp_role: 'builder', tid: ''});
}

// Spawn havester.
function spawn_harvester() {
    // if(spawn.canCreateCreep([WORK, WORK ,WORK, CARRY, MOVE], undefined) == OK) {
    //     spawn.createCreep(body, name);
    // }
    var body = [WORK,CARRY,MOVE];
    spawn_creep('Spawn1', body, undefined, {role: 'harvester', temp_role: 'harvester', tid: ''});
}

// function spawn_guard(spawn) {
//     // var body = [TOUGH, MOVE, ATTACK];
//     // if(Game.spawns.Spawn1.canCreateCreep(body, undefined) == OK) {
//     //     var newName = Game.spawns.Spawn1.createCreep(body, undefined, {role: 'guard'});
//     //     console.log('Spawning new guard: ' + newName);
//     // }
// }

function spawn_creep(spawn, body, name, options) {
    if(Game.spawns.Spawn1.canCreateCreep(body, name) == OK) {
        var newName = Game.spawns[spawn].createCreep(body, name, options);
        console.log('Spawning new ' + options.role + ': ' + newName);
    }
}

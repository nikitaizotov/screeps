var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
// var roleGuard = require('role.guard');
var roleGuard = require('role.builder');
var temp_data = {
    sources: {}
};

module.exports.loop = function () {
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
    
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.temp_role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.temp_role == 'upgrader');
    // var guards = _.filter(Game.creeps, (creep) => creep.memory.role == 'guard');
    //var builders = _.filter(Game.creeps, (creep) => creep.memory.temp_role == 'builder');
    //console.log("H:" + harvesters.length + " U:" + upgraders.length);
    //console.log(temp_data.sources['eaa6fb89a4c049c56f73f8ed']);

    if(harvesters.length < 3) {
        spawn_harvester();
    }
    else {
        if (upgraders.length < 10) {
            spawn_upgrader();
        }
        // if (builders.length < 1) {
        //     spawn_upgrader();
        // }
        // if (guards.length < 7) {
        //     spawn_guard();
        // }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (Memory.creeps[name] == false) {
            console.log("Not legal creep, removing.");
            creep.suicide();
        }
        
        var res = creep.memory.role.slice(0, 1);
        var res1 = creep.memory.temp_role.slice(0, 1);
        //if (creep.memory.tid.id) {
            //console.log(creep.memory.tid.id.slice(creep.memory.tid.id.length-1,creep.memory.tid.id.length));
            creep.say(res + ' ' + creep.memory.tid.slice(creep.memory.tid.length-1,creep.memory.tid.length));
        //}
        // creep.say(res + res1 + " " + creep.carry.energy);
        
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        // if(creep.memory.role == 'guard') {
        //     roleGuard.run(creep);
        // }
        // if(creep.memory.role == 'builder') {
        //     roleBuilder.run(creep);
        // }
    }
}

function spawn_upgrader() {
    var body = [WORK,CARRY,MOVE];
    spawn_creep('Spawn1', body, undefined, {role: 'upgrader', temp_role: 'upgrader', tid: ''});
}

function spawn_builder() {
    var body = [WORK,CARRY,MOVE];
    spawn_creep('Spawn1', body, undefined, {role: 'builder', temp_role: 'builder', tid: ''});
}

function spawn_harvester() {
    // if(spawn.canCreateCreep([WORK, WORK ,WORK, CARRY, MOVE], undefined) == OK) {
    //     spawn.createCreep(body, name);
    // }
    var body = [WORK,CARRY,MOVE];
    spawn_creep('Spawn1', body, undefined, {role: 'harvester', temp_role: 'harvester', tid: ''});
}

function spawn_guard(spawn) {
    // var body = [TOUGH, MOVE, ATTACK];
    // if(Game.spawns.Spawn1.canCreateCreep(body, undefined) == OK) {
    //     var newName = Game.spawns.Spawn1.createCreep(body, undefined, {role: 'guard'});
    //     console.log('Spawning new guard: ' + newName);
    // }
}

function spawn_creep(spawn, body, name, options) {
    if(Game.spawns.Spawn1.canCreateCreep(body, name) == OK) {
        var newName = Game.spawns[spawn].createCreep(body, name, options);
        console.log('Spawning new ' + options.role + ': ' + newName);
    }
}

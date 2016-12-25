var creepRoleController = require('role.controller');

var roleUpgrader = {
    sources: [],
    interact_with_source: function(creep) {
        var sources_found = creep.room.find(FIND_SOURCES);
        var source = false;
        var selmid = 0;
        //console.log(sources);
        // Assing updater to a source.
        for (n in sources_found) {
            var sname = sources_found[n];
            // if (this.sources[sources[n]] == undefined) {
            //     this.sources[sources[n]] = [creep.name];
            //     creep.memory.tid = sources[n];
            //     source = n;
            //     break;
            // }
            // else {
            //     if (this.sources[sources[n]].length < 5) {
            //         var found = false;
            //         for (elm in this.sources[sources[n]]) {
            //             if (this.sources[sources[n]][elm] == creep.name) {
            //                 found = true;
            //             }
            //         }
            //         if (found == false) {
            //             this.sources[sources[n]].push(creep.name);
            //             creep.memory.tid = sources[n];
            //             source = n;
            //             break;
            //         }
            //     }
            // }
            if(typeof this.sources[sname] === 'undefined') {
                creep.memory.tid = sname;
                selmid = n;
                this.sources[sources_found[n]] = [creep.name];
                // does not exist
                break;
            }
            else {
                var flag_found = false;
                if (this.sources[sources_found[n]].length > 4) {
                    console.log("No space for me here, looking for other energy source.");
                    continue;
                }
                for (n in this.sources) {
    	           for (z in this.sources[n]) {
    	               if (this.sources[n][z] == creep.name) {
    	                   flag_found = true;
    	               }
    	           }
    	           if (flag_found == false) {
    	               this.sources[n].push(creep.name);
    	               break;
    	           }
    	        }
                creep.memory.tid = sname;
                selmid = n;
                // does exist
                break;
            }
        }
        console.log(creep.name + " -> " + creep.memory.tid)
        if(creep.harvest(sources_found[selmid]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources_found[selmid]);
        }
        return creep;
    },
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
                //var source = Game.getObjectById('5836b6588b8b9619519ee8c5');
                //var source = creep.pos.findClosestByPath(FIND_SOURCES);
                creep = this.interact_with_source(creep);
                //console.log(creep.name + " empty " + source);
    	    }
    	    else {
    	        if (creep.memory.tid != undefined && creep.memory.tid) {
    	            for (n in this.sources) {
    	                for (z in this.sources[n]) {
    	                    if (this.sources[n][z] == creep.name) {
    	                        this.sources[n].splice(z);
    	                    }
    	                }
    	            }
    	            creep.memory.tid = '';
    	        }
    	        //console.log(creep.name + " " + creep.memory.charging);
    	        // Check if we are not full, continue charging.
    	        if (creep.memory.charging == true && creep.carryCapacity != creep.carry.energy) {
    	            creep = this.interact_with_source(creep);
    	        }
    	        // Reset flag to false, ot will say that we are charged.
    	        if (creep.memory.charging == true && creep.carryCapacity == creep.carry.energy) {
    	            //console.log("FULL");
    	            creep.memory.charging = false;
    	        }
    	        // Find upgradeController and upgrade it.
    	        if ( creep.memory.charging == false) {
    	            //console.log(creep.name + " moving to upgrade");
        	        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
    	        }
    	    }
        }
	}
};

module.exports = roleUpgrader;
var creepFunctions = require('role.functions');
// creep.memory.party
var WarriorRole = {
	run: function(creep) {
		// If empty, find friends.
		if (!creep.memory.party || creep.memory.party == '') {
			creepFunctions.fn_join_find_party(creep);
		}
		// If not empty, do something.
		if (creep.memory.party != '') {
		}
	},
}
module.exports = WarriorRole;
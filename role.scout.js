/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.scout');
 * mod.thing == 'a thing'; // true
 */
var scout = {
    // Function will get all neigbour rooms.
    fn_get_avail_rooms: function(creep) {
        console.log(Game.map.describeExits('sim'));
    },
    run: function(creep) {
        this.fn_get_avail_rooms(creep);
    }
}

module.exports = scout;
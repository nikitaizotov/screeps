/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var roleBuilder = {
    run: function (creep) {
        var patch = creep.room.findPath(FIND_SOURCES);
    }
}

module.exports = roleBuilder;
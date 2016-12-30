Spawn.prototype.fn_build_roads = function() {
    var sources = this.room.find(FIND_SOURCES);
    for (var source_i in sources) {
        var source = sources[source_i];
        var path = this.room.findPath(source.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
        this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    }
    var path = this.room.findPath(this.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
    this.fn_create_construction_sites(path, STRUCTURE_ROAD);
}

Spawn.prototype.fn_create_construction_sites = function(path, construction) {
    for (var index in path) {
        var item = path[index];
        var roomPosition = this.room.getPositionAt(item.x, item.y);
        if (this.room.lookForAt('structure', roomPosition).length == 0 && 
        this.room.lookForAt('constructionSite', roomPosition).length == 0) {
            this.room.createConstructionSite(roomPosition, construction);
        }
    }
}
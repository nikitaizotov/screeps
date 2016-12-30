Spawn.prototype.fn_build_roads = function() {
    // Find sources and build roads from them to room controller,
    // and from spawn to sources
    var sources = this.room.find(FIND_SOURCES);
    for (var source_i in sources) {
        var source = sources[source_i];
        // Road from source to controller.
        var path = this.room.findPath(source.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
        this.fn_create_construction_sites(path, STRUCTURE_ROAD);
        // Road from Spawn to source.
        var path = this.room.findPath(this.pos, source.pos, {ignoreRoads: true, ignoreCreeps:true});
        this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    }
    // Road from spawn to controller.
    var path = this.room.findPath(this.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
    this.fn_create_construction_sites(path, STRUCTURE_ROAD);
}

Spawn.prototype.fn_create_construction_sites = function(path, construction) {
    // Run over the path and build something on its locations.
    for (var index in path) {
        var item = path[index];
        var roomPosition = this.room.getPositionAt(item.x, item.y);
        // If there is an empty place.
        if (this.room.lookForAt('structure', roomPosition).length == 0 && 
        this.room.lookForAt('constructionSite', roomPosition).length == 0) {
            // Build for a structure.
            this.room.createConstructionSite(roomPosition, construction);
        }
    }
}
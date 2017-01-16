Spawn.prototype.fn_build_walls_and_roads = function() {
    if (Game.time % 1) {
        return;
    }
    // Collect all objects in to array.
    if (!this.room.memory.walls) {
        var errors = false;
        var objects = [];
        for (var y = 2; y < 47; y++) {
           for (var x = 2; x < 47; x++) {
                var obj = this.room.lookAt(x,y);
                switch(obj[0].type) {
                    case 'source':
                    case 'structure':
                    case 'mineral':
                        objects.push([x, y]);
                    break;
                }
            }
        }
    
        var roads = [];
        for (var i = 0; i < objects.length; i++) {
            var p1 = this.room.getPositionAt(objects[i][0], objects[i][1]);
            if (i == 0) {
                // Top.
                roads.push([p1, p1]);
            }
            else {
                var left = roads[roads.length-1][0];
                var right = roads[roads.length-1][1];
                if (p1.x <= left.x) {
                    // Left
                    roads.push([p1, right]);
                    var path = this.room.findPath(p1, left, {ignoreRoads: true, ignoreCreeps:true});
                    this.fn_create_construction_sites(path, STRUCTURE_ROAD);
                }
                else {
                    // Right
                    roads.push([left, p1]);
                    var path = this.room.findPath(p1, right, {ignoreRoads: true, ignoreCreeps:true});
                    this.fn_create_construction_sites(path, STRUCTURE_ROAD);
                } 
                if (errors == false) {
                    errors = this.fn_check_csites(path);
                }
            }
        }
        // Connect bottom.
        var path = this.room.findPath(roads[roads.length-1][0], roads[roads.length-1][1], {ignoreRoads: true, ignoreCreeps:true});
        Memory.junk = path;
        this.fn_create_construction_sites(path, STRUCTURE_ROAD);
        if (errors == false) {
            errors = this.fn_check_csites(path);
        }
        if (errors == false) {
            this.room.memory.walls = true;
            console.log("Roads project : done")
        }
        // var csites = this.room.find(FIND_CONSTRUCTION_SITES);
        //     for (var csite_i in csites) {
        //         if (csites[csite_i].structureType == 'road') {
        //             csites[csite_i].remove();
        //         }
        //     }
       // Memory.junk = objects;
        //console.log(objects);
    }
    else {
        // Create walls.
        var wall_borders = {
            left_x: 0,
            top_y: 0,
            right_x: 0,
            bottom_y: 0,
        }
        // Find top_y
        for (var y = 2; y < 47; y++) {
            for (var x = 2; x < 47; x++) {
                var obj = this.room.lookAt(x,y);
                switch(obj[0].type) {
                    case 'source':
                    case 'structure':
                    case 'mineral':
                        wall_borders.top_y = y;
                    break;
                }
                if (wall_borders.top_y != 0) {
                    break;
                }
            }
        }
        // Find bottom_y
        for (var y = 47; y > 2; y--) {
            for (var x = 2; x < 47; x++) {
                var obj = this.room.lookAt(x,y);
                switch(obj[0].type) {
                    case 'source':
                    case 'structure':
                    case 'mineral':
                        wall_borders.bottom_y = y;
                    break;
                }
                if (wall_borders.bottom_y != 0) {
                    break;
                }
            }
        }
        // Find left_x
        for (var x = 2; x < 47; x++) {
            for (var y = 2; y < 47; y++) {
                var obj = this.room.lookAt(x,y);
                switch(obj[0].type) {
                    case 'source':
                    case 'structure':
                    case 'mineral':
                        wall_borders.left_x = x;
                    break;
                }
                if (wall_borders.left_x != 0) {
                    break;
                }
            }
        }
        // Find left_x
        for (var x = 47; x > 2; x--) {
            for (var y = 2; y < 47; y++) {
                var obj = this.room.lookAt(x,y);
                switch(obj[0].type) {
                    case 'source':
                    case 'structure':
                    case 'mineral':
                        wall_borders.right_x = x;
                    break;
                }
                if (wall_borders.right_x != 0) {
                    break;
                }
            }
        }
        var wall_project = [];
        // Top wall.
        wall_project.push(this.fn_wall_from_to_x(wall_borders.left_x, wall_borders.right_x, this.fn_calculate_posible_path(wall_borders.top_y - 4)));
        // // Bottom wall.
        wall_project.push(this.fn_wall_from_to_x(wall_borders.left_x, wall_borders.right_x, this.fn_calculate_posible_path(wall_borders.bottom_y + 4)));
        // Top wall.
        wall_project.push(this.fn_wall_from_to_x(wall_borders.top_y, wall_borders.bottom_y, this.fn_calculate_posible_path(wall_borders.left_x - 4)));
        // // Bottom wall.
        wall_project.push(this.fn_wall_from_to_x(wall_borders.top_y, wall_borders.bottom_y, this.fn_calculate_posible_path(wall_borders.right_x + 4)));
        console.log("Walls project : done");
        // Generate path from spawn to any exit. Run over the path from the beginning and found where path is contacting
        // with walls. Remove wall project on that location.
        // Generate path.
        var current_room_connecions = Game.map.describeExits(this.room);
        var exit = this.pos.findClosestByRange(current_room_connecions);
        console.log(current_room_connecions);
        //var path = this.room.findPath(this.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
        // if (obj[0].type == 'constructionSite' && 
                    //     obj[0].constructionSite.structureType == 'road' ||
                    //     obj[0].type == 'structure' && obj[0].structureType == 'road') {
                       
                    // }\
        //             console.log(wall_project);
        // Memory.junk = wall_borders;
    }
}

// Return array with coordinates of wall project for top and down..
Spawn.prototype.fn_wall_from_to_x = function(start_x, end_x, y) {
    // Array that will be returned.
    var return_arr = [];
    var step_off = 4;
    // Calculate borders.
    start_x = this.fn_calculate_posible_path(start_x - step_off);
    end_x = this.fn_calculate_posible_path(end_x + step_off);
    var wall_path = {};
    for (var x = start_x; x < end_x + 1; x++) {
        var roomPosition = this.room.lookAt(x, y);
        if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
            var roomPosition = this.room.getPositionAt(x, y)
            return_arr.push(roomPosition)
        }
    }
    return return_arr;
}

// Return array with coordinates of wall project for left and right walls.
Spawn.prototype.fn_wall_from_to_y = function(start_y, end_y, x) {
    // Array that will be returned.
    var return_arr = [];
    var step_off = 4;
    // Calculate borders.
    start_x = this.fn_calculate_posible_path(start_y - step_off);
    end_x = this.fn_calculate_posible_path(end_y + step_off);
    var wall_path = {};
    for (var x = start_y; x < end_y + 1; x++) {
        var roomPosition = this.room.lookAt(x, y);
        if (roomPosition[0].type == 'terrain' && roomPosition[0].terrain != 'wall') {
            var roomPosition = this.room.getPositionAt(x, y)
            return_arr.push(roomPosition)
        }
    }
    return return_arr;
}

Spawn.prototype.fn_check_csites = function(path) {
    var errors = false;
    for (var i in path) {
        var what = this.room.lookAt(path[i].x, path[i].y);
        if (what[0].type != 'constructionSite' && what[0].type != 'source' && what[0].type != 'structure') {
            return true;
        }
    }
    return errors;
}

Spawn.prototype.fn_controll_towers = function() {  
    var towers = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER;
                    }
            });
    for (var i in towers) {
        var tower = towers[i];
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
}

Spawn.prototype.fn_get_construction_loc = function() {
    var roads = this.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
                return structure.structureType == STRUCTURE_ROAD;
            }
        });
    if (roads.length == 0) {
        return;
    }
    var road_elm = parseInt(Math.random() * (roads.length - 0) + 0);
    for (var y=-1; y<3; y++){
        for (var x=-1; x<3; x++){
            var new_x = this.fn_calculate_posible_path(roads[road_elm].pos.x - x);
            var new_y = this.fn_calculate_posible_path(roads[road_elm].pos.y - y);
            var roomPosition = this.room.getPositionAt(new_x, new_y);
            if (this.room.lookForAt('structure', roomPosition).length == 0 && 
                this.room.lookForAt('constructionSite', roomPosition).length == 0) {
                return roomPosition;
            }
        }
    }
    return false;
}

Spawn.prototype.fn_build_towers = function() {
    var towers = this.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER;
                    }
            });
    var avail = 0;
    switch(this.room.controller.level) {
        case 1:
        case 2:
            avail = 0;
        break;
        case 3:
        case 4:
            avail = 1;
        break;
        case 5:
        case 6:
            avail = 2;
        break;
        case 7:
            avail = 3;
        break;
        default:
            avail = 6;
        break;
    }
    if (towers.length < avail) {
        var roomPosition = this.fn_get_construction_loc();
        if (roomPosition != false) {
            this.room.createConstructionSite(roomPosition, STRUCTURE_TOWER);
        }
    }
}

Spawn.prototype.fn_build_extentions = function() {
    var exts = this.room.find(STRUCTURE_EXTENSION);
    if (!exts) {
        var exts_built = 0;
    }
    else {
        exts_built = exts.length;
    }
    var csites = this.room.find(FIND_CONSTRUCTION_SITES);
    this.room.memory.extensions = exts.length;
    for (var csite_i in csites) {
        if (csites[csite_i].structureType == 'extension') {
            this.room.memory.extensions += 1;
        }
    }

    var extensions_avail = 0;
    switch(this.room.controller.level) {
        case 1:
            extensions_avail = 0;
        break;
        case 2:
            extensions_avail = 5;
        break;
        case 3:
            extensions_avail = 10; 
        break;
        default:
            extensions_avail = this.room.controller.level * 10 - 20;
        break;
    }
    // REFACTOR NEEDED!!!
    if (exts_built < extensions_avail) {
        var roomPosition = this.fn_get_construction_loc();
        if (roomPosition != false) {
            this.room.createConstructionSite(roomPosition, STRUCTURE_EXTENSION);
        }
    }
}

Spawn.prototype.fn_calculate_posible_path = function(coordinates) {
    var min = 3;
    var max = 46;
    if (coordinates > max) {
        coordinates = max;
    }
    if (coordinates < min) {
        coordinates = min;
    }
    
    return coordinates;
}

Spawn.prototype.fn_discover_room = function() {
    var sources = this.room.find(FIND_SOURCES);
    for (var i in sources) {
        var source = sources[i];
        var sid = source.id;
        if (!this.room.memory.sources) {
            this.room.memory.sources = {};
        }
        if (!this.room.memory.sources[sid]) {
            this.room.memory.sources[sid] = [];
            // // Connect source with road to spawn and to room controller.
            var path = this.room.findPath(source.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
            this.fn_create_construction_sites(path, STRUCTURE_ROAD);
            var path = this.room.findPath(source.pos, this.pos, {ignoreRoads: true, ignoreCreeps:true});
            this.fn_create_construction_sites(path, STRUCTURE_ROAD);
        }
    }
    // Order to build walls
    if (this.room.controller.level > 0) {
        if (!this.room.memory.walls) {
            var upper_wall = [];
            var errors = 0;
            for (var x = 2; x < 48; x++) {
                var built_roomPosition = this.room.getPositionAt(x, 2);
                errors += this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
                var built_roomPosition = this.room.getPositionAt(2, x);
                errors += this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
                var built_roomPosition = this.room.getPositionAt(x, 47);
                errors += this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
                var built_roomPosition = this.room.getPositionAt(47, x);
                errors += this.room.createConstructionSite(built_roomPosition, STRUCTURE_EXTENSION);
            }
            if (errors == 0) {
                this.room.memory.walls = true;
            }
        }
    }
}

// This function will build roads and connects all structures in the room.
Spawn.prototype.fn_build_roads = function() {
    // if (this.room.controller.level == 1) {
    //     // Find sources and build roads from them to room controller,
    //     // and from spawn to sources
    //     var sources = this.room.find(FIND_SOURCES);
    //     for (var source_i in sources) {
    //         var source = sources[source_i];
    //         // Road from source to controller.
    //         var path = this.room.findPath(source.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
    //         this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    //         // Road from Spawn to source.
    //         var path = this.room.findPath(this.pos, source.pos, {ignoreRoads: true, ignoreCreeps:true});
    //         this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    //     }
    //     // Road from spawn to controller.
    //     var path = this.room.findPath(this.pos, this.room.controller.pos, {ignoreRoads: true, ignoreCreeps:true});
    //     this.fn_create_construction_sites(path, STRUCTURE_ROAD);
    // }
}

// This function will create a structure on a given path.
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
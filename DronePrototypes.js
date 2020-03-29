// ===========================
// Energy Collection methods
// ===========================

// Harvest Source nodes
Creep.prototype.harvestSource = function() {
    const activeSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    switch (activeSource) {
        case null:
            return null;
        default:
            if (this.harvest(activeSource) === ERR_NOT_IN_RANGE) {
                this.moveTo(activeSource, {
                    visualizePathStyle: {
                        stroke: '#ffff66',
                        opacity: 0.7
                    }
                });
            }
            break;
    }
}

// Collected dropped Source
Creep.prototype.collectDroppedSource = function() {
    var droppedSource = undefined;
    if (this.room.find(FIND_HOSTILE_CREEPS).length == 0) {
        droppedSource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType == RESOURCE_ENERGY });
    }
    switch (droppedSource) {
        case undefined:
            return null;
        default:
            if (this.pickup(droppedSource) === ERR_NOT_IN_RANGE) {
                this.moveTo(droppedSource, {
                    visualizePathStyle: {
                        stroke: '#ffff66',
                        opacity: 0.7
                    }
                });
            }
            break;
    }
}

// Collect from Tombstones
Creep.prototype.withdrawTombstone = function() {
    var tombstone = undefined;
    if (this.room.find(FIND_HOSTILE_CREEPS).length == 0) {
        tombstone = this.pos.findClosestByPath(FIND_TOMBSTONES, { filter: t => t.store[RESOURCE_ENERGY] > 0 });
    }
    switch (tombstone) {
        case undefined:
            return null;
        default:
            if (this.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(tombstone, {
                    visualizePathStyle: {
                        stroke: '#ffff66',
                        opacity: 0.7
                    }
                });
            }
            break;
    }
}

// Collect from Ruins
Creep.prototype.collectRuin = function() {
    const ruin = this.pos.findClosestByPath(FIND_RUINS, { filter: (t) => t.store[RESOURCE_ENERGY] > 0 });

    switch (ruin) {
        case null:
            return null;
        default:
            if (this.withdraw(ruin, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(ruin, {
                    visualizePathStyle: {
                        stroke: '#ffff66',
                        opacity: 0.7
                    }
                });
            }
            break;
    }
}

// ===========================
// Energy Delivery methods
// ===========================

// Deliver to Spawn and Extentions
Creep.prototype.chargeSpawn = function() {
    const spawn = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
            (s.structureType == STRUCTURE_EXTENSION &&
                s.store[RESOURCE_ENERGY] <
                s.store.getCapacity(RESOURCE_ENERGY)) ||
            (s.structureType == STRUCTURE_SPAWN &&
                s.store[RESOURCE_ENERGY] <
                s.store.getCapacity(RESOURCE_ENERGY))
    });

    switch (spawn) {
        case null:
            return null;

        default:
            if (this.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(spawn);
            }
            break;
    }
}

// Deliver to Room Controller
Creep.prototype.chargeController = function() {
    const controller = this.room.controller;
    switch (controller.my) {
        case false:
            return null;

        default:
            if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                this.moveTo(controller, {
                    visualizePathStyle: {
                        opacity: 0.7
                    }
                });
            }
            break;
    }
}

// Construct
Creep.prototype.construct = function() {
    const construction = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    switch (construction) {
        case null:
            return null;

        default:
            if (this.build(construction) === ERR_NOT_IN_RANGE) {
                this.moveTo(construction, {
                    visualizePathStyle: {
                        stroke: '#00cc00',
                        opacity: 0.7
                    }
                });
            }
            break;
    }
}

// Repair all
Creep.prototype.repairMostDamaged = function() {
    const damagedBuildings = this.room.find(FIND_MY_STRUCTURES, { filter: s => s.hits <= s.hitsMax });
    // console.log(damagedBuildings)
    if (damagedBuildings.length < 0) {
        var mostDamagedBuilding = undefined;

        for (let percentage = 0.0005; percentage <= 1; percentage = percentage + 0.0005) {
            // find building with less than percentage hits
            for (let building of damagedBuildings) {
                if (building.hits / building.hitsMax < percentage) {
                    mostDamagedBuilding = building;
                    break;
                }
            }
            // if there is a match
            switch (mostDamagedBuilding) {
                case undefined:
                    return null;

                default:
                    if (this.repair(damagedRoads) === ERR_NOT_IN_RANGE) {
                        this.moveTo(damagedRoads, {
                            visualizePathStyle: {
                                stroke: '#00cc00',
                                opacity: 0.7
                            }
                        });
                    }
                    return OK;
                    break;
            }
        }
    } else {
        return null;
    }
}

// Repair Roads
Creep.prototype.repairRoad = function() {
    const damagedRoads = this.pos.findClosestByPath(
        FIND_STRUCTURES, {
            filter: s =>
                s.hits < s.hitsMax / 2 && s.structureType === STRUCTURE_ROAD
        });
    switch (damagedRoads) {
        case null:
            return -10;

        default:
            if (this.repair(damagedRoads) === ERR_NOT_IN_RANGE) {
                this.moveTo(damagedRoads, {
                    visualizePathStyle: {
                        stroke: '#00cc00',
                        opacity: 0.7
                    }
                });
            }
            return 0;
    }
}

// Recharge Towers
Creep.prototype.rechargeTower = function() {
    const depletedTower = this.pos.findClosestByPath(
        FIND_MY_STRUCTURES, {
            filter: t => t.structureType == STRUCTURE_TOWER && t.store[RESOURCE_ENERGY] < t.store.getCapacity(RESOURCE_ENERGY)
        });
    switch (depletedTower) {
        case null:
            console.log("Tower return -10")
            return null;

        default:
            if (this.transfer(depletedTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(depletedTower, {
                    visualizePathStyle: {
                        stroke: '#00cc00',
                        opacity: 0.7
                    }
                });
            }
            console.log("tower Return OK")
            return OK;
    }
}
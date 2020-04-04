// ===========================
// Energy Collection methods
// ===========================

// Harvest Source nodes
Creep.prototype.harvestSource = function(sourceID) {
    var activeSource = null;
    if (sourceID === undefined) {
        activeSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    } else {
        activeSource = Game.getObjectById(sourceID);
    }
    switch (activeSource) {
        case null:
            return ERR_NOT_FOUND;
        default:
            if (this.harvest(activeSource) === ERR_NOT_IN_RANGE) {
                this.moveTo(activeSource, {
                    visualizePathStyle: {
                        stroke: '#ffff66',
                        opacity: 0.7
                    }
                });
            }
            return OK;
    }
}

// Collected dropped Source
Creep.prototype.collectDroppedSource = function() {
    const droppedSource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: r => r.resourceType == RESOURCE_ENERGY });

    switch (droppedSource) {
        case null:
            return ERR_NOT_FOUND;

        default:
            if (this.pickup(droppedSource) === ERR_NOT_IN_RANGE) {
                this.moveTo(droppedSource, {
                    visualizePathStyle: {
                        stroke: '#ffff66',
                        opacity: 0.7
                    }
                });
            }
            return OK;
    }
}

// Collect from Tombstones
Creep.prototype.withdrawTombstone = function() {
    const tombstone = this.pos.findClosestByPath(FIND_TOMBSTONES, { filter: t => t.store[RESOURCE_ENERGY] > 0 });

    switch (tombstone) {
        case null:
            return ERR_NOT_FOUND;

        default:
            if (this.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(tombstone, {
                    visualizePathStyle: {
                        stroke: '#ffff66',
                        opacity: 0.7
                    }
                });
            }
            return OK;
    }
}

// Collect from Ruins
Creep.prototype.collectRuin = function() {
    const ruin = this.pos.findClosestByPath(FIND_RUINS, { filter: (t) => t.store[RESOURCE_ENERGY] > 0 });

    switch (ruin) {
        case null:
            return ERR_NOT_FOUND;
        default:
            if (this.withdraw(ruin, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(ruin, {
                    visualizePathStyle: {
                        stroke: '#ffff66',
                        opacity: 0.7
                    }
                });
            }
            return OK;
    }
}

Creep.prototype.collectStorage = function() {
    const storage = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
            (s.structureType == STRUCTURE_STORAGE &&
                s.store[RESOURCE_ENERGY] > 0)
    });
    switch (storage) {
        case null:
            return ERR_NOT_FOUND;

        default:
            if (this.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(storage);
            }
            return OK;
    }
}

// Creep.prototype.collectContainer = function(range) {
//     let container = null;
//     if (range === undefined) {
//         container = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
//             filter: s =>
//                 (s.structureType == STRUCTURE_CONTAINER &&
//                     s.store[RESOURCE_ENERGY] > 0)
//         });
//     } else {
//         container = this.pos.findInRange(_.filter(FIND_MY_STRUCTURES, s => s.structureType === STRUCTURE_CONTAINER), range);
//     }
//     switch (container) {
//         case null:
//             return ERR_NOT_FOUND;

//         default:
//             if (this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
//                 this.moveTo(container);
//             }
//             return OK;
//     }
// }

Creep.prototype.collectLink = function() {
    const link = Game.getObjectById(this.room.memory.links.baseLinkID);

    switch (link) {
        case null:
            return ERR_NOT_FOUND;

        default:
            if (this.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(link);
            }
            return OK;
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
            return ERR_NOT_FOUND;

        default:
            if (this.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(spawn);
            }
            return OK;
    }
}

// Deliver to Room Controller
Creep.prototype.chargeController = function() {
    const controller = this.room.controller;
    switch (controller.my) {
        case false:
            return ERR_NOT_OWNER;

        default:
            if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                this.moveTo(controller, {
                    visualizePathStyle: {
                        opacity: 0.7
                    }
                });
            }
            return OK;
    }
}

// Construct
Creep.prototype.construct = function() {
    const construction = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    switch (construction) {
        case null:
            return ERR_NOT_FOUND;

        default:
            if (this.build(construction) === ERR_NOT_IN_RANGE) {
                this.moveTo(construction, {
                    visualizePathStyle: {
                        stroke: '#00cc00',
                        opacity: 0.7
                    }
                });
            }
            return OK;
    }
}

// Repair all
Creep.prototype.repairMostDamaged = function() {
    const damagedBuildings = this.room.find(FIND_MY_STRUCTURES, { filter: s => s.hits < s.hitsMax });
    if (damagedBuildings.length > 0) {
        var mostDamagedBuilding = null;

        for (let percentage = 0.0005; percentage <= 1; percentage = percentage + 0.0005) {
            // find building with less than percentage hits
            for (let building of damagedBuildings) {
                if (building.hits / building.hitsMax < percentage) {
                    mostDamagedBuilding = building;

                    break;
                }
            }
            if (mostDamagedBuilding != null) { break; }
        }
        // if there is a match
        switch (mostDamagedBuilding) {
            case null:
                return ERR_NOT_FOUND;

            default:
                if (this.repair(mostDamagedBuilding) === ERR_NOT_IN_RANGE) {
                    this.moveTo(mostDamagedBuilding, {
                        visualizePathStyle: {
                            stroke: '#00cc00',
                            opacity: 0.7
                        }
                    });
                }
                return OK;
        }

    } else {
        return ERR_NOT_FOUND;
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
            return ERR_NOT_FOUND;

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
            return ERR_NOT_FOUND;

        default:
            if (this.transfer(depletedTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(depletedTower, {
                    visualizePathStyle: {
                        stroke: '#00cc00',
                        opacity: 0.7
                    }
                });
            }
            return OK;
    }
}

Creep.prototype.chargeStorage = function() {
    const storage = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: s =>
            (s.structureType == STRUCTURE_STORAGE &&
                s.store[RESOURCE_ENERGY] <
                s.store.getCapacity(RESOURCE_ENERGY) / 2)
    });

    switch (storage) {
        case null:
            return ERR_NOT_FOUND;

        default:
            if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(storage);
            }
            return OK;
    }
}

Creep.prototype.chargeLink = function(linkID) {
    let link = linkID
    if (linkID === undefined) {
        link = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: s =>
                s.structureType === STRUCTURE_LINK
        })
    } else { link = Game.getObjectById(linkID); }
    switch (link) {
        case null:
            return ERR_NOT_FOUND;

        default:
            if (this.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                this.moveTo(link);
            }
            break;
    }
}
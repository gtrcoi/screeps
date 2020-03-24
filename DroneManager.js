module.exports = {
    // Run the role for the Worker creep
    runRole: function(creep) {
        const creepCarry = creep.carry.energy;
        const creepCarryCapacity = creep.carryCapacity;

        // Cases for switching states
        if (creep.memory.working && creepCarry === 0) {
            creep.memory.working = false;
        } else if (!creep.memory.working && creepCarry === creepCarryCapacity) {
            creep.memory.working = true;
        }

        // Run the creep
        if (creep.memory.working) {
            switch (creep.memory.role) {
                case "harvester":
                    // Creep is working, find closest spawn and transfer energy
                    const spawn = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: s =>
                            (s.structureType == STRUCTURE_EXTENSION &&
                                s.store[RESOURCE_ENERGY] <
                                s.store.getCapacity(RESOURCE_ENERGY)) ||
                            (s.structureType == STRUCTURE_SPAWN &&
                                s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY))
                    });
                    if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                    // If room energy is full
                    if (spawn === null) {
                        // Upgrade controller
                        const controller = creep.room.controller;
                        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller);
                        }
                    }
                    break;
                case "worker":
                    // Creep is working, find closest controller and transfer energy
                    const controller = creep.room.controller;
                    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller, {
                            visualizePathStyle: {
                                opacity: 0.7
                            }
                        });
                    }
                    break;
                case "builder":
                    const construction = creep.pos.findClosestByPath(
                        FIND_CONSTRUCTION_SITES
                    );
                    const damagedBuildings = creep.room.find(
                        FIND_STRUCTURES, {
                            filter: s =>
                                s.hits <= s.hitsMax
                        }
                    );
                    const damagedRoads = creep.pos.findClosestByPath(
                        FIND_STRUCTURES, {
                            filter: s =>
                                s.hits < s.hitsMax / 2 && s.structureType === STRUCTURE_ROAD
                        }
                    );
                    // console.log(damagedRoads);
                    // thPion's percentage loop
                    var mostDamagedBuilding = undefined;

                    // loop with increasing percentages
                    for (let percentage = 0.0005; percentage <= 1; percentage = percentage + 0.0005) {
                        // find building with less than percentage hits
                        for (let building of damagedBuildings) {
                            if (building.hits / building.hitsMax < percentage) {
                                mostDamagedBuilding = building;
                                break;
                            }
                        }
                        // if there is a match
                        if (mostDamagedBuilding != undefined) {
                            break;
                        }
                    }
                    // console.log(damagedRoads)
                    // console.log(damagedBuildings);
                    if (creep.build(construction) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction, {
                            visualizePathStyle: {
                                stroke: '#00cc00',
                                opacity: 0.7
                            }
                        });
                    } else if (
                        construction == null &&
                        creep.repair(damagedRoads) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(damagedRoads, {
                            visualizePathStyle: {
                                stroke: '#00cc00',
                                opacity: 0.7
                            }
                        });
                    } else if (
                        construction == null &&
                        damagedRoads == null &&
                        creep.repair(mostDamagedBuilding) === ERR_NOT_IN_RANGE
                    ) {
                        creep.moveTo(mostDamagedBuilding, {
                            visualizePathStyle: {
                                stroke: '#00cc00',
                                opacity: 0.7
                            }
                        });
                    }
                    // If there's nothing to do
                    else if (
                        construction == null &&
                        damagedRoads == null &&
                        mostDamagedBuilding == undefined
                    ) {
                        // Upgrade controller
                        const controller = creep.room.controller;
                        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller, {
                                visualizePathStyle: {
                                    opacity: 0.7
                                }
                            });
                        }
                    }
                    break;
                default:
                    // console.log("Error WorkerManager.runRole: memory role = " = creep.memory.role)
                    break;
            }
        } else { // Find Energy
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            switch (creep.memory.role) {
                case "worker":
                    let tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (t) => t.store[RESOURCE_ENERGY] > 0 });
                    //let droppedSource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                    // Move to Dropped Source
                    if (creep.pickup(droppedSource) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedSource, {
                            visualizePathStyle: {
                                stroke: '#ffff66',
                                opacity: 0.7
                            }
                        });
                    }
                    // Move to Tombstone 
                    else if (tombstone != null && creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstone, {
                            visualizePathStyle: {
                                stroke: '#ffff66',
                                opacity: 0.7
                            }
                        });
                    }
                    // Move to Soure 
                    else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {
                            visualizePathStyle: {
                                stroke: '#ffff66',
                                opacity: 0.7
                            }
                        });
                    }
                    break;

                default:
                    // Creep is not working, get energy from source
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {
                            visualizePathStyle: {
                                stroke: '#ffff66',
                                opacity: 0.7
                            }
                        });
                    }
                    break;
            }
        }
    }
};
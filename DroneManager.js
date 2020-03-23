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
                        creep.moveTo(controller);
                    }
                    break;
                case "builder":
                    const construction = creep.pos.findClosestByPath(
                        FIND_CONSTRUCTION_SITES
                    );
                    const damagedBuildings = creep.pos.findClosestByPath(
                        FIND_STRUCTURES, {
                            filter: s =>
                                s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                        }
                    );
                    // console.log(damagedBuildings);
                    if (creep.build(construction) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction);
                    } else if (
                        creep.build(construction) == ERR_INVALID_TARGET &&
                        creep.repair(damagedBuildings) === ERR_NOT_IN_RANGE
                    ) {
                        creep.moveTo(damagedBuildings);
                    }
                    // If there's nothing to do
                    if (construction === null && damagedBuildings === null) {
                        // Upgrade controller
                        const controller = creep.room.controller;
                        if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(controller);
                        }
                    }
                    break;
                default:
                    // console.log("Error WorkerManager.runRole: memory role = " = creep.memory.role)
                    break;
            }
        } else {
            // Creep is not working, get energy from source
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};
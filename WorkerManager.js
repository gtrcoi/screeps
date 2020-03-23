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
                    const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                    if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
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
                    if (creep.build(construction) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(construction);
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
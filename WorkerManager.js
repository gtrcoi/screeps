module.exports = {

    // Run the role for the Worker creep

    runRole: function(creep) {

        const creepCarry = creep.store[RESOURCE_ENERGY];
        const creepCarryCapacity = creep.store.getCapacity();

        // Cases for switching states

        if (creep.memory.working && creepCarry === 0) {
            creep.memory.working = false;
        } else if (!creep.memory.working && creepCarry === creepCarryCapacity) {
            creep.memory.working = true;
        }

        // Run the creep

        if (creep.memory.working) {

            // Creep is working, find the closest spawn and transfer energy

            const controller = creep.room.controller;

            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }

        } else {

            // Creep is not working, get energy from the source

            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {
                    visualizePathStyle: {
                        stroke: '#ffff4d',
                        opacity: 0.7
                    }
                });
            }

        }
    }
}
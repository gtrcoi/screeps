require('./DronePrototypes');

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
                    const harvesterOperations = [
                        // creep.rechargeTower(),
                        // creep.repairRoad(),
                        // creep.construct(),
                        // creep.repairMostDamaged(),
                        // creep.chargeController()
                        creep.chargeSpawn()
                    ];

                    for (operation in harvesterOperations) {
                        if (operation != null) {
                            break;
                        }
                    }
                    break;

                case "worker":
                    const workerOperations = [
                        // creep.rechargeTower(),
                        // creep.repairRoad(),
                        // creep.construct(),
                        // creep.repairMostDamaged(),
                        creep.chargeController()
                    ];

                    for (operation in workerOperations) {
                        if (operation != null) {
                            break;
                        }
                    }
                    break;

                case "builder":
                    let builderOperations = [
                        creep.rechargeTower(),
                        creep.repairRoad(),
                        creep.construct(),
                        creep.repairMostDamaged(),
                        // creep.chargeController()
                    ];

                    for (operation in builderOperations) {
                        if (operation != null) {
                            break;
                        }
                    }
                    break;

                default:
                    break;
            }
        } else { // Find Energy
            switch (creep.memory.role) {
                case "worker":
                    let workerOperations = [
                        creep.collectDroppedSource(),
                        creep.withdrawTombstone(),
                        creep.collectRuin(),
                        creep.harvestSource()
                    ];

                    for (operation in workerOperations) {
                        if (operation != null) {
                            break;
                        }
                    }

                    break;

                case "builder":
                    let builderOperations = [
                        creep.collectDroppedSource(),
                        creep.withdrawTombstone(),
                        creep.collectRuin(),
                        creep.harvestSource()
                    ];

                    for (operation in builderOperations) {
                        if (operation != null) {
                            break;
                        }
                    }
                    break;

                default:
                    creep.harvestSource();
                    break;
            }
        }
    }
};
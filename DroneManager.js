require('./DronePrototypes');

module.exports = {
    // Run the role for all drones
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
            switch (creep.memory.role) {
                case "harvester":
                    const harvesterOperations = [
                        function() { return creep.chargeSpawn() },
                        function() { return creep.repairRoad() },
                        function() { return creep.construct() },
                        function() { return creep.repairMostDamaged() },
                        function() { return creep.chargeController() }

                    ];

                    for (key = 0; key < harvesterOperations.length; key++) {
                        if (harvesterOperations[key]() == OK) {
                            break;
                        }
                    }
                    break;

                case "worker":
                    let workerOperations = [
                        function() { return creep.chargeController() },
                        function() { return creep.rechargeTower() },
                        function() { return creep.repairRoad() },
                        function() { return creep.construct() },
                        function() { return creep.repairMostDamaged() }
                    ];

                    for (key = 0; key < workerOperations.length; key++) {
                        if (workerOperations[key]() == OK) {
                            break;
                        }
                    }

                    break;

                case "builder":

                    let builderOperations = [
                        function() { return creep.rechargeTower() },
                        function() { return creep.repairRoad() },
                        function() { return creep.construct() },
                        function() { return creep.repairMostDamaged() },
                        function() { return creep.chargeController() }
                    ];
                    for (key = 0; key < builderOperations.length; key++) {
                        if (builderOperations[key]() == OK) {
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
                        function() { return creep.collectDroppedSource() },
                        function() { return creep.withdrawTombstone() },
                        function() { return creep.collectRuin() },
                        function() { return creep.harvestSource() }
                    ];

                    for (key = 0; key < workerOperations.length; key++) {
                        if (workerOperations[key]() == OK) {
                            break;
                        }
                    }

                    break;

                case "builder":
                    let builderOperations = [
                        function() { return creep.collectDroppedSource() },
                        function() { return creep.withdrawTombstone() },
                        function() { return creep.collectRuin() },
                        function() { return creep.harvestSource() }
                    ];

                    for (key = 0; key < builderOperations.length; key++) {
                        if (builderOperations[key]() == OK) {
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
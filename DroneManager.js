require('./DronePrototypes');

module.exports = {
    // Run the role for all drones
    runRole: function(creep) {
        const creepCarry = creep.store[RESOURCE_ENERGY];
        const creepCarryCapacity = creep.store.getCapacity();
        let operations = [];

        // Cases for switching states
        if (creep.memory.working && creepCarry === 0) {
            creep.memory.working = false;
        } else if (!creep.memory.working && creepCarry === creepCarryCapacity) {
            creep.memory.working = true;
        }

        // Run the creep
        if (creep.memory.working) {

            // If hostile creep present
            if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0) {
                switch (creep.memory.role) {
                    case "harvester":
                        const harvesterOperations = [
                            function() { return creep.chargeSpawn() },
                            function() { return creep.construct() },
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
                            function() { return creep.construct() },
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
                            function() { return creep.construct() },
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
            } else {
                switch (creep.memory.role) {
                    case "harvester":
                        operations = [
                            function() { return creep.chargeSpawn() },
                            function() { return creep.chargeStorage() },
                            function() { return creep.repairRoad() },
                            function() { return creep.construct() },
                            function() { return creep.repairMostDamaged() },
                            function() { return creep.chargeController() }

                        ];

                        for (key = 0; key < operations.length; key++) {
                            if (operations[key]() == OK) {
                                break;
                            }
                        }
                        break;

                    case "worker":
                        operations = [
                            function() { return creep.chargeSpawn() },

                            function() { return creep.chargeController() },
                            function() { return creep.rechargeTower() },
                            function() { return creep.repairRoad() },
                            function() { return creep.construct() },
                            function() { return creep.repairMostDamaged() }
                        ];

                        for (key = 0; key < operations.length; key++) {
                            if (operations[key]() == OK) {
                                break;
                            }
                        }
                        break;

                    case "builder":
                        operations = [
                            function() { return creep.chargeSpawn() },
                            function() { return creep.rechargeTower(50) },
                            function() { return creep.repairRoad() },
                            function() { return creep.construct() },
                            function() { return creep.rechargeTower() },
                            function() { return creep.repairMostDamaged() },
                            function() { return creep.chargeController() }
                        ];
                        for (key = 0; key < operations.length; key++) {
                            if (operations[key]() == OK) {
                                break;
                            }
                        }
                        break;

                    case "digger":
                        creep.chargeLink(creep.memory.linkID);
                        break;

                    case "crane":
                        creep.chargeStorage();
                        break;

                    default:
                        break;
                }
            }

        } else { // Find Energy

            // If hostile creep present
            if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0) {
                switch (creep.memory.role) {
                    case "builder":
                    case "worker":
                    case "harvester":
                        operations = [
                            function() { return creep.collectRuin() },
                            function() { return creep.harvestSource() }
                        ];

                        for (key = 0; key < operations.length; key++) {

                            if (operations[key]() == OK) {
                                break;
                            }
                        }
                        break;

                    case "crane":
                        creep.collectLink();
                        break;

                    default:
                        break;
                }

            } else {
                switch (creep.memory.role) {
                    case "builder":
                    case "worker":
                        operations = [
                            function() { return creep.collectStorage() },
                            function() { return creep.collectDroppedSource() },
                            function() { return creep.withdrawTombstone() },
                            function() { return creep.collectRuin() }
                        ];
                        if (creep.room.memory.spawnLimits.digger === 0) {
                            operations.push(function() { return creep.harvestSource() })
                        }
                        for (key = 0; key < operations.length; key++) {

                            if (operations[key]() == OK) {
                                break;
                            }
                        }
                        break;

                    case "harvester":
                        operations = [
                            function() { return creep.collectDroppedSource() },
                            function() { return creep.withdrawTombstone() },
                            function() { return creep.collectRuin() },
                            function() { return creep.harvestSource() }
                        ];

                        for (key = 0; key < operations.length; key++) {

                            if (operations[key]() == OK) {
                                break;
                            }
                        }
                        break;

                    case "digger":
                        operations = [
                            function() { return creep.harvestSource(creep.memory.sourceID) },
                            function() { return creep.collectContainer(2) }
                        ]
                        if (creep.memory.containerID !== undefined && !_.isEqual(creep.pos, Game.getObjectById(creep.memory.containerID).pos)) {
                            operations.unshift(function() { return creep.moveTo(Game.getObjectById(creep.memory.containerID)) })
                        }
                        for (key = 0; key < operations.length; key++) {

                            if (operations[key]() == OK) {
                                console.log(key)
                                break;
                            }
                        }
                        break;

                    case "crane":
                        creep.collectLink();
                        break;

                    default:
                        break;
                }

            }
        }
    }
};
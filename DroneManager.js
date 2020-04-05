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

                case "upgrader":
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


        } else { // Find Energy
            switch (creep.memory.role) {
                case "builder":
                case "upgrader":
                    operations = [
                        function() { return creep.collectDroppedSource() },
                        function() { return creep.withdrawTombstone() },
                        function() { return creep.collectRuin() },
                        function() { return creep.collectStorage() }
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
};
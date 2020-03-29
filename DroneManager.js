require('./DronePrototypes');

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
            switch (creep.memory.role) {
                case "harvester":
                    const harvesterOperations = [
                        creep.chargeSpawn()
                        // creep.rechargeTower(),
                        // creep.repairRoad(),
                        // creep.construct(),
                        // creep.repairMostDamaged(),
                        // creep.chargeController()

                    ];

                    for (key in harvesterOperations) {
                        // console.log("Harvester: " + operation)
                        let operation = harvesterOperations[key];
                        if (operation != null) {
                            break;
                        }
                    }
                    break;

                case "worker":
                    let workerOperations = [
                        // function() { creep.rechargeTower() },
                        // function() { creep.repairRoad() },
                        // function() { creep.construct() },
                        // function() { creep.repairMostDamaged() }
                        function() { creep.chargeController() }
                    ];

                    for (key = 0; key < workerOperations.length; key++) {
                        if (workerOperations[key]() == undefined) {
                            break;
                        }
                    }

                    break;

                case "builder":
                    // https://stackoverflow.com/questions/4908378/javascript-array-of-functions
                    let builderOperations = [
                        function() { creep.rechargeTower() },
                        function() { creep.repairRoad() },
                        function() { creep.construct() },
                        function() { creep.repairMostDamaged() }
                        // function() { creep.chargeController() }
                    ];

                    for (key = 0; key < builderOperations.length; key++) {

                        console.log(builderOperations[key]());
                        // if (console.log(builderOperations[key]()) == undefined) {
                        //     console.log("Break")
                        //     break;
                        // }
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
                            // console.log("breaking: " + operation)
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
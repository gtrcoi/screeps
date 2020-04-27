require('./DronePrototypes');

module.exports = {
    // Run the role for all drones
    runRole: function(creep) {
        let operations = [];

        switch (creep.memory.role) {
            case "builder":
            case "upgrader":
            case "harvester":
            case "digger":

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
                            operations = [
                                function() { return creep.chargeSpawn() },
                                function() { return creep.chargeStorage() },
                                function() { return creep.repairRoad({ percent: 50 }) },
                                function() { return creep.repairContainer() },
                                function() { return creep.repairMostDamaged() }

                            ];

                            for (key = 0; key < operations.length; key++) {
                                if (operations[key]() == OK) {
                                    break;
                                }
                            }
                            break;

                        case "upgrader":
                            operations = [
                                function() { return creep.chargeController() },
                                function() { return creep.rechargeTower() },
                                function() { return creep.repairRoad({ percent: 50 }) },
                                function() { return creep.construct() },
                                function() { return creep.repairMostDamaged() }
                            ];

                            if (creep.room.memory.creepCount.builder === 0 && creep.room.memory.creepCount.harvester === 0) {
                                operations.unshift(function() { return creep.chargeSpawn() })
                            }

                            for (let key = 0; key < operations.length; key++) {
                                if (operations[key]() == OK) {
                                    break;
                                }
                            }
                            break;

                        case "builder":
                            operations = [
                                function() { return creep.rechargeTower({ percent: 50 }) },
                                function() { return creep.chargeSpawn() },
                                function() { return creep.repairRoad({ percent: 50 }) },
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
                            // check is crane is spawning
                            let craneSpawning;
                            let spawnArray = creep.room.find(FIND_MY_SPAWNS, { filter: s => s.spawning != null });
                            for (i = 0; i < spawnArray.length; i++) {
                                let spawn = spawnArray[i];
                                if (/crane\w/.test(spawn.spawning.name)) {
                                    craneSpawning = true;
                                }
                            }
                            if (creep.room.find(FIND_MY_CREEPS, { filter: c => c.memory.role === "crane" }).length === 0 &&
                                !craneSpawning) {
                                creep.chargeSpawn();
                            } else {
                                creep.chargeLink(creep.memory.linkID);
                            }
                            break;

                        default:
                            break;
                    }


                } else { // Find Energy
                    switch (creep.memory.role) {
                        case "builder":
                            operations = [
                                function() { return creep.collectDroppedSource() },
                                function() { return creep.withdrawTombstone() },
                                function() { return creep.collectRuin() },
                                function() { return creep.collectStorage() }
                            ];
                            if (creep.room.memory.spawnLimits.digger === 0) {
                                operations.unshift(
                                    function() { return creep.collectContainer() },
                                    function() { return creep.harvestSource() })
                            }
                            for (key = 0; key < operations.length; key++) {

                                if (operations[key]() == OK) {
                                    break;
                                }
                            }
                            break;

                        case "upgrader":
                            operations = [
                                function() { return creep.collectDroppedSource() },
                                function() { return creep.withdrawTombstone() },
                                function() { return creep.collectRuin() },
                                function() { return creep.collectStorage() }
                            ];

                            if (creep.room.memory.spawnLimits.digger === 0) {
                                operations.unshift(
                                    function() { return creep.collectContainer() },
                                    function() { return creep.harvestSource() })
                            }

                            if (creep.room.memory.structures.links.controllerLinkID) {
                                operations.unshift(function() { return creep.collectLink(creep.room.memory.structures.links.controllerLinkID) })
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
                                function() { return creep.collectContainer() },
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
                                function() { return creep.harvestSource(creep.memory.sourceID) }
                            ]
                            if (creep.memory.containerID !== undefined && !creep.pos.isEqualTo(Game.getObjectById(creep.memory.containerID).pos)) {
                                operations.unshift(
                                    function() { return creep.moveTo(Game.getObjectById(creep.memory.containerID)) }
                                )
                            }
                            if (creep.memory.containerID !== undefined) {
                                operations.push(function() { return creep.collectContainer(creep.memory.containerID) })
                            } else {
                                operations.push(function() { return creep.collectDroppedSource(1) })
                            }
                            for (key = 0; key < operations.length; key++) {

                                if (operations[key]() == OK) {
                                    break;
                                }
                            }
                            break;

                        default:
                            break;
                    }
                }

                break;

            case "crane":
                const baseLink = Game.getObjectById(creep.room.memory.structures.links.baseLinkID);
                const controllerLink = Game.getObjectById(creep.room.memory.structures.links.controllerLinkID);
                const pos = new RoomPosition(creep.room.memory.layoutScan.pos.x + 5, creep.room.memory.layoutScan.pos.y + 6, creep.room.name)

                operations = [
                    function() { return creep.chargeStorage() }
                ]

                if (baseLink.store[RESOURCE_ENERGY] > 0) {
                    operations.unshift(function() { return creep.collectLink(creep.room.memory.structures.links.baseLinkID) })
                }
                if (!_.isNull(controllerLink) && controllerLink.store[RESOURCE_ENERGY] < controllerLink.store.getCapacity(RESOURCE_ENERGY) - 100) {
                    operations = [
                        function() { return creep.collectStorage() },
                        function() { return creep.chargeLink(baseLink.id) }
                    ]
                }
                if (!creep.pos.isEqualTo(pos) && pos.lookFor(LOOK_CREEPS).length === 0) {
                    operations.unshift(function() { return creep.moveTo(pos, pos) })
                }
                for (key = 0; key < operations.length; key++) {
                    if (operations[key]() == OK) {
                        break;
                    }
                }
                break;

            default:
                break;
        }

    }
};
module.exports = {
    creepCount: function(room) {
        // Define creep limits for a room
        const diggerLimits = room.memory.structures.links.sourceLinkIDs.length;
        const harvesterLimits = room.find(FIND_SOURCES).length;

        const upgraderLimits = (room.memory.structures.links.controllerLinkID) ? 1 : 2

        const builderLimits = (room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) ? 1 : 0

        const craneLimits = (room.memory.structures.links.baseLinkID) ? 1 : 0

        const loaderLimits = (room.controller.level >= 4) ? Math.floor(room.controller.level / 2) : 0

        // Save to memory
        if (!room.memory.spawnLimits) {
            room.memory.spawnLimits = {};
        }
        const spawnLimits = {
            upgrader: upgraderLimits,
            harvester: harvesterLimits - diggerLimits,
            builder: builderLimits,
            digger: diggerLimits,
            crane: craneLimits,
            loader: loaderLimits
        };
        room.memory.spawnLimits = spawnLimits;

        // Count creeps 
        const upgraderCount = _.filter(
            Game.creeps,
            creep =>
            creep.memory.homeRoom === room.name && creep.memory.role === "upgrader" && (creep.ticksToLive > 51 || creep.spawning)
        ).length;

        const harvesterCount = _.filter(
            Game.creeps,
            creep =>
            creep.memory.homeRoom === room.name && creep.memory.role === "harvester" && (creep.ticksToLive > 51 || creep.spawning)
        ).length;

        const builderCount = _.filter(
            Game.creeps,
            creep =>
            creep.memory.homeRoom === room.name && creep.memory.role === "builder" && (creep.ticksToLive > 51 || creep.spawning)
        ).length;

        const craneCount = _.filter(
            Game.creeps,
            creep =>
            creep.memory.homeRoom === room.name && creep.memory.role === "crane" && (creep.ticksToLive > 51 || creep.spawning)
        ).length;

        const diggerCount = _.filter(
            Game.creeps,
            creep =>
            creep.memory.homeRoom === room.name && creep.memory.role === "digger" && (creep.ticksToLive > 100 || creep.spawning)
        ).length;

        const loaderCount = _.filter(
            Game.creeps,
            creep =>
            creep.memory.homeRoom === room.name && creep.memory.role === "loader" && (creep.ticksToLive > 100 || creep.spawning)
        ).length;

        // Save to memory
        if (!room.memory.creepCount) {
            room.memory.creepCount = {};
        }
        const creepCount = {
            upgrader: upgraderCount,
            harvester: harvesterCount,
            builder: builderCount,
            digger: diggerCount,
            crane: craneCount,
            loader: loaderCount,
            energyCollectors: harvesterCount + diggerCount
        };
        room.memory.creepCount = creepCount;
    },

    setStructures: function(room) {
        if (!room.memory.structures) {
            room.memory.structures = { spawns: [], links: {}, observer: {}, powerSpawn: "", factory: "", nuker: { id: "", target: "" } };
        }
        const structuresMemory = room.memory.structures;
        const structures = room.find(FIND_MY_STRUCTURES);

        // Set up spawns
        const spawns = _.filter(structures, s => s.structureType === STRUCTURE_SPAWN);
        for (let spawn of spawns) {
            if (room.memory.structures.spawns.indexOf(spawn.id) == -1) {
                room.memory.structures.spawns.push(spawn.id);
            }
        }

        // Set up links
        let linksMemoryObject = { sourceLinkIDs: [] };
        const myLinks = _.filter(structures, s => s.structureType === STRUCTURE_LINK);

        for (const key in myLinks) {
            const link = myLinks[key];

            if (link.pos.inRangeTo(room.storage.pos, 2)) {
                linksMemoryObject.baseLinkID = link.id;
            } else if (link.pos.inRangeTo(room.controller.pos, 2)) {
                linksMemoryObject.controllerLinkID = link.id;
            } else {
                const sources = room.find(FIND_SOURCES);
                for (const key in sources) {
                    const source = sources[key];
                    if (link.pos.inRangeTo(source.pos, 2)) {
                        linksMemoryObject.sourceLinkIDs.push(link.id);
                        break;
                    }
                }
            }
        }
        structuresMemory.links = linksMemoryObject;

        // Set up factory
        const factory = _.filter(structures, s => s.structureType === STRUCTURE_FACTORY);
        let factoryID = undefined;
        if (factory.length > 0) { factoryID = factory[0].id }
        structuresMemory.factory = factoryID

        if (room.controller.level === 8) {
            // Set up observer
            const observer = _.filter(structures, s => s.structureType === STRUCTURE_OBSERVER);
            let observerID = undefined;
            if (observer.length > 0) { observerID = observer[0].id }
            structuresMemory.observer = { id: observerID, view: false, satellites: [] }

            // Set up powerSpawn
            const powerSpawn = _.filter(structures, s => s.structureType === STRUCTURE_POWER_SPAWN);
            let powerSpawnID = undefined;
            if (powerSpawn.length > 0) { powerSpawnID = powerSpawn[0].id }
            structuresMemory.powerSpawn = powerSpawnID

            // Set up nuker
            const nuker = _.filter(structures, s => s.structureType === STRUCTURE_NUKER);
            let nukerID = undefined;
            if (nuker.length > 0) { nukerID = nuker[0].id }
            structuresMemory.nuker.id = nukerID
        }
    },

    cleanMemory: function() {
        // Clean Creep memory
        for (let name in Memory.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }
    },

    setRoomMemory: function(room) {
        if (!room.memory.base) {
            room.memory.base = false;
        }
        // Add resource IDs to memory
        if (!room.memory.resources) {
            room.memory.resources = {}

            const terrain = new Room.Terrain(room.name);

            // Add sources
            let sources = room.find(FIND_SOURCES);
            if (sources.length > 0) {
                room.memory.resources.sources = {}
                for (let source of sources) {
                    room.memory.resources.sources[source.id] = {}
                    room.memory.resources.sources[source.id].space = 0
                    let checkPos = [
                        [source.pos.x - 1, source.pos.y - 1],
                        [source.pos.x, source.pos.y - 1],
                        [source.pos.x + 1, source.pos.y - 1],
                        [source.pos.x - 1, source.pos.y],
                        [source.pos.x + 1, source.pos.y],
                        [source.pos.x - 1, source.pos.y + 1],
                        [source.pos.x, source.pos.y + 1],
                        [source.pos.x + 1, source.pos.y + 1],
                    ]
                    for (let pos of checkPos) {
                        if (terrain.get(pos[0], pos[1]) === 0) {
                            room.memory.resources.sources[source.id].space++
                        }
                    }
                }
            }
            // Add minerals
            let minerals = room.find(FIND_MINERALS);
            if (minerals.length > 0) {
                room.memory.resources.minerals = {}
            }
            for (let mineral of minerals) {
                room.memory.resources.minerals[mineral.id] = {}
                room.memory.resources.minerals[mineral.id].space = 0
                let checkPos = [
                    [mineral.pos.x - 1, mineral.pos.y - 1],
                    [mineral.pos.x, mineral.pos.y - 1],
                    [mineral.pos.x + 1, mineral.pos.y - 1],
                    [mineral.pos.x - 1, mineral.pos.y],
                    [mineral.pos.x + 1, mineral.pos.y],
                    [mineral.pos.x - 1, mineral.pos.y + 1],
                    [mineral.pos.x, mineral.pos.y + 1],
                    [mineral.pos.x + 1, mineral.pos.y + 1],
                ]
                for (let pos of checkPos) {
                    if (terrain.get(pos[0], pos[1]) === 0) {
                        room.memory.resources.minerals[mineral.id].space++
                    }
                }
            }
        }
        // Add deposits
        let deposits = room.find(FIND_DEPOSITS);
        if (deposits.length > 0) {
            room.memory.resources.deposits = {}
        }
        for (let deposit of deposits) {
            room.memory.resources.deposits[deposit.id] = {}
        }

        // Add remote resources
        if (!room.memory.remoteResources) {
            room.memory.remoteResources = { sources: [], minerals: [], deposits: [], power: [] }
        }

        if (room.memory.layoutScan.complete && room.memory.base) {
            // Add costMatrix
            if (!room.memory.costMatrix) {
                const bunkerLayout = Object.values(require('./layouts').bunkerLayout(room.memory.layoutScan.pos.x, room.memory.layoutScan.pos.y));
                const bunkerRoads = require('./layouts').bunkerRoadLayout(room.memory.layoutScan.pos.x, room.memory.layoutScan.pos.y);
                const terrain = new Room.Terrain(room.name);

                let costs = new PathFinder.CostMatrix;
                for (let entry of bunkerLayout) {
                    costs.set(entry.pos.x, entry.pos.y, 255)
                }
                for (let road of bunkerRoads) {
                    if (terrain.get(road.x, road.y) !== TERRAIN_MASK_WALL) {
                        costs.set(road.x, road.y, 1);
                    }
                }
                const walls = room.find(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_WALL })
                for (let wall of walls) {
                    costs.set(wall.pos.x, wall.pos.y, 8)
                }
                room.memory.costMatrix = costs.serialize();
            }
        }
    },

    viewSatellites: function(room) {
        room.memory.observer = undefined
        let satellites = room.memory.structures.observer.satellites
        let observerArray = []

        // Add exits to checklist
        const exits = Object.values(Game.map.describeExits(room.name));
        for (exit of exits) {
            observerArray.push(exit);
        }

        // add rooms further out until path is no longer feasible
        let xCord;
        let yCord;

        room.memory.structures.observer.view = false;
    },

    findRepairs: function(room) {
        if (!room.memory.structures.repairs) {
            room.memory.structures.repairs = { mostDamagedStructure: {}, mostDamagedWall: {}, mostDamagedRoad: {}, mostDamagedContainer: {} }
        }

        function repairIterator(objectArray, opts) {
            if (!_.isArray(objectArray)) { return ERR_INVALID_ARGS; }
            opts = opts || {}

            if (_.isUndefined(opts.percentage)) {
                opts.percentage = 0.0001
            }

            const objects = objectArray

            if (objects.length > 0) {
                let returnObject = { id: null, percent: 0 }

                // find object with less than hits than percentage
                for (let percentage = opts.percentage; percentage <= 1; percentage = percentage + opts.percentage) {

                    for (let element of objects) {
                        if (element.hits / element.hitsMax < percentage) {
                            returnObject.id = element.id;
                            returnObject.percent = percentage;
                            return returnObject;
                        }
                    }
                }
            } else { return ERR_NOT_FOUND; }
        }

        // Owned Structure repairs
        const mostDamagedStructureMemory = room.memory.structures.repairs.mostDamagedStructure;
        const mostDamagedStructureLT = Game.getObjectById(mostDamagedStructureMemory.id);

        // Check if new target is required
        if (_.isNull(mostDamagedStructureLT) || mostDamagedStructureLT.hits / mostDamagedStructureLT.hitsMax > mostDamagedStructureMemory.percent) {
            const damagedStructures = room.find(FIND_MY_STRUCTURES, { filter: s => s.hits < s.hitsMax });
            const mostDamagedStructure = repairIterator(damagedStructures, { percentage: 0.0001 });

            if (!_.isObject(mostDamagedStructure)) {
                mostDamagedStructureMemory.id = undefined;
                mostDamagedStructureMemory.percent = undefined;
            } else {
                mostDamagedStructureMemory.id = mostDamagedStructure.id;
                mostDamagedStructureMemory.percent = mostDamagedStructure.percent;
            }
        }

        // Neutral structure repairs
        const damagedStructures = room.find(FIND_STRUCTURES, { filter: s => s.hits < s.hitsMax });

        // Wall Repairs
        const mostDamagedWallMemory = room.memory.structures.repairs.mostDamagedWall;
        const mostDamagedWallLT = Game.getObjectById(mostDamagedWallMemory.id);
        // Check if new target is required
        if (_.isNull(mostDamagedWallLT) || mostDamagedWallLT.hits / mostDamagedWallLT.hitsMax > mostDamagedWallMemory.percent) {
            const damagedWalls = _.filter(damagedStructures, s => s.structureType === STRUCTURE_WALL)
            const mostDamagedWall = repairIterator(damagedWalls)

            if (!_.isObject(mostDamagedWall)) {
                mostDamagedWallMemory.id = undefined;
                mostDamagedWallMemory.percent = undefined;
            } else {
                mostDamagedWallMemory.id = mostDamagedWall.id;
                mostDamagedWallMemory.percent = mostDamagedWall.percent
            }

        }

        // Road Repairs
        const mostDamagedRoadMemory = room.memory.structures.repairs.mostDamagedRoad;
        const mostDamagedRoadLT = Game.getObjectById(mostDamagedRoadMemory.id);
        // Check if new target is required
        if (_.isNull(mostDamagedRoadLT) || mostDamagedRoadLT.hits / mostDamagedRoadLT.hitsMax > mostDamagedRoadMemory.percent) {
            const damagedRoads = _.filter(damagedStructures, s => s.structureType === STRUCTURE_ROAD)
            const mostDamagedRoad = repairIterator(damagedRoads, { percentage: 0.01 })
            if (!_.isObject(mostDamagedRoad)) {
                mostDamagedRoadMemory.id = undefined;
                mostDamagedRoadMemory.percent = undefined;
            } else {
                mostDamagedRoadMemory.id = mostDamagedRoad.id;
                mostDamagedRoadMemory.percent = mostDamagedRoad.percent
            }
        }

        // Container Repairs
        const mostDamagedContainerMemory = room.memory.structures.repairs.mostDamagedContainer;
        const mostDamagedContainerLT = Game.getObjectById(mostDamagedContainerMemory.id);
        // Check if new target is required
        if (_.isNull(mostDamagedContainerLT) || mostDamagedContainerLT.hits / mostDamagedContainerLT.hitsMax > mostDamagedContainerMemory.percent) {
            const damagedContainers = _.filter(damagedStructures, s => s.structureType === STRUCTURE_CONTAINER)
            const mostDamagedContainer = repairIterator(damagedContainers, { percentage: 0.01 })
            if (!_.isObject(mostDamagedContainer)) {
                mostDamagedContainerMemory.id = undefined;
                mostDamagedContainerMemory.percent = undefined;
            } else {
                mostDamagedContainerMemory.id = mostDamagedContainer.id;
                mostDamagedContainerMemory.percent = mostDamagedContainer.percent
            }
        }
    }
}
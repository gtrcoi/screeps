module.exports = {
    setSpawnLimits: function(room) {
        // Define the limits for a room
        const upgraderLimits = 1;
        const diggerLimits = room.memory.structures.links.sourceLinkIDs.length;
        const harvesterLimits = room.find(FIND_SOURCES).length;

        let builderLimits = 1;
        if (room.find(FIND_MY_CONSTRUCTION_SITES).length >= 10) {
            builderLimits = 2;
        }

        let craneLimits = 0
        if (room.memory.structures.links.baseLinkID) {
            craneLimits = 1;
        }

        // Set the property in memory if it doesn't exist
        if (!room.memory.spawnLimits) {
            room.memory.spawnLimits = {};
        }

        // Set the limits in the room memory
        const spawnLimits = {
            upgrader: upgraderLimits,
            harvester: harvesterLimits - diggerLimits,
            builder: builderLimits,
            digger: diggerLimits,
            crane: craneLimits
        };
        room.memory.spawnLimits = spawnLimits;
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
            } else {
                const sources = room.find(FIND_SOURCES);
                for (const key in sources) {
                    const source = sources[key];
                    if (link.pos.inRangeTo(source.pos, 2)) {
                        linksMemoryObject.sourceLinkIDs.push(link.id);
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
        if (!room.memory.layoutScan) {
            room.memory.layoutScan = { pos: { x: 0, y: 0 }, complete: false };
        }
        if (!room.memory.base) {
            room.memory.base = false;
        }
        // Add resource IDs to memory
        if (!room.memory.resources) {
            room.memory.resources = {}
                // Add sources
            let sources = room.find(FIND_SOURCES);
            if (sources.length > 0) {
                room.memory.resources.sources = []
                for (let source of sources) {
                    room.memory.resources.sources.push(source.id)
                }
            }
            // Add minerals
            let minerals = room.find(FIND_MINERALS);
            if (minerals.length > 0) {
                room.memory.resources.minerals = []
            }
            for (let mineral of minerals) {
                room.memory.resources.minerals.push(mineral.id)
            }
        }
        // Add deposits
        let deposits = room.find(FIND_DEPOSITS);
        if (deposits.length > 0) {
            room.memory.resources.deposits = []
        }
        for (let deposit of deposits) {
            room.memory.resources.deposits.push(deposit.id)
        }

        // Add exits
        if (!room.memory.remoteResources) {
            room.memory.remoteResources = { sources: [], minerals: [], deposits: [], power: [] }
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
    }
}
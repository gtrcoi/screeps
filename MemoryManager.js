module.exports = {
    setSpawnLimits: function(room) {
        // Define the limits for a room
        const upgraderLimits = 2;
        const diggerLimits = room.memory.links.sourceLinkIDs.length;
        const harvesterLimits = room.find(FIND_SOURCES).length;

        let builderLimits = 1;
        if (room.find(FIND_MY_CONSTRUCTION_SITES).length > 10) {
            builderLimits = 2;
        }

        let craneLimits = 0
        if (room.memory.links.baseLinkID) {
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

    setLinkIDs: function(room) {
        if (!room.memory.links) {
            room.memory.links = {};
        }
        let links = { sourceLinkIDs: [] };
        const myLinks = _.filter(room.find(FIND_MY_STRUCTURES), s => s.structureType === STRUCTURE_LINK);

        for (const key in myLinks) {
            const link = myLinks[key];

            // console.log(room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_STORAGE })[0].pos)
            if (link.pos.inRangeTo(room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType === STRUCTURE_STORAGE })[0].pos, 2)) {
                links.baseLinkID = link.id;
            } else {
                const sources = room.find(FIND_SOURCES);
                for (const key in sources) {
                    const source = sources[key];
                    if (link.pos.inRangeTo(source.pos, 2)) {
                        links.sourceLinkIDs.push(link.id);
                    }
                }
            }

        }
        room.memory.links = links;
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
        if (!room.memory.build) {
            room.memory.build = false;
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


        // else {
        //   if (room.memory.build = false){
        // Memory.global.
        //   }
        // }

    }
}
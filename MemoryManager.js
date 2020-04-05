module.exports = {
    setSpawnLimits: function(room) {
        // Define the limits for a room
        const upgraderLimits = 1;
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
        const links = { sourceLinkIDs: [] };
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
    }
}
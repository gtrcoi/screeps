module.exports = {

    buildRamparts: function(room) {

        var rampartBuildings = room.find(FIND_MY_STRUCTURES, {
            filter: (b) =>
                b.structureType === STRUCTURE_CONTAINER ||
                b.structureType === STRUCTURE_EXTENSION ||
                b.structureType === STRUCTURE_SPAWN ||
                b.structureType === STRUCTURE_STORAGE ||
                b.structureType === STRUCTURE_TOWER ||
                b.structureType === STRUCTURE_LAB ||
                b.structureType === STRUCTURE_TERMINAL ||
                b.structureType === STRUCTURE_FACTORY
        });

        for (const key in rampartBuildings) {
            let building = rampartBuildings[key];
            if (building.pos.lookFor(LOOK_STRUCTURES, { filter: (b) => b.structureType === STRUCTURE_RAMPART }).length != 0) {
                room.createConstructionSite(building.pos, STRUCTURE_RAMPART);
            }

        }
    },

    // Rebuild base from ruins
    rebuild: function(room) {
        const ruins = room.find(FIND_RUINS, { filter: r => r.ticksToDecay > 500 });
        const myBuildings = room.find(FIND_MY_STRUCTURES);
        const myFlags = room.find(FIND_FLAGS);

        // Construct on ruins
        for (key in ruins) {
            let ruin = ruins[key];
            if (ruin.structure.structureType != STRUCTURE_RAMPART &&
                ruin.pos.lookFor(LOOK_STRUCTURES, { filter: s => s.structureType === ruin.structure.structureType }.length === 0 &&
                    ruin.pos.lookFor(LOOK_CONSTRUCTION_SITES, { filter: c => c.structureType === ruin.structure.structureType }).length === 0)
            ) {
                room.createConstructionSite(ruin.pos, ruin.structure.structureType)

                // Place flags where construction impossible
                if (ruin.pos.lookFor(LOOK_FLAGS).length === 0 &&
                    ruin.pos.lookFor(LOOK_STRUCTURES, { filter: s => s.structureType == ruin.structure.structureType }).length === 0 &&
                    room.createConstructionSite(ruin.pos, ruin.structure.structureType != OK)) {
                    room.createFlag(ruin.pos, (ruin.structure.structureType + Game.time));
                };
            };
        };

        // Clean up placeholder flags
        for (key in myBuildings) {
            let building = myBuildings[key];
            let placeholderFlag = building.pos.lookFor(LOOK_FLAGS);
            if (placeholderFlag.length > 0) {
                placeholderFlag[0].remove();
            }
        }
    }
}
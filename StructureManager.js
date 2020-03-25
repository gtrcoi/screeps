module.exports = {

    buildRamparts: function(room) {

        var rampartBuildings = room.find(FIND_MY_STRUCTURES, {
            filter: (b) =>
                b.structureType === STRUCTURE_CONTAINER ||
                b.structureType === STRUCTURE_EXTENSION ||
                b.structureType === STRUCTURE_SPAWN ||
                b.structureType === STRUCTURE_STORAGE
        });

        for (const key in rampartBuildings) {
            let building = rampartBuildings[key];
            if (building.pos.lookFor(LOOK_STRUCTURES, { filter: (b) => b.structureType === STRUCTURE_RAMPART }).length != 0) {
                room.createConstructionSite(building.pos, STRUCTURE_RAMPART);
            }

        }
    },

    rebuild: function(room) {
        const ruins = room.find(FIND_RUINS);
        const myBuildings = room.find(FIND_MY_STRUCTURES);

        for (key in ruins) {
            let ruin = ruins[key];
            if (ruin.structure.structureType != STRUCTURE_RAMPART) {
                room.createConstructionSite(ruin.pos, ruin.structure.structureType)
                    // console.log(ruin.pos + " " + room.createConstructionSite(ruin.pos, ruin.structure.structureType) + " " + ruin.pos.lookFor(LOOK_FLAGS).length)

                // Placeholder flags
                if (ruin.pos.lookFor(LOOK_FLAGS).length === 0 &&
                    ruin.pos.lookFor(LOOK_STRUCTURES, { filter: s => s.structureType == ruin.structure.structureType }).length == 0 &&
                    room.createConstructionSite(ruin.pos, ruin.structure.structureType === ERR_RCL_NOT_ENOUGH)) {

                    room.visual.circle(ruin.pos, { opacity: 1, fill: '#ff3300' });
                    room.createFlag(ruin.pos, (ruin.structure.structureType + Game.time));
                    // console.log(ruin.pos.lookFor(LOOK_FLAGS).length)
                };
            };
        };
        for (key in myBuildings) {
            let building = myBuildings[key];
            let placeholderFlag = building.pos.lookFor(LOOK_FLAGS);
            if (placeholderFlag.length > 0) {
                placeholderFlag[0].remove();
            }
        }
    }
}
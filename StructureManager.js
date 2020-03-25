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
    }
}
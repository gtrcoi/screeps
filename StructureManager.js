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
    },

    scanLayout: function(room) {
        const layouts = require('./layouts');
        const terrain = new Room.Terrain(room.name)
        const structureLayout = layouts.structureLayout(room);

        let = structureLayoutArray = Object.values(structureLayout);

        for (let key in structureLayoutArray) {
            const pos = structureLayoutArray[key].pos;

            switch (terrain.get(pos.x, pos.y)) {
                case TERRAIN_MASK_WALL:
                    room.visual.circle(pos, {
                        fill: 'red'
                    });
                    break;

                default:
                    room.visual.circle(pos, {
                        fill: 'green'
                    });
                    // if loop is on last value and succeeds scan is complete
                    if (key == structureLayoutArray.length - 1) {
                        room.memory.layoutScan.complete = true;
                    }
                    continue;
            }
            if (room.memory.layoutScan.pos.x < 49 - 12) {
                room.memory.layoutScan.pos.x++;
            } else {
                room.memory.layoutScan.pos.y++;
                room.memory.layoutScan.pos.x = 0;
            }

            break;
        }
    }
}
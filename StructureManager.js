module.exports = {

    buildBunker: function(room) {
        const startX = room.memory.layoutScan.pos.x;
        const startY = room.memory.layoutScan.pos.y;
        const structureLayout = require('./layouts').bunkerLayout(startX, startY);
        const roadLayout = require('./layouts').bunkerRoadLayout(startX, startY);
        const terrain = new Room.Terrain(room.name);

        for (let key in structureLayout) {
            const x = structureLayout[key].pos.x;
            const y = structureLayout[key].pos.y;
            const s = structureLayout[key].structureType;
            room.createConstructionSite(x, y, s)
        }

        for (let key in roadLayout) {
            const x = roadLayout[key].x;
            const y = roadLayout[key].y;

            if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                room.createConstructionSite(x, y, STRUCTURE_ROAD)
            }
        }
    },

    buildRamparts: function(room) {
        let myBuildings = room.find(FIND_MY_STRUCTURES, {
            filter: (b) =>
                b.structureType === STRUCTURE_LINK ||
                b.structureType === STRUCTURE_EXTENSION ||
                b.structureType === STRUCTURE_SPAWN ||
                b.structureType === STRUCTURE_STORAGE ||
                b.structureType === STRUCTURE_TOWER ||
                b.structureType === STRUCTURE_LAB ||
                b.structureType === STRUCTURE_TERMINAL ||
                b.structureType === STRUCTURE_FACTORY
        });
        let neutralBuildings = room.find(FIND_STRUCTURES, {
            filter: (b) =>
                b.structureType === STRUCTURE_CONTAINER
        });
        let rampartBuildings = myBuildings.concat(neutralBuildings);
        for (let key in rampartBuildings) {
            let building = rampartBuildings[key];
            room.createConstructionSite(building.pos, STRUCTURE_RAMPART);
        }
    },

    // Rebuild base from ruins
    rebuild: function(room) {
        const ruins = room.find(FIND_RUINS, { filter: r => r.ticksToDecay > 500 });

        // Construct on ruins
        for (key in ruins) {
            let ruin = ruins[key];
            room.createConstructionSite(ruin.pos, ruin.structure.structureType)
        }
    },

    scanLayout: function(room) {
        const layouts = require('./layouts');
        const terrain = new Room.Terrain(room.name)
        let x = 0;
        let y = 0;

        while (room.memory.layoutScan.complete === false) {
            const structureLayout = layouts.bunkerLayout(x, y);
            let = structureLayoutArray = Object.values(structureLayout);

            for (let key in structureLayoutArray) {
                const pos = structureLayoutArray[key].pos;
                switch (terrain.get(pos.x, pos.y)) {
                    case TERRAIN_MASK_WALL:
                        break;

                    default:
                        // if loop is on last value and succeeds scan is complete
                        if (key == structureLayoutArray.length - 1) {
                            room.memory.layoutScan.complete = true;
                            console.log(`${x} ${y}`);
                            break;
                        }
                        continue;
                }
                if (x < 49 - 12) {
                    if (!room.memory.layoutScan.complete) {
                        x++;
                    }
                }
                // if scan fails to find space
                else if (y > 49 - 12) {
                    room.memory.layoutScan.pos.x = 99;
                    room.memory.layoutScan.pos.y = 99;
                    room.memory.layoutScan.complete = true;
                } else {
                    y++;
                    x = 0;
                    continue;
                }

                break;
            }
            room.memory.layoutScan.pos.x = x
            room.memory.layoutScan.pos.y = y
        }
    }
}
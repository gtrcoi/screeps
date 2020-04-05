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
        const startPos = new RoomPosition(room.memory.scanPos.x, room.memory.scanPos.y, room.name)
        const terrain = new Room.Terrain(room.name)

        const layout = [
            // Row 1
            { pos: new RoomPosition(startPos.x + 6, startPos.y, room.name), structureType: STRUCTURE_OBSERVER },
            { pos: new RoomPosition(startPos.x + 8, startPos.y, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 9, startPos.y, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 2
            { pos: new RoomPosition(startPos.x + 2, startPos.y + 1, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 3, startPos.y + 1, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 4, startPos.y + 1, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 1, room.name), structureType: STRUCTURE_NUKER },
            { pos: new RoomPosition(startPos.x + 7, startPos.y + 1, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 10, startPos.y + 1, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 11, startPos.y + 1, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 3
            { pos: new RoomPosition(startPos.x + 1, startPos.y + 2, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 3, startPos.y + 2, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 4, startPos.y + 2, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 2, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 8, startPos.y + 2, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 2, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 11, startPos.y + 2, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 4
            { pos: new RoomPosition(startPos.x + 1, startPos.y + 3, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 2, startPos.y + 3, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 7, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 8, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 10, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 12, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 5
            { pos: new RoomPosition(startPos.x + 1, startPos.y + 4, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 2, startPos.y + 4, room.name), structureType: STRUCTURE_LAB },
            { pos: new RoomPosition(startPos.x + 4, startPos.y + 4, room.name), structureType: STRUCTURE_TERMINAL },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 4, room.name), structureType: STRUCTURE_SPAWN },
            { pos: new RoomPosition(startPos.x + 8, startPos.y + 4, room.name), structureType: STRUCTURE_TOWER },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 4, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 10, startPos.y + 4, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 12, startPos.y + 4, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 6
            { pos: new RoomPosition(startPos.x + 3, startPos.y + 5, room.name), structureType: STRUCTURE_FACTORY },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 5, room.name), structureType: STRUCTURE_TOWER },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 5, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 11, startPos.y + 5, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 7
            { pos: new RoomPosition(startPos.x + 1, startPos.y + 6, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 2, startPos.y + 6, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 4, startPos.y + 6, room.name), structureType: STRUCTURE_LINK },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 6, room.name), structureType: STRUCTURE_STORAGE },
            { pos: new RoomPosition(startPos.x + 7, startPos.y + 6, room.name), structureType: STRUCTURE_TOWER },
            { pos: new RoomPosition(startPos.x + 8, startPos.y + 6, room.name), structureType: STRUCTURE_SPAWN },
            { pos: new RoomPosition(startPos.x + 10, startPos.y + 6, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 11, startPos.y + 6, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 8
            { pos: new RoomPosition(startPos.x + 1, startPos.y + 7, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 3, startPos.y + 7, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 7, room.name), structureType: STRUCTURE_TOWER },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 7, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 11, startPos.y + 7, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 9
            { pos: new RoomPosition(startPos.x, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 2, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 3, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 4, startPos.y + 8, room.name), structureType: STRUCTURE_TOWER },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 8, room.name), structureType: STRUCTURE_SPAWN },
            { pos: new RoomPosition(startPos.x + 8, startPos.y + 8, room.name), structureType: STRUCTURE_TOWER },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 10, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 12, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 10
            { pos: new RoomPosition(startPos.x, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 2, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 3, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 4, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 5, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 7, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 8, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 10, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 12, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 11
            { pos: new RoomPosition(startPos.x + 1, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 3, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 4, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 10, room.name), structureType: STRUCTURE_POWER_SPAWN },
            { pos: new RoomPosition(startPos.x + 8, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 11, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 12
            { pos: new RoomPosition(startPos.x + 1, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 2, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 5, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 6, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 7, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 10, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 11, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 13
            { pos: new RoomPosition(startPos.x + 3, startPos.y + 12, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 4, startPos.y + 12, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 8, startPos.y + 12, room.name), structureType: STRUCTURE_EXTENSION },
            { pos: new RoomPosition(startPos.x + 9, startPos.y + 12, room.name), structureType: STRUCTURE_EXTENSION }
        ];

        for (const key in layout) {
            const pos = layout[key].pos;

            // if loop finishes
            if (key == layout.length - 1) {
                room.memory.layoutScanComplete = { x: startPos.x, y: startPos.y };
                room.visual.circle(startPos.x, startPos.y, {
                    fill: 'white'
                });
            }
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
                    continue;
            }
            if (room.memory.scanPos.x < 49 - 12) {
                room.memory.scanPos.x++;
            } else {
                room.memory.scanPos.y++;
                room.memory.scanPos.x = 0;
            }

            break;
        }
    }
}
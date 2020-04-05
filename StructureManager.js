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

        const layout = {
            // Row 1
            7.1: { pos: new RoomPosition(startPos.x + 6, startPos.y, room.name), structureType: STRUCTURE_OBSERVER },
            9.1: { pos: new RoomPosition(startPos.x + 8, startPos.y, room.name), structureType: STRUCTURE_EXTENSION },
            10.1: { pos: new RoomPosition(startPos.x + 9, startPos.y, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 2
            3.2: { pos: new RoomPosition(startPos.x + 2, startPos.y + 1, room.name), structureType: STRUCTURE_LAB },
            4.2: { pos: new RoomPosition(startPos.x + 3, startPos.y + 1, room.name), structureType: STRUCTURE_LAB },
            5.2: { pos: new RoomPosition(startPos.x + 4, startPos.y + 1, room.name), structureType: STRUCTURE_LAB },
            7.2: { pos: new RoomPosition(startPos.x + 6, startPos.y + 1, room.name), structureType: STRUCTURE_NUKER },
            8.2: { pos: new RoomPosition(startPos.x + 7, startPos.y + 1, room.name), structureType: STRUCTURE_EXTENSION },
            11.2: { pos: new RoomPosition(startPos.x + 10, startPos.y + 1, room.name), structureType: STRUCTURE_EXTENSION },
            12.2: { pos: new RoomPosition(startPos.x + 11, startPos.y + 1, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 3
            2.3: { pos: new RoomPosition(startPos.x + 1, startPos.y + 2, room.name), structureType: STRUCTURE_LAB },
            4.3: { pos: new RoomPosition(startPos.x + 3, startPos.y + 2, room.name), structureType: STRUCTURE_LAB },
            5.3: { pos: new RoomPosition(startPos.x + 4, startPos.y + 2, room.name), structureType: STRUCTURE_LAB },
            7.3: { pos: new RoomPosition(startPos.x + 6, startPos.y + 2, room.name), structureType: STRUCTURE_EXTENSION },
            9.3: { pos: new RoomPosition(startPos.x + 8, startPos.y + 2, room.name), structureType: STRUCTURE_EXTENSION },
            10.3: { pos: new RoomPosition(startPos.x + 9, startPos.y + 2, room.name), structureType: STRUCTURE_EXTENSION },
            12.3: { pos: new RoomPosition(startPos.x + 11, startPos.y + 2, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 4
            2.4: { pos: new RoomPosition(startPos.x + 1, startPos.y + 3, room.name), structureType: STRUCTURE_LAB },
            3.4: { pos: new RoomPosition(startPos.x + 2, startPos.y + 3, room.name), structureType: STRUCTURE_LAB },
            8.4: { pos: new RoomPosition(startPos.x + 7, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            9.4: { pos: new RoomPosition(startPos.x + 8, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            10.4: { pos: new RoomPosition(startPos.x + 9, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            11.4: { pos: new RoomPosition(startPos.x + 10, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            13.4: { pos: new RoomPosition(startPos.x + 12, startPos.y + 3, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 5
            2.5: { pos: new RoomPosition(startPos.x + 1, startPos.y + 4, room.name), structureType: STRUCTURE_LAB },
            3.5: { pos: new RoomPosition(startPos.x + 2, startPos.y + 4, room.name), structureType: STRUCTURE_LAB },
            5.5: { pos: new RoomPosition(startPos.x + 4, startPos.y + 4, room.name), structureType: STRUCTURE_TERMINAL },
            7.5: { pos: new RoomPosition(startPos.x + 6, startPos.y + 4, room.name), structureType: STRUCTURE_SPAWN },
            9.5: { pos: new RoomPosition(startPos.x + 8, startPos.y + 4, room.name), structureType: STRUCTURE_TOWER },
            10.5: { pos: new RoomPosition(startPos.x + 9, startPos.y + 4, room.name), structureType: STRUCTURE_EXTENSION },
            11.5: { pos: new RoomPosition(startPos.x + 10, startPos.y + 4, room.name), structureType: STRUCTURE_EXTENSION },
            13.5: { pos: new RoomPosition(startPos.x + 12, startPos.y + 4, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 6
            4.6: { pos: new RoomPosition(startPos.x + 3, startPos.y + 5, room.name), structureType: STRUCTURE_FACTORY },
            7.6: { pos: new RoomPosition(startPos.x + 6, startPos.y + 5, room.name), structureType: STRUCTURE_TOWER },
            10.6: { pos: new RoomPosition(startPos.x + 9, startPos.y + 5, room.name), structureType: STRUCTURE_EXTENSION },
            12.6: { pos: new RoomPosition(startPos.x + 11, startPos.y + 5, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 7
            2.7: { pos: new RoomPosition(startPos.x + 1, startPos.y + 6, room.name), structureType: STRUCTURE_EXTENSION },
            3.7: { pos: new RoomPosition(startPos.x + 2, startPos.y + 6, room.name), structureType: STRUCTURE_EXTENSION },
            5.7: { pos: new RoomPosition(startPos.x + 4, startPos.y + 6, room.name), structureType: STRUCTURE_LINK },
            7.7: { pos: new RoomPosition(startPos.x + 6, startPos.y + 6, room.name), structureType: STRUCTURE_STORAGE },
            8.7: { pos: new RoomPosition(startPos.x + 7, startPos.y + 6, room.name), structureType: STRUCTURE_TOWER },
            9.7: { pos: new RoomPosition(startPos.x + 8, startPos.y + 6, room.name), structureType: STRUCTURE_SPAWN },
            11.7: { pos: new RoomPosition(startPos.x + 10, startPos.y + 6, room.name), structureType: STRUCTURE_EXTENSION },
            12.7: { pos: new RoomPosition(startPos.x + 11, startPos.y + 6, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 8
            2.8: { pos: new RoomPosition(startPos.x + 1, startPos.y + 7, room.name), structureType: STRUCTURE_EXTENSION },
            4.8: { pos: new RoomPosition(startPos.x + 3, startPos.y + 7, room.name), structureType: STRUCTURE_EXTENSION },
            7.8: { pos: new RoomPosition(startPos.x + 6, startPos.y + 7, room.name), structureType: STRUCTURE_TOWER },
            10.8: { pos: new RoomPosition(startPos.x + 9, startPos.y + 7, room.name), structureType: STRUCTURE_EXTENSION },
            12.8: { pos: new RoomPosition(startPos.x + 11, startPos.y + 7, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 9
            1.9: { pos: new RoomPosition(startPos.x, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            3.9: { pos: new RoomPosition(startPos.x + 2, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            4.9: { pos: new RoomPosition(startPos.x + 3, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            5.9: { pos: new RoomPosition(startPos.x + 4, startPos.y + 8, room.name), structureType: STRUCTURE_TOWER },
            7.9: { pos: new RoomPosition(startPos.x + 6, startPos.y + 8, room.name), structureType: STRUCTURE_SPAWN },
            9.9: { pos: new RoomPosition(startPos.x + 8, startPos.y + 8, room.name), structureType: STRUCTURE_TOWER },
            10.9: { pos: new RoomPosition(startPos.x + 9, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            11.9: { pos: new RoomPosition(startPos.x + 10, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            13.9: { pos: new RoomPosition(startPos.x + 12, startPos.y + 8, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 10
            1.10: { pos: new RoomPosition(startPos.x, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            3.10: { pos: new RoomPosition(startPos.x + 2, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            4.10: { pos: new RoomPosition(startPos.x + 3, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            5.10: { pos: new RoomPosition(startPos.x + 4, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            6.10: { pos: new RoomPosition(startPos.x + 5, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            8.10: { pos: new RoomPosition(startPos.x + 7, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            9.10: { pos: new RoomPosition(startPos.x + 8, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            10.10: { pos: new RoomPosition(startPos.x + 9, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            11.10: { pos: new RoomPosition(startPos.x + 10, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            13.10: { pos: new RoomPosition(startPos.x + 12, startPos.y + 9, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 11
            2.11: { pos: new RoomPosition(startPos.x + 1, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            4.11: { pos: new RoomPosition(startPos.x + 3, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            5.11: { pos: new RoomPosition(startPos.x + 4, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            7.11: { pos: new RoomPosition(startPos.x + 6, startPos.y + 10, room.name), structureType: STRUCTURE_POWER_SPAWN },
            9.11: { pos: new RoomPosition(startPos.x + 8, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            10.11: { pos: new RoomPosition(startPos.x + 9, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            12.11: { pos: new RoomPosition(startPos.x + 11, startPos.y + 10, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 12
            2.12: { pos: new RoomPosition(startPos.x + 1, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            3.12: { pos: new RoomPosition(startPos.x + 2, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            6.12: { pos: new RoomPosition(startPos.x + 5, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            7.12: { pos: new RoomPosition(startPos.x + 6, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            8.12: { pos: new RoomPosition(startPos.x + 7, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            11.12: { pos: new RoomPosition(startPos.x + 10, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            12.12: { pos: new RoomPosition(startPos.x + 11, startPos.y + 11, room.name), structureType: STRUCTURE_EXTENSION },
            // Row 13
            4.13: { pos: new RoomPosition(startPos.x + 3, startPos.y + 12, room.name), structureType: STRUCTURE_EXTENSION },
            5.13: { pos: new RoomPosition(startPos.x + 4, startPos.y + 12, room.name), structureType: STRUCTURE_EXTENSION },
            9.13: { pos: new RoomPosition(startPos.x + 8, startPos.y + 12, room.name), structureType: STRUCTURE_EXTENSION },
            10.13: { pos: new RoomPosition(startPos.x + 9, startPos.y + 12, room.name), structureType: STRUCTURE_EXTENSION }
        };

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
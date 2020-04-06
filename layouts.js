module.exports = {
    structureLayout: function(room) {
        const startPos = new RoomPosition(room.memory.layoutScan.pos.x, room.memory.layoutScan.pos.y, room.name);
        const structureLayout = [
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
        ]
        return structureLayout;
    }
}
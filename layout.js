var pos = { x: 0, y: 0 }

var layout = [
    // Row 1
    { x: pos.x + 7, y: pos.y, structureType: STRUCTURE_OBSERVER },
    { x: pos.x + 9, y: pos.y, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 10, y: pos.y, structureType: STRUCTURE_EXTENSION },
    // Row 2
    { x: pos.x + 2, y: pos.y + 1, structureType: STRUCTURE_LAB },
    { x: pos.x + 3, y: pos.y + 1, structureType: STRUCTURE_LAB },
    { x: pos.x + 4, y: pos.y + 1, structureType: STRUCTURE_LAB },
    { x: pos.x + 6, y: pos.y + 1, structureType: STRUCTURE_NUKER },
    { x: pos.x + 7, y: pos.y + 1, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 10, y: pos.y + 1, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 11, y: pos.y + 1, structureType: STRUCTURE_EXTENSION },
    // Row 3
    { x: pos.x + 1, y: pos.y + 2, structureType: STRUCTURE_LAB },
    { x: pos.x + 3, y: pos.y + 2, structureType: STRUCTURE_LAB },
    { x: pos.x + 4, y: pos.y + 2, structureType: STRUCTURE_LAB },
    { x: pos.x + 6, y: pos.y + 2, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 8, y: pos.y + 2, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 9, y: pos.y + 2, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 11, y: pos.y + 2, structureType: STRUCTURE_EXTENSION },
    // Row 4
    { x: pos.x + 1, y: pos.y + 3, structureType: STRUCTURE_LAB },
    { x: pos.x + 2, y: pos.y + 3, structureType: STRUCTURE_LAB },
    { x: pos.x + 7, y: pos.y + 3, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 8, y: pos.y + 3, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 9, y: pos.y + 3, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 10, y: pos.y + 3, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 12, y: pos.y + 3, structureType: STRUCTURE_EXTENSION },
    // Row 5
    { x: pos.x + 1, y: pos.y + 4, structureType: STRUCTURE_LAB },
    { x: pos.x + 2, y: pos.y + 4, structureType: STRUCTURE_LAB },
    { x: pos.x + 4, y: pos.y + 4, structureType: STRUCTURE_TERMINAL },
    { x: pos.x + 6, y: pos.y + 4, structureType: STRUCTURE_SPAWN },
    { x: pos.x + 8, y: pos.y + 4, structureType: STRUCTURE_TOWER },
    { x: pos.x + 9, y: pos.y + 4, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 10, y: pos.y + 4, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 12, y: pos.y + 4, structureType: STRUCTURE_EXTENSION },
    // Row 6
    { x: pos.x + 3, y: pos.y + 5, structureType: STRUCTURE_FACTORY },
    { x: pos.x + 6, y: pos.y + 5, structureType: STRUCTURE_TOWER },
    { x: pos.x + 9, y: pos.y + 5, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 11, y: pos.y + 5, structureType: STRUCTURE_EXTENSION },
    // Row 7
    { x: pos.x + 1, y: pos.y + 6, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 2, y: pos.y + 6, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 4, y: pos.y + 6, structureType: STRUCTURE_LINK },
    { x: pos.x + 6, y: pos.y + 6, structureType: STRUCTURE_STORAGE },
    { x: pos.x + 7, y: pos.y + 6, structureType: STRUCTURE_TOWER },
    { x: pos.x + 8, y: pos.y + 6, structureType: STRUCTURE_SPAWN },
    { x: pos.x + 10, y: pos.y + 6, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 11, y: pos.y + 6, structureType: STRUCTURE_EXTENSION },
    // Row 8
    { x: pos.x + 1, y: pos.y + 7, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 3, y: pos.y + 7, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 6, y: pos.y + 7, structureType: STRUCTURE_TOWER },
    { x: pos.x + 9, y: pos.y + 7, structureType: STRUCTURE_EXTENSION },
    { x: pos.x + 11, y: pos.y + 7, structureType: STRUCTURE_EXTENSION },
]
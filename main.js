const droneManager = require('./DroneManager');
const structureManager = require('./StructureManager');
const defenseManager = require('./DefenseManager');
const memoryManager = require('./MemoryManager');
const visuals = require('./RoomVisuals');
require('./SpawnManager');

module.exports.loop = function() {

    // Clean memory
    memoryManager.cleanMemory();

    // Towers
    defenseManager.runTowers();

    // Creep Loop
    for (const key in Game.creeps) {
        const creep = Game.creeps[key];

        droneManager.runRole(creep);
    }

    // Room Loop
    for (const key in Game.rooms) {
        const room = Game.rooms[key];

        // Set up memory objects for room
        memoryManager.setRoomMemory(room);
        memoryManager.setLinkIDs(room);
        memoryManager.setSpawnLimits(room);

        // Manage base building
        structureManager.buildRamparts(room);
        structureManager.rebuild(room);
        if (!room.memory.layoutScan.complete) { structureManager.scanLayout(room); }
        if (room.memory.base && Game.time % 100 == 0) {
            structureManager.buildBunker(room);
            structureManager.buildBunkerRoads(room)
        }

        // Run safe mode protection
        defenseManager.safeMode(room);

        // Paint visuals
        if (room.memory.layoutScan.pos.x < 99) { visuals.paintLayoutScan(room); }

        let links = _.filter(room.find(FIND_MY_STRUCTURES), s => s.structureType === STRUCTURE_LINK);

        for (const key in links) {
            const link = links[key];
            const baseLink = Game.getObjectById(room.memory.links.baseLinkID);
            if (link.id != room.memory.links.baseLinkID && link.store[RESOURCE_ENERGY] > link.store.getCapacity()) {
                link.transferEnergy(baseLink);
            }
        }
    }

    // Spawn Loop
    for (const key in Game.spawns) {
        const spawn = Game.spawns[key];

        spawn.spawnNextCreep();
    }


}
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
        memoryManager.setStructures(room);
        memoryManager.setSpawnLimits(room);
        memoryManager.viewSatellites(room);


        // Manage base building
        structureManager.buildRamparts(room);
        structureManager.rebuild(room);
        if (!room.memory.layoutScan.complete) {
            structureManager.scanLayout(room);
        } else if (Game.time % 1000 === 0) {
            structureManager.buildLocal(room);
        }
        if (room.memory.base && Game.time % 100 === 0) { structureManager.buildBunker(room); }

        // Run safe mode protection
        defenseManager.safeMode(room);

        // Paint visuals
        if (room.memory.layoutScan.pos.x < 99) { visuals.paintLayoutScan(room); }

        // Push energy through links
        let links = _.filter(room.find(FIND_MY_STRUCTURES), s => s.structureType === STRUCTURE_LINK);
        const baseLink = Game.getObjectById(room.memory.structures.links.baseLinkID);

        for (const key in links) {
            const link = links[key];

            if (link.id != baseLink.id && link.store[RESOURCE_ENERGY] > link.store.getCapacity()) {
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
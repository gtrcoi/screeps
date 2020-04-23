const droneManager = require('./DroneManager');
const structureManager = require('./StructureManager');
const defenseManager = require('./DefenseManager');
const memoryManager = require('./MemoryManager');
const visuals = require('./RoomVisuals');
require('./SpawnManager');

module.exports.loop = function() {

    // Clean memory
    memoryManager.cleanMemory();

    // Room Loop
    for (const key in Game.rooms) {
        const room = Game.rooms[key];

        // Set up memory objects for room
        memoryManager.setRoomMemory(room);
        memoryManager.setStructures(room);
        memoryManager.setSpawnLimits(room);
        memoryManager.viewSatellites(room);
        memoryManager.findRepairs(room);


        // Manage base building
        if (!room.memory.layoutScan.complete) {
            structureManager.scanLayout(room);
        } else if (Game.time % 100 === 0) {
            structureManager.buildLocal(room);
            structureManager.buildRamparts(room);
            structureManager.rebuild(room);
            structureManager.wallExits(room);
        }
        if (room.memory.base && Game.time % 100 === 0) { structureManager.buildBunker(room); }

        // Run safe mode protection
        defenseManager.safeMode(room);

        // Paint visuals
        if (room.memory.layoutScan.pos.x < 99) { visuals.paintLayoutScan(room); }
        visuals.paintMisc(room);

        // Push energy through links
        let links = _.filter(room.find(FIND_MY_STRUCTURES), s => s.structureType === STRUCTURE_LINK);
        const baseLink = Game.getObjectById(room.memory.structures.links.baseLinkID);
        const controllerLink = Game.getObjectById(room.memory.structures.links.controllerLinkID);

        for (const key in links) {
            const link = links[key];

            if ((link.id != baseLink.id && link.id != controllerLink.id) && link.store[RESOURCE_ENERGY] > link.store.getCapacity()) {
                link.transferEnergy(baseLink, baseLink.store.getCapacity(RESOURCE_ENERGY) - baseLink.store[RESOURCE_ENERGY]);
            } else if (link.id == baseLink.id && baseLink.store[RESOURCE_ENERGY] > 0 && controllerLink.store[RESOURCE_ENERGY] < 700) {
                link.transferEnergy(controllerLink, controllerLink.store.getCapacity(RESOURCE_ENERGY) - controllerLink.store[RESOURCE_ENERGY]);
            }
        }
    }

    // Spawn Loop
    for (const key in Game.spawns) {
        const spawn = Game.spawns[key];

        spawn.spawnNextCreep();
    }

    // Towers
    defenseManager.runTowers();

    // Creep Loop
    for (const key in Game.creeps) {
        const creep = Game.creeps[key];

        droneManager.runRole(creep);
    }

}
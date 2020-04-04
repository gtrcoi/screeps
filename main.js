const droneManager = require('./DroneManager');
require('./SpawnManager');
const structureManager = require('./StructureManager');
const defenseManager = require('./DefenseManager');
const memoryManager = require('./MemoryManager');

module.exports.loop = function() {

    // Clean memory
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

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


        // Skip this room if its not your room or has no controller
        if (!room.controller || !room.controller.my) {
            continue;
        }
        // Set up memory objects for room
        memoryManager.setLinkIDs(room);
        // Set the spawn limits for this room
        memoryManager.setSpawnLimits(room);

        structureManager.buildRamparts(room);
        structureManager.rebuild(room);
        defenseManager.safeMode(room);

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
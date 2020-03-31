const droneManager = require('./DroneManager');
const spawnManager = require('./SpawnManager');
const structureManager = require('./StructureManager');
const defenseManager = require('./DefenseManager');

module.exports.loop = function() {

    // Clean memory
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    // Defenses
    defenseManager.towerDefense();

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

        // Set the spawn limits for this room
        spawnManager.setSpawnLimits(room);
        structureManager.buildRamparts(room);
        structureManager.rebuild(room);
    }

    // Spawn Loop
    for (const key in Game.spawns) {
        const spawn = Game.spawns[key];

        spawn.spawnNextCreep();
    }


}
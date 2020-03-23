const roles = {
    harvester: require('./HarvesterManager'),
    worker: require('./WorkerManager'),
}
const spawnManager = require('./SpawnManager');

module.exports.loop = function() {
    // Main loop.
    // Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], Game.time, {memory: {working: false, role: 'harvester'}});
    // Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], Game.time, {memory: {working: false, role: 'worker'}});
    for (const key in Game.creeps) {
        const creep = Game.creeps[key];
        roles[creep.memory.role].runRole(creep);
    }

    for (const key in Game.rooms) {
        const room = Game.rooms[key];
        // Skip if no controller or not owned
        if (!room.controller || !room.controller.my) {
            continue;
        }
        spawnManager.setSpawnLimits(room);
    }

    // Run spawn next for each spawn
    for (const key in Game.spawns) {
        const spawn = Game.spawns[key];

        spawn.spawnNextCreep();
    }
};
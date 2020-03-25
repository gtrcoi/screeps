const droneManager = require('./DroneManager');
const spawnManager = require('./SpawnManager');
const structureManager = require('./StructureManager')
module.exports.loop = function() {
    // Clean memory
    for (let name in Memory.creeps) {
        // and checking if the creep is still alive
        if (Game.creeps[name] == undefined) {
            // if not, delete the memory entry
            delete Memory.creeps[name];
        }
    }
    // Run the drone manager for every creep in the game
    for (const key in Game.creeps) {
        // Get the current creep for this iteration of the loop
        const creep = Game.creeps[key];
        // Call runRole on the corresponding creep role as defined in the roles variable at the top of the file
        droneManager.runRole(creep);
    }

    // set the limits for the creeps
    for (const key in Game.rooms) {
        // Get the current room for this iteration fo the loop
        const room = Game.rooms[key];
        //     const pos = new RoomPosition(16, 23, room]);
        // console.log(pos.lookFor(LOOK_STRUCTURES));
        // Skip this room if its not your room or has no controller
        if (!room.controller || !room.controller.my) {
            continue;
        }

        // Set the spawn limits for this room
        spawnManager.setSpawnLimits(room);
    }

    // Run the spawn next creep for every spawn
    for (const key in Game.spawns) {
        // Get the current spawn for this iteration of the loop
        const spawn = Game.spawns[key];
        // Call spawn next creep on this spawn object
        spawn.spawnNextCreep();
    }
}
module.exports = {
    setSpawnLimits: function(room) {
        // Define the limits for a room
        const workerLimits = 2;
        const harvesterLimits = 2;
        const builderLimits = 2;

        // Set the property in memory if it doesn't exist
        if (!room.memory.spawnLimits) {
            room.memory.spawnLimits = {};
        }

        // Set the limits in the room memory
        const spawnLimits = {
            worker: workerLimits,
            harvester: harvesterLimits,
            builder: builderLimits
        };
        room.memory.spawnLimits = spawnLimits;
    }
};

// Add a function to the spawn objects that will spawn the next creep if needed
StructureSpawn.prototype.spawnNextCreep = function() {
    // The current room the spawn resides in
    const room = this.room;
    // The number of creeps who live in this room AND are considered workers
    const workerCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "worker"
    ).length;
    // The number of creeps who live in this room AND are considered harvesters
    const harvesterCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "harvester"
    ).length;
    // The number of creeps who live in this room AND are considered builders
    const builderCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "builder"
    ).length;

    // The limits we are pulling from memory of harvester and worker
    const harvesterLimits = room.memory.spawnLimits["harvester"];
    const workerLimits = room.memory.spawnLimits["worker"];
    const builderLimits = room.memory.spawnLimits["builder"];

    // Spawn the appropriate creep, if any
    if (harvesterCount < harvesterLimits) {
        // Check for harvester
        // Spawn a harvester
        this.spawnDrone("harvester");
    } else if (workerCount < workerLimits) {
        // Check for worker
        // Spawn a Worker
        this.spawnDrone("worker");
    } else if (builderCount < builderLimits) {
        // Check for builder
        // Spawn a Builder
        this.spawnDrone("builder");
    }
};

// Add a function to spawn objects to spawn a harvester
StructureSpawn.prototype.spawnDrone = function(role) {
    // Set all basic information about the creep to be spawned

    // Name is Game.time, which is an integer value of the current tick
    const name = Game.time;
    // Empty body array we will manually fill
    const body = [];
    // The memory we are going to save inside the creep
    const creepMemory = {
        working: false,
        role: role,
        homeRoom: this.room.name
    };

    // Check if harvesters are on the map
    const room = this.room;
    // The number of creeps who live in this room AND are considered harvesters
    const harvesterCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "harvester"
    ).length;
    // Generate the creep body
    var energyAvailable = undefined;
    if (harvesterCount > 0) {
        energyAvailable = this.room.energyCapacityAvailable;
    } else {
        energyAvailable = this.room.energyAvailable;
    }
    // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
    const numberOfParts = Math.floor(energyAvailable / 200);
    // The amount of energy we have after we have built as many 3 part sections as we can
    const leftOverEnergy = energyAvailable % 200;
    // The number of 2 part sections we can build after we have built the 3 part sections
    const numberOfExtraParts = Math.floor(leftOverEnergy / 100);

    // Create the main section'
    // Iterates the same number of  times as the value in number of parts, and pushing a WORK, CARRY, and MOVE value into the array every time
    for (let i = 0; i < numberOfParts; ++i) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }

    // Create the extra section
    // Iterates the same number of  times as the value in number of extra parts, and pushing CARRY and MOVE value into the array every time
    for (let i = 0; i < numberOfExtraParts; ++i) {
        body.push(CARRY);
        body.push(MOVE);
    }
    if (numberOfParts >= 1) {
        // Spawn the creep using all of this information
        this.spawnCreep(body, name, { memory: creepMemory });
    }
};
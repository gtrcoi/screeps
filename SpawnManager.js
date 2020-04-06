// Add a function to the spawn objects that will spawn the next creep if needed
StructureSpawn.prototype.spawnNextCreep = function() {
    // The current room the spawn resides in
    const room = this.room;
    // The number of creeps who live in this room AND are considered upgraders
    const upgraderCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "upgrader"
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
    // The number of creeps who live in this room AND are considered cranes
    const craneCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "crane"
    ).length;
    // The number of creeps who live in this room AND are considered cranes
    const diggerCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "digger"
    ).length;

    // The limits we are pulling from memory of harvester and upgrader
    const harvesterLimits = room.memory.spawnLimits["harvester"];
    const upgraderLimits = room.memory.spawnLimits["upgrader"];
    const builderLimits = room.memory.spawnLimits["builder"];
    const diggerLimits = room.memory.spawnLimits["digger"];
    const craneLimits = room.memory.spawnLimits["crane"];

    // Spawn the appropriate creep, if any
    if (harvesterCount < harvesterLimits) {
        this.spawnDrone("harvester");
    } else if (craneCount < craneLimits) {
        this.spawnCrane();
    } else if (diggerCount < diggerLimits) {
        this.spawnDigger();
    } else if (upgraderCount < upgraderLimits) {
        this.spawnDrone("upgrader");
    } else if (builderCount < builderLimits) {
        this.spawnDrone("builder");
    }
};

// Add a function to spawn objects to spawn a harvester
StructureSpawn.prototype.spawnDrone = function(role) {
    // Set all basic information about the creep to be spawned

    // Name is Game.time, which is an integer value of the current tick
    const name = role + Game.time;
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
    const energyCollectorCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && (creep.memory.role === "harvester" || creep.memory.role === "digger")
    ).length;
    // Generate the creep body
    var energyAvailable = undefined;
    if (energyCollectorCount >= 1) {
        energyAvailable = this.room.energyCapacityAvailable;
    } else {
        energyAvailable = this.room.energyAvailable;
    }

    // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
    var numberOfParts = Math.floor(energyAvailable / 200);
    if (numberOfParts > 16) { numberOfParts = 16 }
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

StructureSpawn.prototype.spawnCrane = function() {
    // Set all basic information about the creep to be spawned
    const name = "crane" + Game.time;
    // The memory we are going to save inside the creep
    const creepMemory = {
        working: false,
        role: "crane",
        homeRoom: this.room.name
    };

    // Empty body array we will manually fill
    const body = [];

    // Check if harvesters are on the map
    const room = this.room;
    // The number of creeps who live in this room AND are considered harvesters
    const energyCollectorCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && (creep.memory.role === "harvester" || creep.memory.role === "digger")
    ).length;

    // Generate the creep body
    var energyAvailable = undefined;
    if (energyCollectorCount >= 1) {
        energyAvailable = this.room.energyCapacityAvailable;
    } else {
        energyAvailable = this.room.energyAvailable;
    }

    // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
    var numberOfParts = Math.floor(energyAvailable / 50) - 1;
    if (numberOfParts > 16) { numberOfParts = 16 }


    // Create the main section'
    body.push(MOVE);
    // Iterates the same number of  times as the value in number of parts, and pushing a WORK, CARRY, and MOVE value into the array every time
    for (let i = 0; i < numberOfParts; ++i) {
        body.push(CARRY);
    }

    if (numberOfParts >= 1) {
        // Spawn the creep using all of this information
        this.spawnCreep(body, name, { memory: creepMemory });
    }
}

// Add a function to spawn objects to spawn a digger
StructureSpawn.prototype.spawnDigger = function() {
    // Set all basic information about the creep to be spawned
    const name = "digger" + Game.time;
    // Empty body array we will manually fill
    const body = [];
    // The memory we are going to save inside the creep
    const creepMemory = {
        working: false,
        role: "digger",
        homeRoom: this.room.name,
        linkID: undefined,
        sourceID: undefined,
        containerID: undefined
    };

    const sourceLinkIDs = this.room.memory.links.sourceLinkIDs;
    const diggers = _.filter(this.room.find(FIND_MY_CREEPS), c => c.memory.role === "digger");

    // Populate list of used Links in digger memory
    let diggerIDs = [];
    for (const key in diggers) {
        const digger = diggers[key];
        diggerIDs.push(digger.memory.linkID);
    }

    let linkAssign = undefined;
    for (linkID of sourceLinkIDs) {
        if (_.filter(diggerIDs, element => element === linkID).length == 0) {
            linkAssign = linkID;
            break;
        }
    }
    creepMemory.linkID = linkAssign;
    creepMemory.sourceID = Game.getObjectById(linkAssign).pos.findClosestByPath(FIND_SOURCES).id;
    creepMemory.containerID = Game.getObjectById(linkAssign).pos.findClosestByPath(FIND_STRUCTURES, { filter: s => s.structureType === STRUCTURE_CONTAINER }).id;

    // Generate the creep body
    var energyAvailable = this.room.energyCapacityAvailable;

    // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
    var numberOfParts = Math.floor(energyAvailable / 300);
    if (numberOfParts > 5) { numberOfParts = 5 }

    // Create the main section'
    // Iterates the same number of  times as the value in number of parts, and pushing a WORK, CARRY, and MOVE value into the array every time
    for (let i = 0; i < numberOfParts; ++i) {
        body.push(WORK);
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }

    if (numberOfParts >= 1) {
        // Spawn the creep using all of this information
        this.spawnCreep(body, name, { memory: creepMemory });
    }
};
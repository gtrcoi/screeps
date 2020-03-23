module.exports = {
    setSpawnLimits: function(room) {
        // Set the property in memory if it doesn't exist
        if (!room.memory.spawnLimits) {
            room.memory.spawnLimits = {};

            let workerLimits = 5;
            let harvesterLimits = 2;

            // Set the limits in the room memory
            const spawnLimits = {
                worker: workerLimits,
                harvester: harvesterLimits
            };
            room.memory.spawnLimits = spawnLimits;
        }
    }
};

// Add function to spawn object
StructureSpawn.prototype.spawnNextCreep = function() {
    //console.log("structure.spawnNextCreep.")
    // Spawn creep if needed
    const room = this.room;
    const workerCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "worker"
    ).length;
    const harvesterCount = _.filter(
        Game.creeps,
        creep =>
        creep.memory.homeRoom === room.name && creep.memory.role === "harvester"
    ).length;
    // const harvesterCount = _.filter(Game.creeps, (creep) =>
    //     creep.memory.homeRoom === room.name && creep.memory.role === 'harvester'
    // ).length;
    // console.log(_.filter(Game.creeps, (creep) => creep.memory.homeRoom === room.name && creep.memory.role === 'harvester').length);
    const harvesterLimits = room.memory.spawnLimits["harvester"];
    const workerLimits = room.memory.spawnLimits["worker"];

    // console.log(`harvesterCount: ${harvesterCount} \nharvesterLimits: ${harvesterLimits}`);
    // console.log(`workerCount: ${workerCount} \nworkerLimits: ${workerLimits}`);

    if (harvesterCount < harvesterLimits) {
        // Spawn a harvester
        this.spawnHarvester();
    } else if (workerCount < workerLimits) {
        // Spawn a worker
        this.spawnWorker();
    }
};

// Function to spawn harvester
StructureSpawn.prototype.spawnHarvester = function() {
    // Basic creep information

    const name = Game.time;
    const body = [];
    const creepMemory = {
        working: false,
        role: "harvester",
        homeRoom: this.room.name
    };

    // Creep body information
    const energyCapacityAvailable = this.room.energyCapacityAvailable;
    const numberOfParts = Math.floor(energyCapacityAvailable / 200);
    const leftOverEnergy = energyCapacityAvailable % 200;
    const numberOfExtraParts = Math.floor(leftOverEnergy / 100);

    // Create main section
    for (let i = 0; i < numberOfParts; ++i) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }

    // Create extra section
    for (let i = 0; i < numberOfExtraParts; ++i) {
        body.push(CARRY);
        body.push(MOVE);
    }

    // Spawn creep
    this.spawnCreep(body, name, { memory: creepMemory });
};

// Function to spawn harvester
StructureSpawn.prototype.spawnWorker = function() {
    // Basic creep information

    const name = Game.time;
    const body = [];
    const creepMemory = {
        working: false,
        role: "worker",
        homeRoom: this.room.name
    };

    // Creep body information
    const energyCapacityAvailable = this.room.energyCapacityAvailable;
    const numberOfParts = Math.floor(energyCapacityAvailable / 200);
    const leftOverEnergy = energyCapacityAvailable % 200;
    const numberOfExtraParts = Math.floor(leftOverEnergy / 100);

    // Create main section
    for (let i = 0; i < numberOfParts; ++i) {
        body.push(WORK);
        body.push(CARRY);
        body.push(MOVE);
    }

    // Create extra section
    for (let i = 0; i < numberOfExtraParts; ++i) {
        body.push(CARRY);
        body.push(MOVE);
    }

    // Spawn creep
    this.spawnCreep(body, name, { memory: creepMemory });
};
// Add a function to the spawn objects that will spawn the next creep if needed
StructureSpawn.prototype.spawnNextCreep = function () {
  if (!_.isNull(this.spawning)) return ERR_BUSY;

  // Current creep count
  const harvesterCount = this.room.memory.creepCount.harvester;
  const upgraderCount = this.room.memory.creepCount.upgrader;
  const builderCount = this.room.memory.creepCount.builder;
  const diggerCount = this.room.memory.creepCount.digger;
  const craneCount = this.room.memory.creepCount.crane;
  const loaderCount = this.room.memory.creepCount.loader;

  // Creep limits
  const harvesterLimits = this.room.memory.spawnLimits["harvester"];
  const upgraderLimits = this.room.memory.spawnLimits["upgrader"];
  const builderLimits = this.room.memory.spawnLimits["builder"];
  const diggerLimits = this.room.memory.spawnLimits["digger"];
  const craneLimits = this.room.memory.spawnLimits["crane"];
  const loaderLimits = this.room.memory.spawnLimits["loader"];

  if (this.room.memory.creepCount.test < 1) {
    this.spawnCreep([MOVE], `test${Game.time}`, { memory: { role: "test" } });
  }

  // Spawn the appropriate creep, if any
  if (harvesterCount < harvesterLimits) {
    this.spawnDrone("harvester");
  } else if (diggerCount < diggerLimits) {
    this.spawnDigger();
  } else if (craneCount < craneLimits) {
    this.spawnCrane();
  } else if (loaderCount < loaderLimits) {
    this.spawnLoader();
  } else if (builderCount < builderLimits) {
    this.spawnDrone("builder");
  } else if (upgraderCount < upgraderLimits) {
    if (this.room.memory.structures.links.controllerLinkID) {
      this.spawnUpgrader();
    } else {
      this.spawnDrone("upgrader");
    }
  } else {
    // if no observers in room
    // if (!this.room.memory.structures.observer) {
    //   this.sendScouts();
    // }
    this.spawnLDH();
  }
};

// StructureSpawn.prototype.sendScouts = function () {
//   const room = this.room;
//   const MemoryManager = require("./MemoryManager");

//   for (const satellite of MemoryManager.listSatellites(room, { range: 1 })) {
//     if (
//       !room.memory.remoteResources.satellites[satellite].visable &&
//       !room.memory.remoteResources.satellites[satellite].scout
//     ) {
//       this.spawnCreep([MOVE], "scout" + Game.time, {
//         memory: {
//           role: "scout",
//           homeRoom: this.room.name,
//           target: satellite,
//         },
//       });
//     }
//   }
// };

StructureSpawn.prototype.energyAvailable = function () {
  const room = this.room;
  const energyCollectorCount = room.memory.creepCount.energyCollectors;

  let energyAvailable = undefined;

  if (energyCollectorCount >= 1) {
    energyAvailable = this.room.energyCapacityAvailable;
  } else {
    energyAvailable = this.room.energyAvailable;
  }
  return energyAvailable;
};

StructureSpawn.prototype.spawnLDH = function () {
  const satellitesMem = this.room.memory.satellites;

  for (const key of Object.keys(satellitesMem)) {
    const satelliteMem = satellitesMem[key];
    if (satelliteMem.distance < 3 && satelliteMem.sources) {
      for (const source of Object.keys(satelliteMem.sources)) {
        if (!satelliteMem.sources[source].LDH) {
          // Build LDH
          const name = "LDH" + Game.time;
          const creepMemory = {
            working: false,
            role: "LDH",
            homeRoom: this.room.name,
            target: source,
            targetRoom: key,
          };

          const energyAvailable = this.energyAvailable();
          var numberOfParts = Math.floor(energyAvailable / 200);
          if (numberOfParts > 16) {
            numberOfParts = 16;
          }

          if (numberOfParts > 0) {
            const body = new Array(numberOfParts * 3);
            body.fill(WORK, 0, numberOfParts);
            body.fill(CARRY, numberOfParts, numberOfParts * 2);
            body.fill(MOVE, numberOfParts * 2);

            this.spawnCreep(body, name, { memory: creepMemory });
          }
        }
      }
    }
  }
};

// Add a function to spawn objects to spawn a harvester
StructureSpawn.prototype.spawnDrone = function (role) {
  const name = role + Game.time;
  const creepMemory = {
    working: false,
    role: role,
    homeRoom: this.room.name,
  };

  const energyAvailable = this.energyAvailable();

  // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
  var numberOfParts = Math.floor(energyAvailable / 200);
  if (numberOfParts > 16) {
    numberOfParts = 16;
  }

  if (numberOfParts >= 1) {
    // The amount of energy we have after we have built as many 3 part sections as we can
    const leftOverEnergy = energyAvailable % 200;
    // The number of 2 part sections we can build after we have built the 3 part sections
    const numberOfExtraParts = Math.floor(leftOverEnergy / 100);

    // Create the main section'
    // Iterates the same number of  times as the value in number of parts, and pushing a WORK, CARRY, and MOVE value into the array every time
    const body = new Array(numberOfParts * 3);
    body.fill(WORK, 0, numberOfParts);
    body.fill(CARRY, numberOfParts, numberOfParts * 2);
    body.fill(MOVE, numberOfParts * 2);

    // Create the extra section
    // Iterates the same number of  times as the value in number of extra parts, and pushing CARRY and MOVE value into the array every time
    for (let i = 0; i < numberOfExtraParts; ++i) {
      body.push(CARRY);
      body.push(MOVE);
    }
    // Spawn the creep using all of this information
    this.spawnCreep(body, name, { memory: creepMemory });
  }
};

StructureSpawn.prototype.spawnCrane = function () {
  const name = "crane" + Game.time;
  const creepMemory = {
    role: "crane",
    homeRoom: this.room.name,
  };

  const energyAvailable = this.energyAvailable();

  // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
  var numberOfParts = Math.floor(energyAvailable / 50) - 1;
  if (numberOfParts > 16) {
    numberOfParts = 16;
  }
  if (numberOfParts >= 1) {
    const body = new Array(numberOfParts);
    body[0] = MOVE;
    body.fill(CARRY, 1);

    // Spawn the creep using all of this information
    this.spawnCreep(body, name, { memory: creepMemory });
  }
};

// Add a function to spawn objects to spawn a digger
StructureSpawn.prototype.spawnDigger = function () {
  // Set all basic information about the creep to be spawned
  const name = "digger" + Game.time;
  // The memory we are going to save inside the creep
  const creepMemory = {
    working: false,
    role: "digger",
    homeRoom: this.room.name,
    linkID: undefined,
    sourceID: undefined,
    containerID: undefined,
  };

  const sourceLinkIDs = this.room.memory.structures.links.sourceLinkIDs;
  const sourceIDs = Object.keys(this.room.memory.resources.sources);
  const diggers = _.filter(
    this.room.find(FIND_MY_CREEPS),
    (c) => c.memory.role === "digger" && (c.ticksToLive > 100 || c.spawning)
  );

  // Populate list of used Links and Sources in digger memory
  let diggerIDs = [];
  let diggerSourceIDs = [];
  for (const key in diggers) {
    const digger = diggers[key];
    diggerIDs.push(digger.memory.linkID);
    diggerSourceIDs.push(digger.memory.sourceID);
  }
  // Assign link ID
  let linkAssign = undefined;
  for (linkID of sourceLinkIDs) {
    if (_.filter(diggerIDs, (element) => element === linkID).length == 0) {
      linkAssign = linkID;
      break;
    }
  }
  creepMemory.linkID = linkAssign;

  // Assign source ID
  let sourceAssign = undefined;
  for (sourceID of sourceIDs) {
    if (
      _.filter(diggerSourceIDs, (element) => element === sourceID).length == 0
    ) {
      sourceAssign = sourceID;
      break;
    }
  }
  creepMemory.sourceID = sourceAssign;

  const containers = Game.getObjectById(sourceAssign).pos.findInRange(
    FIND_STRUCTURES,
    1,
    {
      filter: (s) => s.structureType === STRUCTURE_CONTAINER,
    }
  );
  if (containers.length > 0) {
    creepMemory.containerID = containers[0].id;
  }

  const energyAvailable = this.energyAvailable();

  // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
  var numberOfParts = Math.floor(energyAvailable / 300);
  if (numberOfParts > 5) {
    numberOfParts = 5;
  }

  if (numberOfParts >= 1) {
    const body = new Array(numberOfParts * 4);
    body.fill(WORK, 0, numberOfParts * 2);
    body.fill(CARRY, numberOfParts * 2, numberOfParts * 3);
    body.fill(MOVE, numberOfParts * 3);

    // Spawn the creep using all of this information
    this.spawnCreep(body, name, { memory: creepMemory });
  }
};

StructureSpawn.prototype.spawnUpgrader = function () {
  // Set all basic information about the creep to be spawned
  const name = "upgrader" + Game.time;
  // The memory we are going to save inside the creep
  const creepMemory = {
    working: false,
    role: "upgrader",
    homeRoom: this.room.name,
  };

  const energyAvailable = this.energyAvailable();

  // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
  var numberOfParts = Math.floor(energyAvailable / 350);
  if (numberOfParts > 7) {
    numberOfParts = 7;
  }

  if (numberOfParts >= 1) {
    const body = new Array(numberOfParts * 5);
    body.fill(WORK, 0, numberOfParts * 2);
    body.fill(CARRY, numberOfParts * 2, numberOfParts * 3);
    body.fill(MOVE, numberOfParts * 3);

    // Spawn the creep using all of this information
    this.spawnCreep(body, name, { memory: creepMemory });
  }
};

// Add a function to spawn objects to spawn a loader
StructureSpawn.prototype.spawnLoader = function () {
  // Set all basic information about the creep to be spawned
  const name = "loader" + Game.time;
  // The memory we are going to save inside the creep
  const creepMemory = {
    working: false,
    role: "loader",
    homeRoom: this.room.name,
    rest: undefined,
  };

  // calculate rest stops
  let baseRests = [];
  if (this.room.memory.layoutScan.bunker) {
    const x = this.room.memory.layoutScan.pos.x;
    const y = this.room.memory.layoutScan.pos.y;
    baseRests = [
      { x: x + 7, y: y + 5 }, // TOP_RIGHT
      { x: x + 5, y: y + 7 }, // BOTTOM_LEFT
      { x: x + 7, y: y + 7 }, // BOTTOM_RIGHT
      { x: x + 5, y: y + 5 }, // TOP_LEFT
    ];
  }

  const loaders = _.filter(
    this.room.find(FIND_MY_CREEPS),
    (c) => c.memory.role === "loader" && (c.ticksToLive > 100 || c.spawning)
  );

  // Populate list of used rest stops in loader memory
  let loaderRests = [];
  for (const key in loaders) {
    const creep = loaders[key];
    loaderRests.push(creep.memory.rest);
  }
  // Assign rest stop
  let restAssign = undefined;
  for (const pos of baseRests) {
    if (
      _.filter(
        loaderRests,
        (element) => element.x == pos.x && element.y == pos.y
      ).length == 0
    ) {
      restAssign = pos;
      break;
    }
  }
  creepMemory.rest = restAssign;

  // Count energy collectors and spawn loaders
  const energyCollectorCount = this.room.memory.creepCount.energyCollectors;
  // Generate the creep body
  var energyAvailable = undefined;
  if (energyCollectorCount >= 1) {
    energyAvailable = this.room.energyCapacityAvailable;
  } else {
    energyAvailable = this.room.energyAvailable;
  }

  // Number of "3 part sections" we are able to make for the creep, since they cost 200 each section
  var numberOfParts = Math.floor(energyAvailable / 150);
  if (numberOfParts > 16) {
    numberOfParts = 16;
  }

  if (numberOfParts >= 1) {
    const body = new Array(numberOfParts * 3);
    body.fill(CARRY, 0, numberOfParts * 2);
    body.fill(MOVE, numberOfParts * 2);

    // Spawn the creep using all of this information
    this.spawnCreep(body, name, { memory: creepMemory });
  }
};

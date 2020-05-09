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
    // this.spawnDrone("test", { move: 1, maxSections: 1 });
  }

  // Spawn the appropriate creep, if any
  if (harvesterCount < harvesterLimits) {
    this.spawnDrone("harvester", { work: 1, carry: 1, move: 1 });
  } else if (diggerCount < diggerLimits) {
    this.spawnDrone("digger", { work: 2, carry: 1, move: 1, maxSections: 5 });
  } else if (craneCount < craneLimits) {
    this.spawnDrone("crane", { move: 1, carry: 16, maxSections: 1 });
  } else if (loaderCount < loaderLimits) {
    this.spawnDrone("loader", { carry: 2, move: 1 });
  } else if (builderCount < builderLimits) {
    this.spawnDrone("builder", { work: 1, carry: 1, move: 1 });
  } else if (upgraderCount < upgraderLimits) {
    if (this.room.memory.structures.links.controllerLinkID) {
      this.spawnDrone("upgrader", { work: 2, carry: 1, move: 2 });
    } else {
      this.spawnDrone("upgrader", { work: 1, carry: 1, move: 1 });
    }
  } else {
    // if no observers in room
    // if (!this.room.memory.structures.observer) {
    //   this.sendScouts();
    // }
    // this.spawnLDH();
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

StructureSpawn.prototype.spawnDrone = function (role, opts) {
  // Checking memory first in case of exception
  let creepMemory;
  switch (role) {
    case "LDH":
      creepMemory = this.spawnLDH();
      if ((creepMemory = ERR_NOT_FOUND)) return ERR_NOT_FOUND;
      break;
    case "digger":
      creepMemory = this.spawnDigger();
      break;
    case "loader":
      creepMemory = this.spawnLoader();
      break;
    default:
      creepMemory = {
        working: false,
        role: role,
        homeRoom: this.room.name,
      };
      break;
  }

  opts = opts || {};

  const parts = [TOUGH, WORK, CARRY, MOVE];
  let sectionLength = 0;
  for (const part of parts) {
    if (_.isUndefined(opts[part])) {
      opts[part] = 0;
    } else sectionLength += opts[part];
  }
  const maxSections = !_.isUndefined(opts.maxSections)
    ? opts.maxSections
    : Math.floor(50 / sectionLength);

  const name = role + Game.time;

  function repeat(item, times) {
    return new Array(times).fill(item);
  }

  const energyAvailable = this.energyAvailable();
  const sectionCost = _.sum([
    opts.tough * 10,
    opts.work * 100,
    opts.carry * 50,
    opts.move * 50,
  ]);

  let numberOfParts = Math.floor(energyAvailable / sectionCost);
  numberOfParts = numberOfParts > maxSections ? maxSections : numberOfParts;

  if (numberOfParts >= 1) {
    const body = new Array().concat(
      repeat(TOUGH, opts.tough * numberOfParts),
      repeat(WORK, opts.work * numberOfParts),
      repeat(CARRY, opts.carry * numberOfParts),
      repeat(MOVE, opts.move * numberOfParts)
    );
    // console.log(`
    // Max sections: ${maxSections}
    // parts: ${numberOfParts}
    // section length: ${sectionLength}
    // body: ${body.length}
    // `);
    // const leftOverEnergy = energyAvailable % sectionCost;
    // const numberOfExtraParts = Math.floor(leftOverEnergy / 100);

    // for (let i = 0; i < numberOfExtraParts; ++i) {
    //   body.push(CARRY);
    //   body.push(MOVE);
    // }
    this.spawnCreep(body, name, { memory: creepMemory });
  }
};

StructureSpawn.prototype.spawnLDH = function () {
  const satellitesMem = this.room.memory.satellites;

  for (const key of Object.keys(satellitesMem)) {
    const satelliteMem = satellitesMem[key];
    if (satelliteMem.distance < 3 && satelliteMem.sources) {
      for (const source of Object.keys(satelliteMem.sources)) {
        if (!satelliteMem.sources[source].LDH) {
          // Build LDH
          const creepMemory = {
            working: false,
            role: "LDH",
            homeRoom: this.room.name,
            target: source,
            targetRoom: key,
          };

          return creepMemory;
        }
      }
    }
  }
  return ERR_NOT_FOUND;
};

// Add a function to spawn objects to spawn a digger
StructureSpawn.prototype.spawnDigger = function () {
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

  return creepMemory;
};

// Add a function to spawn objects to spawn a loader
StructureSpawn.prototype.spawnLoader = function () {
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

  return creepMemory;
};

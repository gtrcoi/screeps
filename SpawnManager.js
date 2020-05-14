// Add a function to the spawn objects that will spawn the next creep if needed
StructureSpawn.prototype.spawnNextCreep = function () {
  if (!_.isNull(this.spawning)) return ERR_BUSY;
  if (!this.room.memory.base) return ERR_INVALID_TARGET;

  // Current creep count
  const harvesterCount = this.room.memory.creepCount.harvester || 0;
  const upgraderCount = this.room.memory.creepCount.upgrader || 0;
  const builderCount = this.room.memory.creepCount.builder || 0;
  const diggerCount = this.room.memory.creepCount.digger || 0;
  const craneCount = this.room.memory.creepCount.crane || 0;
  const loaderCount = this.room.memory.creepCount.loader || 0;

  // Creep limits
  const harvesterLimits = this.room.memory.spawnLimits["harvester"] || 0;
  const upgraderLimits = this.room.memory.spawnLimits["upgrader"] || 0;
  const builderLimits = this.room.memory.spawnLimits["builder"] || 0;
  const diggerLimits = this.room.memory.spawnLimits["digger"] || 0;
  const craneLimits = this.room.memory.spawnLimits["crane"] || 0;
  const loaderLimits = this.room.memory.spawnLimits["loader"] || 0;
  if (this.room.memory.creepCount.test < 1) {
    // this.spawnDrone("test", { move: 1, maxSections: 1 });
  }

  // Spawn the appropriate creep, if any
  if (harvesterCount < harvesterLimits) {
    this.spawnDrone("harvester", { work: 1, carry: 1, move: 1 });
    return;
  }
  if (diggerCount < diggerLimits) {
    this.spawnDrone("digger", { work: 2, carry: 1, move: 1, maxSections: 5 });
    return;
  }
  if (craneCount < craneLimits) {
    this.spawnDrone("crane", { move: 1, carry: 16, maxSections: 1 });
    return;
  }
  if (loaderCount < loaderLimits) {
    this.spawnDrone("loader", { carry: 2, move: 1 });
    return;
  }
  if (builderCount < builderLimits) {
    this.spawnDrone("builder", { work: 1, carry: 1, move: 1 });
    return;
  }
  if (upgraderCount < upgraderLimits) {
    if (this.room.memory.structures.links.controllerLinkID) {
      this.spawnDrone("upgrader", {
        work: 2,
        carry: 1,
        move: 2,
        maxSections: 3,
      });
    } else {
      this.spawnDrone("upgrader", { work: 1, carry: 1, move: 1 });
    }
    return;
  }
  for (const satellite of this.room.memory.satellites) {
    const scoutCount = this.room.memory.creepCount.scout[satellite] || 0;
    if (
      !Game.rooms[satellite] &&
      !this.room.memory.structures.observer &&
      scoutCount < 1
    ) {
      this.spawnDrone("scout", {
        move: 1,
        maxSections: 1,
        targetRoom: satellite,
      });
    }
    const soldierCount = this.room.memory.creepCount.soldier[satellite] || 0;
    const soldierLimit = this.room.memory.spawnLimits.soldier[satellite] || 0;

    if (soldierCount < soldierLimit) {
      this.spawnDrone("soldier", {
        attack: 1,
        move: 2,
        tough: 1,
        targetRoom: satellite,
      });
      return;
    }
    if (
      Memory.rooms[satellite].resources &&
      Memory.rooms[satellite].resources.sources &&
      !Memory.rooms[satellite].enemies.total
    ) {
      for (const source of Object.keys(
        Memory.rooms[satellite].resources.sources
      )) {
        const LDHCount = this.room.memory.creepCount.LDH[source] || 0;
        // const LDHLimits = this.room.memory.spawnLimits.LDHs.length || 0;

        if (LDHCount < 1) {
          console.log(`${LDHCount}`);
          this.spawnDrone("LDH", {
            work: 1,
            carry: 1,
            move: 1,
            target: source,
            targetRoom: satellite,
          });
          return;
        }
      }
    }
  }
};

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
        targetRoom: opts.targetRoom,
        target: opts.target,
      };
      break;
  }

  opts = opts || {};

  const partsOrder = [
    TOUGH,
    WORK,
    CARRY,
    MOVE,
    ATTACK,
    RANGED_ATTACK,
    HEAL,
    CLAIM,
  ];
  let sectionLength = 0;
  for (const part of partsOrder) {
    if (_.isUndefined(opts[part])) {
      opts[part] = 0;
    } else sectionLength += opts[part];
  }
  const sectionCost = _.sum([
    opts.tough * 10,
    opts.work * 100,
    opts.carry * 50,
    opts.move * 50,
    opts.attack * 80,
    opts.ranged_attack * 150,
    opts.heal * 250,
    opts.claim * 600,
  ]);
  const maxSections = !_.isUndefined(opts.maxSections)
    ? opts.maxSections
    : Math.floor(50 / sectionLength);

  const name = role + Game.time;

  function repeat(item, times) {
    return new Array(times).fill(item);
  }

  const energyAvailable = this.energyAvailable();

  let numberOfParts = Math.floor(energyAvailable / sectionCost);
  numberOfParts = numberOfParts > maxSections ? maxSections : numberOfParts;

  if (numberOfParts >= 1) {
    let body = new Array();
    for (const part of partsOrder) {
      body = body.concat(repeat(part, opts[part] * numberOfParts));
    }

    // console.log(`Max sections: ${maxSections}
    // parts: ${numberOfParts}
    // section length: ${sectionLength}
    // body: ${body}
    // role: ${role}`);

    const spawnReturn = this.spawnCreep(body, name, {
      memory: creepMemory,
    });
    if (!/0|-6/.test(spawnReturn)) {
      console.log(`Spawning ${role} returns: ${spawnReturn}`);
    }
  }
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

// ===========================
// Energy Collection methods
// ===========================

// Harvest Source nodes
Creep.prototype.harvestSource = function (sourceID) {
  if (this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)) {
    return ERR_FULL;
  }
  var activeSource = null;
  if (sourceID === undefined) {
    activeSource = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  } else {
    const targetSource = Game.getObjectById(sourceID);
    if (_.isNull(targetSource)) return ERR_INVALID_TARGET;
    if (targetSource.energy > 0) {
      activeSource = targetSource;
    }
  }
  switch (activeSource) {
    case null:
      return ERR_NOT_FOUND;
    default:
      if (this.harvest(activeSource) === ERR_NOT_IN_RANGE) {
        this.moveTo(activeSource, {
          visualizePathStyle: {
            stroke: "#ffff66",
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

// Collected dropped Source
Creep.prototype.collectDroppedSource = function (opts) {
  opts = opts || {};
  if (this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)) {
    return ERR_FULL;
  }
  let droppedSource;
  if (opts.range === undefined) {
    droppedSource = this.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: (r) => r.resourceType == RESOURCE_ENERGY,
    });
  } else {
    droppedSource = this.pos.findInRange(FIND_DROPPED_RESOURCES, opts.range, {
      filter: (r) => r.resourceType == RESOURCE_ENERGY,
    })[0];
  }
  switch (droppedSource) {
    case null:
    case undefined:
      return ERR_NOT_FOUND;

    default:
      if (this.pickup(droppedSource) === ERR_NOT_IN_RANGE) {
        this.moveTo(droppedSource, {
          visualizePathStyle: {
            stroke: "#ffff66",
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

// Collect from Tombstones
Creep.prototype.withdrawTombstone = function () {
  if (this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)) {
    return ERR_FULL;
  }
  const tombstone = this.pos.findClosestByPath(FIND_TOMBSTONES, {
    filter: (t) => t.store[RESOURCE_ENERGY] > 0,
  });

  switch (tombstone) {
    case null:
      return ERR_NOT_FOUND;

    default:
      if (this.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(tombstone, {
          visualizePathStyle: {
            stroke: "#ffff66",
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

// Collect from Ruins
Creep.prototype.collectRuin = function () {
  if (this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)) {
    return ERR_FULL;
  }
  const ruin = this.pos.findClosestByPath(FIND_RUINS, {
    filter: (t) => t.store[RESOURCE_ENERGY] > 0,
  });

  switch (ruin) {
    case null:
      return ERR_NOT_FOUND;
    default:
      if (this.withdraw(ruin, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(ruin, {
          visualizePathStyle: {
            stroke: "#ffff66",
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

Creep.prototype.collectStorage = function () {
  if (this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)) {
    return ERR_FULL;
  }
  const storage = this.room.storage;

  if (_.isObject(storage) && storage.store[RESOURCE_ENERGY] > 0) {
    if (this.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.moveTo(storage, {
        visualizePathStyle: {
          stroke: "#ffff66",
          opacity: 0.7,
        },
      });
    }
    return OK;
  } else {
    return ERR_NOT_FOUND;
  }
};

Creep.prototype.collectContainer = function (containerID, opts) {
  opts = opts || {};
  if (this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)) {
    return ERR_FULL;
  }
  let containers;
  if (opts.range) {
    containers = this.pos.findInRange(FIND_STRUCTURES, opts.range, {
      filter: (s) =>
        s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
    });
  } else {
    containers = this.room.find(FIND_STRUCTURES, {
      filter: (s) =>
        s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
    });
  }
  let container = null;
  if (containerID === undefined) {
    container = this.pos.findClosestByPath(containers);
  } else {
    container = Game.getObjectById(containerID);
  }
  switch (container) {
    case null:
      return ERR_NOT_FOUND;

    default:
      if (this.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(container, {
          visualizePathStyle: {
            stroke: "#ffff66",
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

Creep.prototype.collectLink = function (linkID) {
  if (this.store[RESOURCE_ENERGY] === this.store.getCapacity(RESOURCE_ENERGY)) {
    return ERR_FULL;
  }
  let link = null;
  if (linkID === undefined) {
    link = Game.getObjectById(this.room.memory.structures.links.baseLinkID);
  } else {
    link = Game.getObjectById(linkID);
  }
  switch (link) {
    case null:
      return ERR_NOT_FOUND;

    default:
      if (link.store[RESOURCE_ENERGY] > 0) {
        if (this.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          this.moveTo(link, {
            visualizePathStyle: {
              stroke: "#ffff66",
              opacity: 0.7,
            },
          });
          return OK;
        }
      } else {
        return ERR_NOT_ENOUGH_ENERGY;
      }
  }
};

// ===========================
// Energy Delivery methods
// ===========================

// Deliver to Spawn and Extentions
Creep.prototype.chargeSpawn = function () {
  const spawn = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (s) =>
      (s.structureType == STRUCTURE_EXTENSION &&
        s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY)) ||
      (s.structureType == STRUCTURE_SPAWN &&
        s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY)),
  });

  switch (spawn) {
    case null:
      return ERR_NOT_FOUND;

    default:
      if (this.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(spawn, {
          visualizePathStyle: {
            stroke: "#ffff66",
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

// Deliver to Room Controller
Creep.prototype.chargeController = function () {
  const controller = this.room.controller;
  switch (controller.my) {
    case false:
      return ERR_NOT_OWNER;

    default:
      if (this.upgradeController(controller) === ERR_NOT_IN_RANGE) {
        this.moveTo(controller, {
          visualizePathStyle: {
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

// Construct
Creep.prototype.construct = function () {
  const construction = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

  switch (construction) {
    case null:
      return ERR_NOT_FOUND;

    default:
      if (this.build(construction) === ERR_NOT_IN_RANGE) {
        this.moveTo(construction, {
          visualizePathStyle: {
            stroke: "#00cc00",
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

// Repair all
Creep.prototype.repairMostDamaged = function (opts) {
  opts = opts || {};
  if (_.isUndefined(opts.percent)) {
    opts.percent = 100;
  }
  const targetID = this.room.memory.structures.repairs.mostDamagedStructure.id;
  const targetPercent = this.room.memory.structures.repairs.mostDamagedStructure
    .percent;
  const target = Game.getObjectById(targetID);

  if (!_.isNull(target) && targetPercent < opts.percent / 100) {
    if (this.repair(target) === ERR_NOT_IN_RANGE) {
      this.moveTo(target, {
        visualizePathStyle: {
          stroke: "#00cc00",
          opacity: 0.7,
        },
      });
    }
    return OK;
  } else {
    return ERR_NOT_FOUND;
  }
};

// Repair Roads
Creep.prototype.repairRoad = function (opts) {
  opts = opts || {};
  if (_.isUndefined(opts.percent)) {
    opts.percent = 100;
  }

  let targetID;
  let targetPercent;
  let target;
  if (this.room.memory.structures && this.room.memory.structures.repairs) {
    targetID = this.room.memory.structures.repairs.mostDamagedRoad.id;
    targetPercent = this.room.memory.structures.repairs.mostDamagedRoad.percent;
    target = Game.getObjectById(targetID);
  } else {
    target = this.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (s) => s.structureType === STRUCTURE_ROAD && s.hits < s.hitsMax,
    });
    targetPercent = !_.isNull(target)
      ? target.hitsMax / target.hits
      : undefined;
  }
  if (!_.isNull(target) && targetPercent < opts.percent / 100) {
    if (this.repair(target) === ERR_NOT_IN_RANGE) {
      this.moveTo(target, {
        visualizePathStyle: {
          stroke: "#00cc00",
          opacity: 0.7,
        },
      });
    }
    return OK;
  } else {
    return ERR_NOT_FOUND;
  }
};

// Recharge Towers
Creep.prototype.rechargeTower = function (opts) {
  opts = opts || {};

  if (_.isUndefined(opts.percent) || !_.isNumber(opts.percent)) {
    opts.percent = 100;
  }
  const percentRepair = opts.percent / 100;

  let depletedTowers = null;

  if (_.isUndefined(opts.range) || !_.isNumber(opts.range)) {
    depletedTowers = this.room.find(FIND_MY_STRUCTURES, {
      filter: (t) =>
        t.structureType == STRUCTURE_TOWER &&
        t.store[RESOURCE_ENERGY] <
          t.store.getCapacity(RESOURCE_ENERGY) * percentRepair,
    });
  } else if (_.isNumber(opts.range)) {
    depletedTowers = this.pos.findInRange(FIND_MY_STRUCTURES, opts.range, {
      filter: (t) =>
        t.structureType == STRUCTURE_TOWER &&
        t.store[RESOURCE_ENERGY] <
          t.store.getCapacity(RESOURCE_ENERGY) * percentRepair,
    });
  }

  if (depletedTowers.length > 0) {
    var mostDepletedTower = null;

    for (
      let percentage = 0.01;
      percentage <= 1;
      percentage = percentage + 0.01
    ) {
      // find tower with less than percentage hits
      for (let tower of depletedTowers) {
        // console.log(tower)
        if (
          tower.store[RESOURCE_ENERGY] /
            tower.store.getCapacity(RESOURCE_ENERGY) <
          percentage
        ) {
          mostDepletedTower = tower;

          break;
        }
      }
      if (mostDepletedTower != null) {
        break;
      }
    }
  } else {
    return ERR_NOT_FOUND;
  }

  switch (mostDepletedTower) {
    case null:
      return ERR_NOT_FOUND;

    default:
      if (
        this.transfer(mostDepletedTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
      ) {
        this.moveTo(mostDepletedTower, {
          visualizePathStyle: {
            stroke: "#ffff66",
            opacity: 0.7,
          },
        });
      }
      return OK;
  }
};

Creep.prototype.chargeStorage = function (opts) {
  opts = opts || {};
  if (_.isUndefined(opts.percent)) {
    opts.percent = 100;
  }

  const storage = this.room.storage;

  if (
    _.isObject(storage) &&
    storage.store[RESOURCE_ENERGY] <
      (storage.store.getCapacity() * opts.percent) / 100
  ) {
    if (this.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      this.moveTo(storage, {
        visualizePathStyle: {
          stroke: "#ffff66",
          opacity: 0.7,
        },
      });
    }
    return OK;
  } else {
    return ERR_NOT_FOUND;
  }
};

Creep.prototype.chargeLink = function (linkID) {
  let link = null;
  if (linkID === undefined) {
    link = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (s) => s.structureType === STRUCTURE_LINK,
    });
  } else {
    link = Game.getObjectById(linkID);
  }
  switch (link) {
    case null:
      return ERR_NOT_FOUND;

    default:
      if (this.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.moveTo(link, {
          visualizePathStyle: {
            stroke: "#ffff66",
            opacity: 0.7,
          },
        });
      }
      break;
  }
};

// Repair containers
Creep.prototype.repairContainer = function (opts) {
  opts = opts || {};
  if (_.isUndefined(opts.percent)) {
    opts.percent = 100;
  }
  const targetID = this.room.memory.structures.repairs.mostDamagedContainer.id;
  const targetPercent = this.room.memory.structures.repairs.mostDamagedContainer
    .percent;
  const target = Game.getObjectById(targetID);

  if (!_.isNull(target) && targetPercent < opts.percent / 100) {
    if (this.repair(target) === ERR_NOT_IN_RANGE) {
      this.moveTo(target, {
        visualizePathStyle: {
          stroke: "#00cc00",
          opacity: 0.7,
        },
      });
    }
    return OK;
  } else {
    return ERR_NOT_FOUND;
  }
};

// ===========================
// Logistic methods
// ===========================

// Move between rooms
Creep.prototype.moveToRoom = function (targetRoom, opts) {
  opts = opts || {};
  if (this.room.name === targetRoom) return ERR_INVALID_TARGET;
  const path = Game.map.findRoute(this.room.name, targetRoom);

  const exit = this.pos.findClosestByPath(path[0].exit);
  this.moveTo(exit, {
    visualizePathStyle: {},
    reusePath: 100,
  });
  return OK;
};

Creep.prototype.bump = function (opts) {
  opts = opts || {};

  if (this.pos.x === 0) {
    this.move(RIGHT);
  } else if (this.pos.y === 0) {
    this.move(BOTTOM);
  } else if (this.pos.x === 49) {
    this.move(LEFT);
  } else if (this.pos.y === 49) {
    this.move(TOP);
  } else {
    return ERR_INVALID_TARGET;
  }
};

// ===========================
// Combat methods
// ===========================

Creep.prototype.killStuff = function () {
  // Find targets
  const creeps = this.room.find(FIND_HOSTILE_CREEPS);
  const powerCreeps = this.room.find(FIND_HOSTILE_POWER_CREEPS);
  const structures = this.room.find(FIND_HOSTILE_STRUCTURES);
  let targetArray = [];
  let target = null;
  if (powerCreeps.length > 0) {
    target = powerCreeps[0];
  } else if (creeps.length > 0) {
    // Sort targets by most heal parts
    for (let creep of creeps) {
      let healParts = 0;
      for (let part of creep.body) {
        if (part.type === HEAL) {
          healParts++;
        }
      }
      targetArray.push({ creep: creep, healParts: healParts });
    }

    targetArray.sort((a, b) => (a.healParts > b.healParts ? -1 : 1));
    if (targetArray.length > 0) {
      target = targetArray[0].creep;
    }
  } else if (structures.length > 0) {
    target = structures[0];
  }

  switch (target) {
    case null:
      return ERR_NOT_FOUND;

    default:
      this.moveTo(target);
      this.rangedAttack(target);
      return OK;
  }
};

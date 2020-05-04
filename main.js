const droneManager = require("./DroneManager");
const structureManager = require("./StructureManager");
const defenseManager = require("./DefenseManager");
const memoryManager = require("./MemoryManager");
const visuals = require("./RoomVisuals");
require("./SpawnManager");

module.exports.loop = function () {
  // Clean memory
  memoryManager.cleanMemory();

  // Room Loop
  for (const key in Game.rooms) {
    const room = Game.rooms[key];

    // Manage base building
    if (room.memory.base) {
      // Set up memory objects for room
      memoryManager.setRoomMemory(room);
      memoryManager.setStructures(room);
      memoryManager.creepCount(room);
      memoryManager.viewSatellites(room);
      memoryManager.findRepairs(room);

      if (Game.time % 100 === 0) {
        structureManager.buildBunker(room);
      }
    }
    if (!room.memory.layoutScan.complete) {
      structureManager.scanLayout(room);
    } else if (Game.time % 1000 === 0) {
      structureManager.buildLocal(room);
      structureManager.buildRamparts(room);
      structureManager.rebuild(room);
    }
    if (Game.time % 1000 === 0) {
      structureManager.wallExits(room);
    }

    // Run safe mode protection
    defenseManager.safeMode(room);

    // Paint visuals
    if (room.memory.layoutScan.bunker) {
      visuals.paintLayoutScan(room);
    }
    visuals.paintMisc(room);

    // Push energy through links
    let links = _.filter(
      room.find(FIND_MY_STRUCTURES),
      (s) => s.structureType === STRUCTURE_LINK
    );
    const baseLink = Game.getObjectById(
      room.memory.structures.links.baseLinkID
    );
    const controllerLink = Game.getObjectById(
      room.memory.structures.links.controllerLinkID
    );

    for (const key in links) {
      const link = links[key];

      if (
        link.id != baseLink.id &&
        link.id != controllerLink.id &&
        link.store[RESOURCE_ENERGY] > 0
      ) {
        const baseLinkNeed =
          baseLink.store.getCapacity(RESOURCE_ENERGY) -
          baseLink.store[RESOURCE_ENERGY];
        const sourceLinkAmmount = link.store[RESOURCE_ENERGY];
        const transferAmount =
          sourceLinkAmmount < baseLinkNeed ? sourceLinkAmmount : baseLinkNeed;
        link.transferEnergy(baseLink, transferAmount);
      } else if (
        link.id == baseLink.id &&
        baseLink.store[RESOURCE_ENERGY] > 0 &&
        controllerLink.store[RESOURCE_ENERGY] < 700
      ) {
        const controllerLinkNeed =
          controllerLink.store.getCapacity(RESOURCE_ENERGY) -
          controllerLink.store[RESOURCE_ENERGY];
        const baseLinkAmount = baseLink.store[RESOURCE_ENERGY];
        const transferAmount =
          baseLinkAmount < controllerLinkNeed
            ? baseLinkAmount
            : controllerLinkNeed;
        link.transferEnergy(controllerLink, transferAmount);
      }
    }
  }

  // Spawn Loop
  for (const key in Game.spawns) {
    const spawn = Game.spawns[key];

    spawn.spawnNextCreep();
  }

  // Towers
  defenseManager.runTowers();

  // Creep Loop
  for (const key in Game.creeps) {
    const creep = Game.creeps[key];

    droneManager.runRole(creep);
  }
};

const droneManager = require("./DroneManager");
const structureManager = require("./StructureManager");
const defenseManager = require("./DefenseManager");
const memoryManager = require("./MemoryManager");
const visuals = require("./RoomVisuals");
require("./SpawnManager");

module.exports.loop = function () {
  // Clean memory
  memoryManager.cleanMemory();
  memoryManager.creepCount();

  // Room Loop
  //==================================
  for (const key in Game.rooms) {
    const room = Game.rooms[key];

    // Set up memory objects for room
    memoryManager.setRoomMemory(room);

    // Manage base building
    structureManager.build(room);

    // Run safe mode protection

    // Paint visuals
    visuals.paintPaths(room);
    if (room.memory.layoutScan.bunker) {
      visuals.paintLayoutScan(room);
    }
    if (room.memory.base) {
      defenseManager.safeMode(room);
      visuals.paintMisc(room);
    }
  }

  // Spawn Loop
  //==================================
  for (const key in Game.spawns) {
    const spawn = Game.spawns[key];

    spawn.spawnNextCreep();
  }

  // Towers
  defenseManager.runTowers();

  // Creep Loop
  //==================================
  for (const key in Game.creeps) {
    const creep = Game.creeps[key];

    droneManager.runRole(creep);
  }
};

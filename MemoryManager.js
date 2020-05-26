module.exports = {
  setRoomMemory: function (room) {
    // Basic rooms
    //================

    // init room memory
    if (!room.memory.base) {
      room.memory.base = false;
    }

    // Scan for bunker
    if (!room.memory.layoutScan) {
      room.memory.layoutScan = this.scanLayout(room);
    }

    // Set resources
    if (!room.memory.resources) {
      room.memory.resources = this.setResources(room);
    }

    // Count construction sites
    room.memory.construction = room.find(FIND_CONSTRUCTION_SITES).length;

    if (room.memory.base && !room.memory.creepCount) {
      room.memory.creepCount = {};
    }
    this.enemyCount(room);
    this.setCostMatrix(room);

    if (!room.memory.base) return;

    // Base rooms
    //================

    // Set satellites
    if (!room.memory.satellites) {
      room.memory.satellites = this.listSatellites(room, { distance: 2 });
    }
    if (!room.memory.paths || Game.time % 2000 === 0) {
      room.memory.paths = {};
      this.serializeHighways(room);
    }

    // Update room memory

    room.memory.structures = this.setStructures(room);
    if (room.memory.costMatrix) {
      this.setPaths(room);
    }
    this.setBunker(room);
    this.creepLimits(room);
    // this.viewSatellites(room);
    this.findRepairs(room);
  },

  // Define creep limits for a room
  creepLimits: function (room) {
    const soldiers = {};
    for (const satellite of room.memory.satellites) {
      soldiers[satellite] =
        Memory.rooms[satellite] && Memory.rooms[satellite].enemies
          ? Memory.rooms[satellite].enemies.total
          : undefined;
    }
    const diggerLimits = room.memory.structures.links.sourceLinkIDs.length || 0;
    const harvesterLimits = Object.keys(room.memory.resources.sources).length;
    const upgraderLimits = room.memory.structures.links.controllerLinkID
      ? 1
      : 2;
    const builderLimits =
      room.find(FIND_MY_CONSTRUCTION_SITES).length > 0 ? 1 : 0;
    const craneLimits = room.memory.structures.links.baseLinkID ? 1 : 0;
    const loaderLimits =
      room.controller.level >= 4 && room.storage !== undefined ? 1 : undefined;
    // (room.controller.level >= 4 && room.storage !== undefined) ? Math.floor(room.controller.level / 2) : 0

    // Save to memory
    if (!room.memory.spawnLimits) {
      room.memory.spawnLimits = {};
    }
    const spawnLimits = {
      upgrader: upgraderLimits,
      harvester: harvesterLimits - diggerLimits,
      builder: builderLimits,
      digger: diggerLimits,
      crane: craneLimits,
      loader: loaderLimits,
      soldier: soldiers,
    };
    room.memory.spawnLimits = spawnLimits;
  },

  enemyCount: function (room) {
    const creeps = room.find(FIND_HOSTILE_CREEPS).length;
    const powerCreeps = room.find(FIND_HOSTILE_POWER_CREEPS).length;
    const structures = room.find(FIND_HOSTILE_STRUCTURES).length;

    const enemies = {
      creeps: creeps || undefined,
      powerCreeps: powerCreeps || undefined,
      structures: structures || undefined,
      total: creeps + powerCreeps + structures,
    };
    room.memory.enemies = enemies;
  },

  // Count creeps
  creepCount: function () {
    const memory = {};

    for (const key in Game.creeps) {
      const creep = Game.creeps[key];
      const role = creep.memory.role;

      if (!memory[creep.memory.homeRoom]) {
        memory[creep.memory.homeRoom] = {
          creepCount: { soldier: {}, scout: {}, LDH: {} },
        };
      }
      switch (creep.memory.role) {
        case "upgrader":
        case "harvester":
        case "builder":
        case "digger":
        case "loader":
        case "test":
        case "crane":
          if (!memory[creep.memory.homeRoom].creepCount[role]) {
            memory[creep.memory.homeRoom].creepCount[role] = 0;
          }
          if (creep.ticksToLive > 51 || creep.spawning) {
            memory[creep.memory.homeRoom].creepCount[role]++;
          }
          break;

        case "scout":
        case "soldier":
          if (
            !memory[creep.memory.homeRoom].creepCount[role][
              creep.memory.targetRoom
            ]
          ) {
            memory[creep.memory.homeRoom].creepCount[role][
              creep.memory.targetRoom
            ] = 0;
          }
          if (creep.ticksToLive > 51 || creep.spawning) {
            memory[creep.memory.homeRoom].creepCount[role][
              creep.memory.targetRoom
            ]++;
          }
          break;

        case "LDH":
          if (
            !memory[creep.memory.homeRoom].creepCount[role][creep.memory.target]
          ) {
            memory[creep.memory.homeRoom].creepCount[role][
              creep.memory.target
            ] = 0;
          }
          if (creep.ticksToLive > 51 || creep.spawning) {
            memory[creep.memory.homeRoom].creepCount[role][
              creep.memory.target
            ]++;
          }
          break;
      }
    }

    for (const roomName of Object.keys(memory)) {
      memory[roomName].creepCount.energyCollectors =
        (memory[roomName].creepCount.harvester || 0) +
        (memory[roomName].creepCount.digger || 0);
      memory[roomName].creepCount.energyLoaders =
        (memory[roomName].creepCount.loader || 0) +
        (memory[roomName].creepCount.builder || 0) +
        (memory[roomName].creepCount.harvester || 0);
      Memory.rooms[roomName].creepCount = memory[roomName].creepCount;
    }
  },

  setStructures: function (room) {
    const myStructures = room.find(FIND_MY_STRUCTURES);

    // Set up spawns
    let spawnsMem = [];
    const spawns = _.filter(
      myStructures,
      (s) => s.structureType === STRUCTURE_SPAWN
    );
    for (let spawn of spawns) {
      if (spawnsMem.indexOf(spawn.id) == -1) {
        spawnsMem.push(spawn.id);
      }
    }

    // Set up links
    const myLinks = _.filter(
      myStructures,
      (s) => s.structureType === STRUCTURE_LINK
    );
    let baseLinkID = undefined;
    let controllerLinkID = undefined;
    let sourceLinkIDs = [];

    for (const key in myLinks) {
      const link = myLinks[key];
      // Find baseLink

      if (link.pos.inRangeTo(room.storage.pos, 2)) {
        baseLinkID = link.id;
      }
      // Find controllerLink
      else if (link.pos.inRangeTo(room.controller.pos, 2)) {
        controllerLinkID = link.id;
      }
      // Find sourceLinks
      else {
        const sources = room.find(FIND_SOURCES);
        for (const key in sources) {
          const source = sources[key];
          if (link.pos.inRangeTo(source.pos, 2)) {
            sourceLinkIDs.push(link.id);
            break;
          }
        }
      }
    }
    const linksMem = {
      sourceLinkIDs: sourceLinkIDs,
      baseLinkID: baseLinkID,
      controllerLinkID: controllerLinkID,
    };

    // Set up labs
    let labsMem = undefined;

    // Set up factory
    let factoryMem = undefined;
    const factorys = _.filter(
      myStructures,
      (s) => s.structureType === STRUCTURE_FACTORY
    );
    let factoryID = undefined;
    if (factorys.length > 0) {
      factoryID = factorys[0].id;
      factoryLevel = factorys[0].level;

      factoryMem = {
        ID: factoryID,
        level: factoryLevel,
      };
    }

    // Set up observer
    const observers = _.filter(
      myStructures,
      (s) => s.structureType === STRUCTURE_OBSERVER
    );

    let observerMem = undefined;
    let observerID = undefined;

    if (observers.length > 0) {
      observerID = observers[0].id;
    }
    observerMem = observerID;

    // Set up powerSpawn
    const powerSpawns = _.filter(
      myStructures,
      (s) => s.structureType === STRUCTURE_POWER_SPAWN
    );

    let powerSpawnMem = undefined;
    let powerSpawnID = undefined;

    if (powerSpawns.length > 0) {
      powerSpawnID = powerSpawns[0].id;
    }

    powerSpawnMem = powerSpawnID;

    // Set up nuker
    const nukers = _.filter(
      myStructures,
      (s) => s.structureType === STRUCTURE_NUKER
    );

    let nukerMem = undefined;
    let nukerID = undefined;
    let progress = undefined;

    if (nukers.length > 0) {
      nuker = nukers[0];
      nukerID = nuker.id;

      const totalLaunchCost = 305000;
      progress =
        ((nuker.store[RESOURCE_ENERGY] + nuker.store[RESOURCE_GHODIUM]) /
          totalLaunchCost) *
        100;

      nukerMem = {
        ID: nukerID,
        progress: `${progress}%`,
      };
    }

    const structures = {
      spawns: spawnsMem,
      links: linksMem,
      labs: labsMem,
      factory: factoryMem,
      observer: observerMem,
      powerSpawn: powerSpawnMem,
      nuker: nukerMem,
    };
    return structures;
  },

  setBunker: function (room) {
    // Set up bunker logistics
    if (room.memory.base && room.memory.layoutScan.bunker) {
      if (!room.memory.bunker) {
        room.memory.bunker = { NE: {}, NW: {}, SE: {}, SW: {} };
      }
      const startX = room.memory.layoutScan.pos.x;
      const startY = room.memory.layoutScan.pos.y;
      for (const direction of Object.keys(room.memory.bunker)) {
        let top;
        let left;
        let bottom;
        let right;

        // Define bunker quadrant
        switch (direction) {
          case "NE":
            top = startY;
            left = startX + 6;
            bottom = startY + 6;
            right = startX + 12;
            break;
          case "NW":
            top = startY;
            left = startX;
            bottom = startY + 6;
            right = startX + 6;
            break;
          case "SE":
            top = startY + 6;
            left = startX + 6;
            bottom = startY + 12;
            right = startX + 12;
            break;
          case "SW":
            top = startY + 6;
            left = startX;
            bottom = startY + 12;
            right = startX + 6;
            break;
        }
        // Scan quadrant
        const scan = room.lookForAtArea(
          LOOK_STRUCTURES,
          top,
          left,
          bottom,
          right,
          true
        );
        // Build list of extensions
        const extensions = [];
        for (const element of scan) {
          if (element.structure.structureType === "extension")
            extensions.push(element.structure.id);
        }
        room.memory.bunker[direction].extensions = extensions;
      }
    }
  },

  setPaths: function (room) {
    const costs = PathFinder.CostMatrix.deserialize(
      room.memory.costMatrix.costs
    );

    // find path from spawn1
    const startPos = Game.getObjectById(room.memory.structures.spawns[0]).pos;

    // build controller roads and link
    if (!room.memory.controllerPath) {
      room.memory.controllerPath = room.findPath(
        startPos,
        room.controller.pos,
        {
          serialize: true,
          range: 1,
          swampCost: 2,
          plainCost: 1,
          ignoreCreeps: true,
          ignoreRoads: true,
          costCallback: function () {
            return costs;
          },
        }
      );
    }
    // Paths to sources
    for (const sourceID of Object.keys(room.memory.resources.sources)) {
      if (!room.memory.resources.sources[sourceID].path) {
        const source = Game.getObjectById(sourceID);
        room.memory.resources.sources[sourceID].path = room.findPath(
          startPos,
          source.pos,
          {
            serialize: true,
            range: 1,
            swampCost: 2,
            plainCost: 1,
            ignoreCreeps: true,
            ignoreRoads: false,
            costCallback: function () {
              return costs;
            },
          }
        );
      }
    }
    // Path to mineral
    for (let mineralID of Object.keys(room.memory.resources.minerals)) {
      if (!room.memory.resources.minerals[mineralID].path) {
        const mineral = Game.getObjectById(mineralID);

        room.memory.resources.minerals[mineralID].path = room.findPath(
          startPos,
          mineral.pos,
          {
            serialize: true,
            range: 1,
            swampCost: 2,
            plainCost: 1,
            ignoreCreeps: true,
            ignoreRoads: true,
            costCallback: function () {
              return costs;
            },
          }
        );
      }
    }
  },

  cleanMemory: function () {
    // Clean Creep memory
    for (let name in Memory.creeps) {
      if (Game.creeps[name] == undefined) {
        delete Memory.creeps[name];
      }
    }
  },

  scanLayout: function (room) {
    const layouts = require("./layouts");
    const terrain = new Room.Terrain(room.name);

    let x = 0;
    let y = 0;
    let complete = false;
    let bunker = false;

    while (!complete) {
      const structureLayout = layouts.bunkerLayout(x, y);
      let = structureLayoutArray = Object.values(structureLayout);

      for (let key in structureLayoutArray) {
        const pos = structureLayoutArray[key].pos;
        switch (terrain.get(pos.x, pos.y)) {
          case TERRAIN_MASK_WALL:
            break;

          default:
            // if loop is on last value and succeeds scan is complete
            if (key == structureLayoutArray.length - 1) {
              complete = true;
              bunker = true;
              break;
            }
            continue;
        }
        if (x < 49 - 12) {
          if (!complete) {
            x++;
          }
        }
        // if scan passes Y edge of map it fails
        else if (y > 49 - 12) {
          x = 99;
          y = 99;
          complete = true;
          bunker = false;
        } else {
          y++;
          x = 0;
          continue;
        }

        break;
      }
      x = x;
      y = y;
    }
    const layoutScan = {
      pos: !bunker
        ? undefined
        : {
            x: x,
            y: y,
          },
      complete: complete,
      bunker: bunker,
    };

    return layoutScan;
  },

  setResources: function (room) {
    // Add resource IDs to memory
    const terrain = new Room.Terrain(room.name);
    // Add sources
    let sourceMem = {};
    let sources = room.find(FIND_SOURCES);
    if (sources.length > 0) {
      for (let source of sources) {
        sourceMem[source.id] = {};
        sourceMem[source.id].space = 0;
        let checkPos = [
          [source.pos.x - 1, source.pos.y - 1],
          [source.pos.x, source.pos.y - 1],
          [source.pos.x + 1, source.pos.y - 1],
          [source.pos.x - 1, source.pos.y],
          [source.pos.x + 1, source.pos.y],
          [source.pos.x - 1, source.pos.y + 1],
          [source.pos.x, source.pos.y + 1],
          [source.pos.x + 1, source.pos.y + 1],
        ];
        for (let pos of checkPos) {
          if (terrain.get(pos[0], pos[1]) === 0) {
            sourceMem[source.id].space++;
          }
        }
      }
    }
    // Add minerals
    let mineralMem = {};
    let minerals = room.find(FIND_MINERALS);
    if (minerals.length > 0) {
      for (let mineral of minerals) {
        mineralMem[mineral.id] = {};
        mineralMem[mineral.id].type = mineral.mineralType;
        mineralMem[mineral.id].space = 0;
        let checkPos = [
          [mineral.pos.x - 1, mineral.pos.y - 1],
          [mineral.pos.x, mineral.pos.y - 1],
          [mineral.pos.x + 1, mineral.pos.y - 1],
          [mineral.pos.x - 1, mineral.pos.y],
          [mineral.pos.x + 1, mineral.pos.y],
          [mineral.pos.x - 1, mineral.pos.y + 1],
          [mineral.pos.x, mineral.pos.y + 1],
          [mineral.pos.x + 1, mineral.pos.y + 1],
        ];
        for (let pos of checkPos) {
          if (terrain.get(pos[0], pos[1]) === 0) {
            mineralMem[mineral.id].space++;
          }
        }
      }
    }
    const resources = {
      sources: sourceMem,
      minerals: mineralMem,
    };
    return resources;
  },

  // Pathfinder.search to resources in satellite rooms
  serializeHighways: function (room) {
    /**
     * Serialize a Pathfinder object
     * @return {object} Return a collection of serialized paths with room names as keys.
     * @param {object} path - Pathfinder.search object
     */
    function serializePathfinder(path) {
      // Check parameter is valid
      if (
        !_.isArray(path.path) ||
        !_.isNumber(path.ops) ||
        !_.isNumber(path.cost) ||
        !_.isBoolean(path.incomplete)
      )
        return ERR_INVALID_ARGS;
      /**
       * Extensive comparison of two arrays
       * @param {array} a
       * @param {array} b
       */
      function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        for (var i = 0; i < a.length; ++i) {
          if (a[i] !== b[i]) return false;
        }
        return true;
      }

      offsetsByDirection = {
        [TOP]: [0, -1],
        [TOP_RIGHT]: [1, -1],
        [RIGHT]: [1, 0],
        [BOTTOM_RIGHT]: [1, 1],
        [BOTTOM]: [0, 1],
        [BOTTOM_LEFT]: [-1, 1],
        [LEFT]: [-1, 0],
        [TOP_LEFT]: [-1, -1],
      };
      const paths = {};
      // Sort positions together by room
      for (const position of Object.values(path.path)) {
        if (!paths[position.roomName]) {
          paths[position.roomName] = [];
        }
        paths[position.roomName].push(position);
      }
      // Build serialized string from sorted position arrays
      for (const roomName of Object.keys(paths)) {
        const path = paths[roomName];
        if (!path.length) continue;

        let result = "";
        result += path[0].x > 9 ? path[0].x : "0" + path[0].x;
        result += path[0].y > 9 ? path[0].y : "0" + path[0].y;
        result += 1;
        for (let i = 1; i < path.length; i++) {
          const offset = [path[i].x - path[i - 1].x, path[i].y - path[i - 1].y];
          for (const key of Object.keys(offsetsByDirection)) {
            if (arraysEqual(offset, offsetsByDirection[key])) {
              result += key;
            }
          }
        }

        paths[roomName] = result;
        // console.log(paths[roomName]);
      }
      return paths;
    }

    for (const satellite of room.memory.satellites) {
      const path = PathFinder.search(
        room.storage.pos,
        {
          pos: new RoomPosition(24, 24, satellite),
          range: 25,
        },
        {
          maxOps: 8000,
          swampCost: 3,
          plainCost: 2,
          roomCallback: function (roomName) {
            if (Memory.rooms[roomName] && Memory.rooms[roomName].costMatrix) {
              return PathFinder.CostMatrix.deserialize(
                Memory.rooms[roomName].costMatrix.costs
              );
            }
          },
        }
      );
      for (const position of path.path) {
        const testRoom = Game.rooms[position.roomName];
        if (_.isUndefined(testRoom)) continue;
        // testRoom.visual.circle(position);
      }
      //
      const serializedPath = serializePathfinder(path);
      for (const roomName of Object.keys(serializedPath)) {
        // Skips path sections in destination room
        if (roomName === satellite) continue;

        const localPath = serializedPath[roomName];
        Memory.rooms[roomName].paths[`${room.name}_${satellite}`] = localPath;
      }
    }
  },

  // update costMatrix
  setCostMatrix: function (room) {
    if (!room.memory.costMatrix) {
      const costs = new PathFinder.CostMatrix();
      if (room.memory.base) {
        // build walls ever N tiles
        const modVar = 3;
        // Generate list of room coordinates around edge
        let edges = [];
        for (i = 2; i <= 47; i++) {
          // top
          edges.push([i, 2]);

          // bottom
          edges.push([i, 47]);

          // left
          edges.push([2, i]);

          // right
          edges.push([47, i]);
        }

        for (let i of edges) {
          let pos = new RoomPosition(i[0], i[1], room.name);
          if (pos.findInRange(FIND_EXIT, 2).length != 0) {
            if (
              ((pos.x === 2 || pos.x === 47) && pos.y % modVar !== 0) ||
              ((pos.y === 2 || pos.y === 47) && pos.x % modVar !== 0)
            ) {
              costs.set(pos.x, pos.y, 8);
            }
          }
        }
      }
      room.memory.costMatrix = { costs: costs.serialize(), tick: Game.time };
    } else {
      const costs = PathFinder.CostMatrix.deserialize(
        room.memory.costMatrix.costs
      );
      // Roads
      const roads = room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType === STRUCTURE_ROAD,
      });
      for (const road of roads) {
        costs.set(road.pos.x, road.pos.y, 1);
      }
      // Add bunker positions to matrix
      if (room.memory.layoutScan.bunker && room.memory.base) {
        const terrain = Game.map.getRoomTerrain(room.name);
        const bunkerLayout = Object.values(
          require("./layouts").bunkerLayout(
            room.memory.layoutScan.pos.x,
            room.memory.layoutScan.pos.y
          )
        );
        const bunkerRoads = require("./layouts").bunkerRoadLayout(
          room.memory.layoutScan.pos.x,
          room.memory.layoutScan.pos.y
        );
        for (let entry of bunkerLayout) {
          costs.set(entry.pos.x, entry.pos.y, 255);
        }
        for (let road of bunkerRoads) {
          if (terrain.get(road.x, road.y) !== TERRAIN_MASK_WALL) {
            costs.set(road.x, road.y, 1);
          }
        }
      }

      // const walls = room.find(FIND_STRUCTURES, {
      //   filter: (s) => s.structureType === STRUCTURE_WALL,
      // });
      // for (const wall of walls) {
      //   costs.set(wall.pos.x, wall.pos.y, 8);
      // }
      // const creeps = room.find(FIND_CREEPS);
      // for (const creep of creeps) {
      //   costs.set(creep.pos.x, creep.pos.y, 8);
      // }
      room.memory.costMatrix = { costs: costs.serialize(), tick: Game.time };
    }
  },

  // generate array of satellite room names
  listSatellites: function (room, opts) {
    opts = opts || {};
    opts.range = _.isUndefined(opts.range) ? 10 : opts.range;

    let satellites = [];

    const roomNameArray = room.name.match(/[A-Z][0-9]+/g);
    const roomCords = {
      cardinalX: roomNameArray[0][0],
      cardinalXO: roomNameArray[0][0] == "W" ? "E" : "W",
      x: roomNameArray[0].slice(1, roomNameArray[0].length),
      cardinalY: roomNameArray[1][0],
      cardinalYO: roomNameArray[1][0] == "N" ? "S" : "N",
      y: roomNameArray[1].slice(1, roomNameArray[1].length),
    };

    for (i = -opts.range; i <= opts.range; i++) {
      const y = parseInt(roomCords.y) + i;
      for (j = -opts.range; j <= opts.range; j++) {
        const x = parseInt(roomCords.x) + j;

        const cardinalX = x < 0 ? roomCords.cardinalXO : roomCords.cardinalX;
        const cardinalY = y < 0 ? roomCords.cardinalYO : roomCords.cardinalY;
        const stringX = x < 0 ? Math.abs(x) - 1 : x;
        const stringY = y < 0 ? Math.abs(y) - 1 : y;

        const roomString = cardinalX + stringX + cardinalY + stringY;
        if (roomString !== room.name) {
          if (_.isNumber(opts.distance)) {
            if (
              Game.map.findRoute(room.name, roomString).length <= opts.distance
            ) {
              satellites.push(roomString);
            }
          } else {
            satellites.push(roomString);
          }
        }
      }
    }
    return satellites;
  },

  viewSatellites: function (room) {
    const satellitesMem = room.memory.satellites;
    for (const key of Object.keys(satellitesMem)) {
      if (Game.map.getRoomStatus(key).status === "closed") continue;
      const satelliteRoom = Game.rooms[key];
      let satelliteMemory = satellitesMem[key];

      let visable = false;
      let sourceMem = satelliteMemory.sources
        ? satelliteMemory.sources
        : undefined;
      let mineralMem = satelliteMemory.minerals
        ? satelliteMemory.minerals
        : undefined;
      let depositMem = undefined;
      let powerMem = undefined;
      let creepMem = {};
      let enemyMem = undefined;
      let constructionMem = undefined;
      let distanceMem = satelliteMemory.distance
        ? satelliteMemory.distance
        : Game.map.findRoute(room.name, key).length;

      // update memory if room is visable
      if (satelliteRoom) {
        visable = true;

        // Add remote sources
        const sources = satelliteRoom.find(FIND_SOURCES);
        if (sources.length) {
          let sourceBuffer = {};
          for (const source of sources) {
            sourceBuffer[source.id] = {};
          }
          sourceMem = sourceBuffer;
        }
        // Add remote minerals
        const minerals = satelliteRoom.find(FIND_MINERALS);
        if (minerals.length) {
          let mineralBuffer = {};
          for (const mineral of minerals) {
            mineralBuffer[mineral.id] = {
              type: mineral.mineralType,
            };
          }
          mineralMem = mineralBuffer;
        }
        // Add remote deposits
        const deposits = satelliteRoom.find(FIND_DEPOSITS);
        if (deposits.length) {
          let depositBuffer = {};
          for (const deposit of deposits) {
            depositBuffer[deposit.id] = {
              type: deposit.depositType,
              decay: deposit.ticksToDecay,
            };
          }
          depositMem = depositBuffer;
        }
        // Add remote power
        const powerBanks = satelliteRoom.find(FIND_STRUCTURES, {
          filter: (s) => s.structureType === STRUCTURE_POWER_BANK,
        });
        if (powerBanks.length) {
          let powerBuffer = {};
          for (const power of powerBanks) {
            powerBuffer[power.id] = {
              decay: power.ticksToDecay,
            };
          }
          powerMem = powerBuffer;
        }
        // Add creep counts
        // const myCreeps = satelliteRoom.find(FIND_MY_CREEPS);

        // Add enemy counts
        const enemyCreeps = satelliteRoom.find(FIND_HOSTILE_CREEPS).length;
        const enemyPowerCreeps = satelliteRoom.find(FIND_HOSTILE_POWER_CREEPS)
          .length;
        const enemyStructures = satelliteRoom.find(FIND_HOSTILE_STRUCTURES)
          .length;

        enemyMem = {
          creeps: enemyCreeps ? enemyCreeps : undefined,
          powerCreeps: enemyPowerCreeps ? enemyPowerCreeps : undefined,
          structures: enemyStructures ? enemyStructures : undefined,
          total: this.creeps + this.powerCreeps + this.structures,
        };

        // Add construction sites
        const constructionSites = satelliteRoom.find(FIND_CONSTRUCTION_SITES);
        constructionMem = constructionSites.length
          ? constructionSites.length
          : undefined;
      }

      // check if LDH is still alive
      if (satelliteMemory.sources) {
        for (const source of Object.keys(satelliteMemory.sources)) {
          const LDH = Game.getObjectById(satelliteMemory.sources[source].LDH);
          satelliteMemory.sources[source].LDH =
            _.isNull(LDH) || LDH.ticksToLive < 187
              ? undefined
              : satelliteMemory.sources[source].LDH;
        }
      }
      // Set memory
      const satelliteMem = {
        visable: visable,
        sources: sourceMem,
        minerals: mineralMem,
        deposits: depositMem,
        power: powerMem,
        creeps: creepMem,
        enemies: enemyMem,
        construction: constructionMem,
        distance: distanceMem,
      };
      satelliteMemory = satelliteMem;
    }
  },

  findRepairs: function (room) {
    if (!room.memory.structures.repairs) {
      room.memory.structures.repairs = {
        mostDamagedStructure: {},
        mostDamagedWall: {},
        mostDamagedRoad: {},
        mostDamagedContainer: {},
      };
    }

    function repairIterator(objectArray, opts) {
      if (!_.isArray(objectArray)) {
        return ERR_INVALID_ARGS;
      }
      opts = opts || {};

      if (_.isUndefined(opts.percentage)) {
        opts.percentage = 0.0001;
      }

      const objects = objectArray;

      if (objects.length > 0) {
        let returnObject = { id: null, percent: 0 };

        // find object with less than hits than percentage
        for (
          let percentage = opts.percentage;
          percentage <= 1;
          percentage = percentage + opts.percentage
        ) {
          for (let element of objects) {
            if (element.hits / element.hitsMax < percentage) {
              returnObject.id = element.id;
              returnObject.percent = percentage;
              return returnObject;
            }
          }
        }
      } else {
        return ERR_NOT_FOUND;
      }
    }

    // Owned Structure repairs
    // ========================================
    const mostDamagedStructureMemory =
      room.memory.structures.repairs.mostDamagedStructure;
    const mostDamagedStructureLT = Game.getObjectById(
      mostDamagedStructureMemory.id
    );

    // Check if new target is required
    if (
      _.isNull(mostDamagedStructureLT) ||
      mostDamagedStructureLT.hits / mostDamagedStructureLT.hitsMax >
        mostDamagedStructureMemory.percent
    ) {
      const damagedStructures = room.find(FIND_MY_STRUCTURES, {
        filter: (s) => s.hits < s.hitsMax,
      });
      const mostDamagedStructure = repairIterator(damagedStructures, {
        percentage: 0.0001,
      });

      if (!_.isObject(mostDamagedStructure)) {
        mostDamagedStructureMemory.id = undefined;
        mostDamagedStructureMemory.percent = undefined;
      } else {
        mostDamagedStructureMemory.id = mostDamagedStructure.id;
        mostDamagedStructureMemory.percent = mostDamagedStructure.percent;
      }
    }

    // Neutral structure repairs
    // ========================================
    const damagedStructures = room.find(FIND_STRUCTURES, {
      filter: (s) => s.hits < s.hitsMax,
    });

    // Wall Repairs
    const mostDamagedWallMemory =
      room.memory.structures.repairs.mostDamagedWall;
    const mostDamagedWallLT = Game.getObjectById(mostDamagedWallMemory.id);
    // Check if new target is required
    if (
      _.isNull(mostDamagedWallLT) ||
      mostDamagedWallLT.hits / mostDamagedWallLT.hitsMax >
        mostDamagedWallMemory.percent
    ) {
      const damagedWalls = _.filter(
        damagedStructures,
        (s) => s.structureType === STRUCTURE_WALL
      );
      const mostDamagedWall = repairIterator(damagedWalls);

      if (!_.isObject(mostDamagedWall)) {
        mostDamagedWallMemory.id = undefined;
        mostDamagedWallMemory.percent = undefined;
      } else {
        mostDamagedWallMemory.id = mostDamagedWall.id;
        mostDamagedWallMemory.percent = mostDamagedWall.percent;
      }
    }

    // Road Repairs
    // ========================================
    const mostDamagedRoadMemory =
      room.memory.structures.repairs.mostDamagedRoad;
    const mostDamagedRoadLT = Game.getObjectById(mostDamagedRoadMemory.id);
    // Check if new target is required
    if (
      _.isNull(mostDamagedRoadLT) ||
      mostDamagedRoadLT.hits / mostDamagedRoadLT.hitsMax >
        mostDamagedRoadMemory.percent
    ) {
      const damagedRoads = _.filter(
        damagedStructures,
        (s) => s.structureType === STRUCTURE_ROAD
      );
      const mostDamagedRoad = repairIterator(damagedRoads, {
        percentage: 0.01,
      });
      if (!_.isObject(mostDamagedRoad)) {
        mostDamagedRoadMemory.id = undefined;
        mostDamagedRoadMemory.percent = undefined;
      } else {
        mostDamagedRoadMemory.id = mostDamagedRoad.id;
        mostDamagedRoadMemory.percent = mostDamagedRoad.percent;
      }
    }

    // Container Repairs
    // ========================================
    const mostDamagedContainerMemory =
      room.memory.structures.repairs.mostDamagedContainer;
    const mostDamagedContainerLT = Game.getObjectById(
      mostDamagedContainerMemory.id
    );
    // Check if new target is required
    if (
      _.isNull(mostDamagedContainerLT) ||
      mostDamagedContainerLT.hits / mostDamagedContainerLT.hitsMax >
        mostDamagedContainerMemory.percent
    ) {
      const damagedContainers = _.filter(
        damagedStructures,
        (s) => s.structureType === STRUCTURE_CONTAINER
      );
      const mostDamagedContainer = repairIterator(damagedContainers, {
        percentage: 0.01,
      });
      if (!_.isObject(mostDamagedContainer)) {
        mostDamagedContainerMemory.id = undefined;
        mostDamagedContainerMemory.percent = undefined;
      } else {
        mostDamagedContainerMemory.id = mostDamagedContainer.id;
        mostDamagedContainerMemory.percent = mostDamagedContainer.percent;
      }
    }
  },
};

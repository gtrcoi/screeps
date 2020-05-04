module.exports = {
  buildBunker: function (room) {
    const startX = room.memory.layoutScan.pos.x;
    const startY = room.memory.layoutScan.pos.y;
    const structureLayout = require("./layouts").bunkerLayout(startX, startY);
    const roadLayout = require("./layouts").bunkerRoadLayout(startX, startY);
    const terrain = new Room.Terrain(room.name);

    for (let key in structureLayout) {
      const x = structureLayout[key].pos.x;
      const y = structureLayout[key].pos.y;
      const s = structureLayout[key].structureType;
      room.createConstructionSite(x, y, s);
    }

    for (let key in roadLayout) {
      const x = roadLayout[key].x;
      const y = roadLayout[key].y;

      if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
        room.createConstructionSite(x, y, STRUCTURE_ROAD);
        room.createConstructionSite(x, y, STRUCTURE_RAMPART);
      }
    }

    if (room.controller.level === 8) {
      room.memory.base = false;
    }
  },

  buildLocal: function (room) {
    const costs = PathFinder.CostMatrix.deserialize(room.memory.costMatrix);

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

    const controllerPath = Room.deserializePath(room.memory.controllerPath);

    for (const pos of controllerPath) {
      switch (controllerPath.indexOf(pos)) {
        case controllerPath.length - 1:
          room.createConstructionSite(pos.x, pos.y, STRUCTURE_LINK);
          break;

        case controllerPath.length - 2:
          room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);

        default:
          room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
          break;
      }
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
            ignoreRoads: true,
            costCallback: function () {
              return costs;
            },
          }
        );
      }
    }

    let sourcePaths = [];
    for (const source of Object.values(room.memory.resources.sources)) {
      sourcePaths.push(Room.deserializePath(source.path));
    }

    // build roads, containers, and links for sources
    for (const path of sourcePaths) {
      for (const pos of path) {
        switch (path.indexOf(pos)) {
          case path.length - 1:
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
            break;

          case path.length - 2:
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_LINK);
            break;

          default:
            break;
        }
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
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

    // build road and container for minerals
    let mineralPaths = [];
    for (const mineral of Object.values(room.memory.resources.minerals)) {
      mineralPaths.push(Room.deserializePath(mineral.path));
    }
    for (const path of mineralPaths) {
      for (const pos of path) {
        if (path.indexOf(pos) === path.length - 1) {
          room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER);
        }
        room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
      }
    }
  },

  buildRamparts: function (room) {
    let myBuildings = room.find(FIND_MY_STRUCTURES, {
      filter: (b) =>
        b.structureType === STRUCTURE_LINK ||
        b.structureType === STRUCTURE_EXTENSION ||
        b.structureType === STRUCTURE_SPAWN ||
        b.structureType === STRUCTURE_STORAGE ||
        b.structureType === STRUCTURE_TOWER ||
        b.structureType === STRUCTURE_LAB ||
        b.structureType === STRUCTURE_TERMINAL ||
        b.structureType === STRUCTURE_OBSERVER ||
        b.structureType === STRUCTURE_NUKER ||
        b.structureType === STRUCTURE_FACTORY,
    });
    let neutralBuildings = room.find(FIND_STRUCTURES, {
      filter: (b) => b.structureType === STRUCTURE_CONTAINER,
    });
    let rampartBuildings = myBuildings.concat(neutralBuildings);
    for (let key in rampartBuildings) {
      let building = rampartBuildings[key];
      room.createConstructionSite(building.pos, STRUCTURE_RAMPART);
    }
  },

  // Rebuild base from ruins
  rebuild: function (room) {
    const ruins = room.find(FIND_RUINS, {
      filter: (r) => r.ticksToDecay > 500,
    });

    // Construct on ruins
    for (key in ruins) {
      let ruin = ruins[key];
      room.createConstructionSite(ruin.pos, ruin.structure.structureType);
    }
  },

  scanLayout: function (room) {
    const layouts = require("./layouts");
    const terrain = new Room.Terrain(room.name);
    let x = 0;
    let y = 0;

    if (!room.memory.layoutScan) {
      room.memory.layoutScan = { pos: {} };
    }

    while (!room.memory.layoutScan.complete) {
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
              room.memory.layoutScan.complete = true;
              room.memory.layoutScan.bunker = true;
              break;
            }
            continue;
        }
        if (x < 49 - 12) {
          if (!room.memory.layoutScan.complete) {
            x++;
          }
        }
        // if scan fails to find space
        else if (y > 49 - 12) {
          x = 99;
          y = 99;
          room.memory.layoutScan.complete = true;
          room.memory.layoutScan.bunker = false;
        } else {
          y++;
          x = 0;
          continue;
        }

        break;
      }
      room.memory.layoutScan.pos.x = x;
      room.memory.layoutScan.pos.y = y;
    }
  },

  wallExits: function (room) {
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
          ((pos.x === 2 || pos.x === 47) && pos.y % modVar === 0) ||
          ((pos.y === 2 || pos.y === 47) && pos.x % modVar === 0)
        ) {
          room.createConstructionSite(pos, STRUCTURE_RAMPART);
        } else {
          room.createConstructionSite(pos, STRUCTURE_WALL);
        }
      }
    }
  },
};

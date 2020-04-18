module.exports = {

    buildBunker: function(room) {
        const startX = room.memory.layoutScan.pos.x;
        const startY = room.memory.layoutScan.pos.y;
        const structureLayout = require('./layouts').bunkerLayout(startX, startY);
        const roadLayout = require('./layouts').bunkerRoadLayout(startX, startY);
        const terrain = new Room.Terrain(room.name);

        for (let key in structureLayout) {
            const x = structureLayout[key].pos.x;
            const y = structureLayout[key].pos.y;
            const s = structureLayout[key].structureType;
            room.createConstructionSite(x, y, s)
        }

        for (let key in roadLayout) {
            const x = roadLayout[key].x;
            const y = roadLayout[key].y;

            if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                room.createConstructionSite(x, y, STRUCTURE_ROAD)
                room.createConstructionSite(x, y, STRUCTURE_RAMPART)
            }
        }

        if (room.controller.level === 8) {
            room.memory.base = false;
        }
    },

    buildLocal: function(room) {
        const costs = PathFinder.CostMatrix.deserialize(room.memory.costMatrix)

        // find path from spawn1
        const startPos = Game.getObjectById(room.memory.structures.spawns[0]).pos;

        // build controller roads and link
        const controllerPath = room.findPath(startPos, room.controller.pos, { range: 1, ignoreCreeps: true, costCallback: function() { return costs; } });

        for (let pos of controllerPath) {
            if (controllerPath.indexOf(pos) === controllerPath.length - 1) {
                room.createConstructionSite(pos.x, pos.y, STRUCTURE_LINK)
            };
            room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
        }

        // Paths to sources
        let sourcePaths = [];
        for (let sourceID of room.memory.resources.sources) {
            const source = Game.getObjectById(sourceID);
            sourcePaths.push(
                room.findPath(startPos, source.pos, { range: 1, ignoreCreeps: true, costCallback: function() { return costs; } })
            )
        }

        // build roads, containers, and links for sources
        for (let path of sourcePaths) {
            for (let pos of path) {
                switch (path.indexOf(pos)) {
                    case path.length - 1:
                        room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER)
                        break;
                    case path.length - 2:
                        room.createConstructionSite(pos.x, pos.y, STRUCTURE_LINK)
                    default:
                        break;
                }
                room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
            }
        }

        // Path to mineral
        let mineralPaths = []
        for (let mineralID of room.memory.resources.minerals) {
            const mineral = Game.getObjectById(mineralID);
            mineralPaths.push(
                room.findPath(startPos, mineral.pos, { range: 1, ignoreCreeps: true, costCallback: function() { return costs; } })
            )
        }

        // build road and container for minerals
        for (let path of mineralPaths) {
            for (let pos of path) {
                if (path.indexOf(pos) === path.length - 1) {
                    room.createConstructionSite(pos.x, pos.y, STRUCTURE_CONTAINER)
                }
                room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD)
            }
        }
    },

    buildRamparts: function(room) {
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
                b.structureType === STRUCTURE_FACTORY
        });
        let neutralBuildings = room.find(FIND_STRUCTURES, {
            filter: (b) =>
                b.structureType === STRUCTURE_CONTAINER
        });
        let rampartBuildings = myBuildings.concat(neutralBuildings);
        for (let key in rampartBuildings) {
            let building = rampartBuildings[key];
            room.createConstructionSite(building.pos, STRUCTURE_RAMPART);
        }
    },

    // Rebuild base from ruins
    rebuild: function(room) {
        const ruins = room.find(FIND_RUINS, { filter: r => r.ticksToDecay > 500 });

        // Construct on ruins
        for (key in ruins) {
            let ruin = ruins[key];
            room.createConstructionSite(ruin.pos, ruin.structure.structureType)
        }
    },

    scanLayout: function(room) {
        const layouts = require('./layouts');
        const terrain = new Room.Terrain(room.name)
        let x = 0;
        let y = 0;

        while (room.memory.layoutScan.complete === false) {
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
                    room.memory.layoutScan.fail = true;
                } else {
                    y++;
                    x = 0;
                    continue;
                }

                break;
            }
            room.memory.layoutScan.pos.x = x
            room.memory.layoutScan.pos.y = y
        }
    }
}
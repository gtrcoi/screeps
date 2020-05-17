require("./DronePrototypes");

module.exports = {
  // Run the role for all drones
  runRole: function (creep) {
    let operations = [];
    const creepCarry = creep.store[RESOURCE_ENERGY];
    const creepCarryCapacity = creep.store.getCapacity();

    // Cases for switching states
    if (creep.memory.working && creepCarry === 0) {
      creep.memory.working = false;
    } else if (!creep.memory.working && creepCarry === creepCarryCapacity) {
      creep.memory.working = true;
    }

    switch (creep.memory.role) {
      case "builder":
        if (creep.memory.working) {
          operations = [
            function () {
              return creep.moveToRoom(creep.memory.homeRoom);
            },
            function () {
              return creep.rechargeTower({ percent: 50 });
            },
            function () {
              return creep.repairRoad({ percent: 50 });
            },
            function () {
              return creep.construct();
            },
            function () {
              return creep.rechargeTower();
            },
            function () {
              return creep.chargeController();
            },
          ];
        } else {
          operations = [
            function () {
              return creep.collectDroppedSource();
            },
            function () {
              return creep.withdrawTombstone();
            },
            function () {
              return creep.collectRuin();
            },
            function () {
              return creep.collectStorage();
            },
            function () {
              return creep.harvestSource();
            },
          ];
          if (
            Object.keys(creep.room.memory.resources.sources).length >
            creep.room.memory.creepCount.digger
          ) {
            operations.unshift(
              function () {
                return creep.collectContainer();
              },
              function () {
                return creep.harvestSource();
              }
            );
          }
        }
        for (key = 0; key < operations.length; key++) {
          if (operations[key]() == OK) {
            break;
          }
        }
        break;
      case "upgrader":
        if (creep.memory.working) {
          operations = [
            function () {
              return creep.moveToRoom(creep.memory.homeRoom);
            },
            function () {
              return creep.chargeController();
            },
          ];

          if (!Memory.rooms[creep.memory.homeRoom].creepCount.energyLoaders) {
            operations.unshift(function () {
              return creep.chargeSpawn();
            });
          }
        } else {
          operations = [
            function () {
              return creep.collectDroppedSource({ range: 10 });
            },
            function () {
              return creep.withdrawTombstone();
            },
            function () {
              return creep.collectRuin();
            },
            function () {
              return creep.collectStorage();
            },
          ];

          if (creep.room.memory.spawnLimits.energyCollectors === 0) {
            operations.unshift(
              function () {
                return creep.collectContainer();
              },
              function () {
                return creep.harvestSource();
              }
            );
          }

          if (creep.room.memory.structures.links.controllerLinkID) {
            const controllerPath = Room.deserializePath(
              creep.room.memory.controllerPath
            );
            const upgraderHomePos = new RoomPosition(
              controllerPath[controllerPath.length - 2].x,
              controllerPath[controllerPath.length - 2].y,
              creep.room.name
            );
            operations = [
              function () {
                return creep.collectDroppedSource({ range: 1 });
              },
              function () {
                return creep.collectContainer(undefined, { range: 1 });
              },
              function () {
                return creep.collectLink(
                  creep.room.memory.structures.links.controllerLinkID
                );
              },
            ];

            if (!creep.pos.isEqualTo(upgraderHomePos)) {
              operations.unshift(function () {
                return creep.moveTo(upgraderHomePos);
              });
            }
          }
        }
        for (let key = 0; key < operations.length; key++) {
          if (operations[key]() == OK) {
            break;
          }
        }
        break;
      case "harvester":
        if (creep.memory.working) {
          operations = [
            function () {
              return creep.moveToRoom(creep.memory.homeRoom);
            },
            function () {
              return creep.chargeSpawn();
            },
            function () {
              return creep.chargeStorage();
            },
            function () {
              return creep.construct();
            },
            function () {
              return creep.rechargeTower();
            },
            function () {
              return creep.chargeController();
            },
          ];
        } else {
          operations = [
            function () {
              return creep.collectDroppedSource();
            },
            function () {
              return creep.withdrawTombstone();
            },
            function () {
              return creep.collectRuin();
            },
            function () {
              return creep.collectContainer();
            },
            function () {
              return creep.harvestSource();
            },
          ];
        }
        for (key = 0; key < operations.length; key++) {
          if (operations[key]() == OK) {
            break;
          }
        }
        break;
      case "digger":
        if (creep.memory.working) {
          if (!creep.room.memory.creepCount.energyLoaders) {
            creep.chargeSpawn();
          } else {
            creep.chargeLink(creep.memory.linkID);
          }
          break;
        } else {
          const sourcePath = Room.deserializePath(
            creep.room.memory.resources.sources[creep.memory.sourceID].path
          );
          const sourcePos = new RoomPosition(
            sourcePath[sourcePath.length - 1].x,
            sourcePath[sourcePath.length - 1].y,
            creep.room.name
          );
          operations = [
            function () {
              return creep.harvestSource(creep.memory.sourceID);
            },
          ];
          if (!creep.pos.isEqualTo(sourcePos)) {
            operations.unshift(function () {
              return creep.moveTo(sourcePos);
            });
          }
          if (
            creep.memory.containerID !== undefined ||
            !_.isNull(Game.getObjectById(creep.memory.containerID))
          ) {
            operations.push(function () {
              return creep.collectContainer(creep.memory.containerID);
            });
          } else {
            operations.unshift(function () {
              return creep.collectDroppedSource({ range: 1 });
            });
          }
          for (key = 0; key < operations.length; key++) {
            if (operations[key]() == OK) {
              break;
            }
          }
          break;
        }
      case "loader":
        if (creep.memory.working) {
          operations = [
            function () {
              return creep.chargeSpawn();
            },
            function () {
              return creep.rechargeTower({ range: 3 });
            },
          ];
          if (!creep.pos.isEqualTo(creep.memory.rest.x, creep.memory.rest.y)) {
            operations.push(function () {
              return creep.moveTo(creep.memory.rest.x, creep.memory.rest.y);
            });
          }
        } else {
          operations = [
            function () {
              return creep.collectStorage();
            },
          ];
          if (!creep.pos.isEqualTo(creep.memory.rest.x, creep.memory.rest.y)) {
            operations.push(function () {
              return creep.moveTo(creep.memory.rest.x, creep.memory.rest.y);
            });
          }
        }
        for (key = 0; key < operations.length; key++) {
          if (operations[key]() == OK) {
            break;
          }
        }
        break;

      case "LDH":
        if (creep.memory.working) {
          operations = [
            function () {
              return creep.chargeStorage();
            },
            function () {
              return creep.chargeSpawn();
            },
            function () {
              return creep.construct();
            },
            function () {
              return creep.moveToRoom(creep.memory.homeRoom);
            },
          ];
          if (creep.room.name !== creep.memory.homeRoom) {
            operations.unshift(function () {
              return creep.repairRoad();
            });
          }
        } else {
          operations = [
            function () {
              return creep.moveToRoom(creep.memory.targetRoom);
            },
            function () {
              return creep.collectDroppedSource();
            },
            function () {
              return creep.withdrawTombstone();
            },
            function () {
              return creep.harvestSource(creep.memory.target);
            },
          ];
        }
        for (key = 0; key < operations.length; key++) {
          if (operations[key]() == OK) {
            // console.log(`${creep.memory.working} ${key}`);
            break;
          }
        }
        break;

      case "crane":
        const baseLink = Game.getObjectById(
          creep.room.memory.structures.links.baseLinkID
        );
        const controllerLink = Game.getObjectById(
          creep.room.memory.structures.links.controllerLinkID
        );
        const pos = new RoomPosition(
          creep.room.memory.layoutScan.pos.x + 5,
          creep.room.memory.layoutScan.pos.y + 6,
          creep.room.name
        );

        operations = [
          function () {
            return creep.chargeStorage();
          },
        ];

        if (baseLink.store[RESOURCE_ENERGY] > 0) {
          operations.unshift(function () {
            return creep.collectLink(
              creep.room.memory.structures.links.baseLinkID
            );
          });
        }
        if (
          baseLink.cooldown === 0 &&
          !_.isNull(controllerLink) &&
          controllerLink.store[RESOURCE_ENERGY] <
            controllerLink.store.getCapacity(RESOURCE_ENERGY) - 100
        ) {
          operations = [
            function () {
              return creep.collectStorage();
            },
            function () {
              return creep.chargeLink(baseLink.id);
            },
          ];
        }
        if (
          !creep.pos.isEqualTo(pos) &&
          pos.lookFor(LOOK_CREEPS).length === 0
        ) {
          operations.unshift(function () {
            return creep.moveTo(pos);
          });
        }
        for (key = 0; key < operations.length; key++) {
          if (operations[key]() == OK) {
            break;
          }
        }
        break;

      case "scout":
        const goal = new RoomPosition(24, 24, creep.memory.targetRoom);
        operations = [
          function () {
            return creep.moveTo(goal);
          },
          function () {
            return creep.moveToRoom(creep.memory.targetRoom);
          },
        ];
        for (key = 0; key < operations.length; key++) {
          if (operations[key]() == OK) {
            break;
          }
        }
        break;
      case "soldier":
        operations = [
          function () {
            return creep.moveToRoom(creep.memory.targetRoom);
          },
          function () {
            return creep.killStuff();
          },
        ];
        for (key = 0; key < operations.length; key++) {
          if (operations[key]() == OK) {
            break;
          }
        }
        break;

      case "test":
        const targetRoom = "W9N2";
        const testPath = Game.map.findRoute(creep.room.name, targetRoom);
        const testTarget =
          testPath.length > 0
            ? creep.pos.findClosestByPath(testPath[0].exit)
            : new RoomPosition(24, 24, targetRoom);
        // console.log(testTarget);
        // const testPosPath = creep.pos.findPathTo(testTarget);
        // console.log(testPosPath);
        // const testRoute = PathFinder.search(creep.pos, testTarget);
        // console.log(testRoute.path);
        // if (testRoute.incomplete) {
        //   creep.moveTo(24, 24);
        // } else {
        creep.moveTo(37, 31);
        // }
        //   if (testPosPath.length > 3) {
        //       creep.move(testPosPath[0].direction);
        //     } else {
        //       creep.moveTo(24, 24);
        //     }
        break;
    }
  },
};

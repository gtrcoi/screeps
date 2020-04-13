module.exports = {

    build: function(room) {
        const startX = room.memory.layoutScan.pos.x;
        const startY = room.memory.layoutScan.pos.y;
        const structureLayout = require('./layouts').structureLayout(room, startX, startY);

        // let buildList = [];
        // if (room.controller.level > 0) {
        //     buildList.push(structureLayout['eightSix'])
        // }
        // if (room.controller.level > 1) {
        //     buildList.push(
        //         structureLayout['nineFive'], // 5 extensions
        //         structureLayout['nineSeven'],
        //         structureLayout['elevenFive'],
        //         structureLayout['elevenSix'],
        //         structureLayout['elevenSeven']
        //     )
        // }
        // if (room.controller.level > 2) {
        //     buildList.push(
        //         structureLayout['sevenSix'], // Tower
        //         structureLayout['nineEight'], // 5 Extensions
        //         structureLayout['tenEight'],
        //         structureLayout['nineNine'],
        //         structureLayout['nineTen'],
        //         structureLayout['tenNine']
        //     )
        // }
        // if (room.controller.level > 3) {
        //     buildList.push(
        //         structureLayout['sixSix'], // Storage
        //         structureLayout['sevenThree'], // 10 Extensions
        //         structureLayout['eightTwo'],
        //         structureLayout['eightThree'],
        //         structureLayout['nineTwo'],
        //         structureLayout['nineThree'],
        //         structureLayout['nineFour'],
        //         structureLayout['tenThree'],
        //         structureLayout['tenFour'],
        //         structureLayout['sevenNine'],
        //         structureLayout['eightNine']
        //     )
        // }
        // if (room.controller.level > 4) {
        //     buildList.push(
        //         structureLayout['sixSeven'], // Tower
        //         structureLayout['sixFour'], // Link
        //         structureLayout['eightTen'], // 10 Extensions
        //         structureLayout['sixOne'],
        //         structureLayout['sixTwo'],
        //         structureLayout['sevenOne'],
        //         structureLayout['eightZero'],
        //         structureLayout['nineZero'],
        //         structureLayout['tenOne'],
        //         structureLayout['elevenOne'],
        //         structureLayout['elevenTwo'],
        //         structureLayout['twelveThree']
        //     )
        // }
        // if (room.controller.level > 5) {
        //     buildList.push(
        //         structureLayout['fourFour'], // Terminal
        //         structureLayout['fourOne'], // 3 Labs
        //         structureLayout['threeTwo'],
        //         structureLayout['fourTwo'],
        //         structureLayout['twelveFour'], // 10 Extensions
        //         structureLayout['sixTen'],
        //         structureLayout['sevenEleven'],
        //         structureLayout['eightTwelve'],
        //         structureLayout['nineTwelve'],
        //         structureLayout['tenEleven'],
        //         structureLayout['elevenEleven'],
        //         structureLayout['elevenTen'],
        //         structureLayout['twelveEight'],
        //         structureLayout['twelveNine']
        //     )
        // }
        // if (room.controller.level > 6) {
        //     buildList.push(
        //         structureLayout['fourSix'], // Spawn
        //         structureLayout['fiveSix'], // Tower
        //         structureLayout['fiveThree'], // Factory
        //         structureLayout['twoFour'], // 3 Labs
        //         structureLayout['twoThree'],
        //         structureLayout['oneFour'],
        //         structureLayout['fiveNine'], // 10 Extensions
        //         structureLayout['fourNine'],
        //         structureLayout['fourTen'],
        //         structureLayout['threeTen'],
        //         structureLayout['threeEight'],
        //         structureLayout['threeNine'],
        //         structureLayout['threeTwelve'],
        //         structureLayout['fourTwelve'],
        //         structureLayout['fiveEleven'],
        //         structureLayout['sixEleven']
        //     )
        // }
        // if (room.controller.level > 7) {
        //     buildList.push(
        //         structureLayout['sixEight'], // Spawn
        //         structureLayout['tenSix'], // Power Spawn
        //         structureLayout['oneSix'], // Nuker
        //         structureLayout['zeroSix'], // Observer
        //         structureLayout['fourEight'], // 3 Towers
        //         structureLayout['eightFour'],
        //         structureLayout['eightEight'],
        //         structureLayout['threeOne'], // 4 Labs
        //         structureLayout['twoOne'],
        //         structureLayout['oneTwo'],
        //         structureLayout['oneThree'],
        //         structureLayout['twoSix'], // 10 Extensions
        //         structureLayout['oneSeven'],
        //         structureLayout['threeSeven'],
        //         structureLayout['zeroEight'],
        //         structureLayout['zeroNine'],
        //         structureLayout['twoNine'],
        //         structureLayout['twoEight'],
        //         structureLayout['oneTen'],
        //         structureLayout['oneEleven'],
        //         structureLayout['twoEleven']
        //     )
        // }
        for (let key in structureLayout) {
            const x = structureLayout[key].pos.x;
            const y = structureLayout[key].pos.y;
            const s = structureLayout[key].structureType;
            room.createConstructionSite(x, y, s)
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
            const structureLayout = layouts.structureLayout(room, x, y);
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
                            console.log(`${x} ${y}`);
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
                    room.memory.layoutScan.pos.x = 99;
                    room.memory.layoutScan.pos.y = 99;
                    room.memory.layoutScan.complete = true;
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
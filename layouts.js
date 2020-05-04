module.exports = {
  bunkerLayout: function (x, y) {
    const startPos = { x: x, y: y };
    const structureLayout = {
      // Row 1
      zeroSix: {
        pos: { x: startPos.x + 6, y: startPos.y },
        structureType: STRUCTURE_OBSERVER,
      },
      zeroEight: {
        pos: { x: startPos.x + 8, y: startPos.y },
        structureType: STRUCTURE_EXTENSION,
      },
      zeroNine: {
        pos: { x: startPos.x + 9, y: startPos.y },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 2
      oneTwo: {
        pos: { x: startPos.x + 2, y: startPos.y + 1 },
        structureType: STRUCTURE_LAB,
      },
      oneThree: {
        pos: { x: startPos.x + 3, y: startPos.y + 1 },
        structureType: STRUCTURE_LAB,
      },
      oneFour: {
        pos: { x: startPos.x + 4, y: startPos.y + 1 },
        structureType: STRUCTURE_LAB,
      },
      oneSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 1 },
        structureType: STRUCTURE_NUKER,
      },
      oneSeven: {
        pos: { x: startPos.x + 7, y: startPos.y + 1 },
        structureType: STRUCTURE_EXTENSION,
      },
      oneTen: {
        pos: { x: startPos.x + 10, y: startPos.y + 1 },
        structureType: STRUCTURE_EXTENSION,
      },
      oneEleven: {
        pos: { x: startPos.x + 11, y: startPos.y + 1 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 3
      twoOne: {
        pos: { x: startPos.x + 1, y: startPos.y + 2 },
        structureType: STRUCTURE_LAB,
      },
      twoThree: {
        pos: { x: startPos.x + 3, y: startPos.y + 2 },
        structureType: STRUCTURE_LAB,
      },
      twoFour: {
        pos: { x: startPos.x + 4, y: startPos.y + 2 },
        structureType: STRUCTURE_LAB,
      },
      twoSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 2 },
        structureType: STRUCTURE_EXTENSION,
      },
      twoEight: {
        pos: { x: startPos.x + 8, y: startPos.y + 2 },
        structureType: STRUCTURE_EXTENSION,
      },
      twoNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 2 },
        structureType: STRUCTURE_EXTENSION,
      },
      twoEleven: {
        pos: { x: startPos.x + 11, y: startPos.y + 2 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 4
      threeOne: {
        pos: { x: startPos.x + 1, y: startPos.y + 3 },
        structureType: STRUCTURE_LAB,
      },
      threeTwo: {
        pos: { x: startPos.x + 2, y: startPos.y + 3 },
        structureType: STRUCTURE_LAB,
      },
      threeFive: {
        pos: { x: startPos.x + 5, y: startPos.y + 3 },
        structureType: STRUCTURE_TERMINAL,
      },
      threeSeven: {
        pos: { x: startPos.x + 7, y: startPos.y + 3 },
        structureType: STRUCTURE_EXTENSION,
      },
      threeEight: {
        pos: { x: startPos.x + 8, y: startPos.y + 3 },
        structureType: STRUCTURE_EXTENSION,
      },
      threeNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 3 },
        structureType: STRUCTURE_EXTENSION,
      },
      threeTen: {
        pos: { x: startPos.x + 10, y: startPos.y + 3 },
        structureType: STRUCTURE_EXTENSION,
      },
      threeTwelve: {
        pos: { x: startPos.x + 12, y: startPos.y + 3 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 5
      fourOne: {
        pos: { x: startPos.x + 1, y: startPos.y + 4 },
        structureType: STRUCTURE_LAB,
      },
      fourTwo: {
        pos: { x: startPos.x + 2, y: startPos.y + 4 },
        structureType: STRUCTURE_LAB,
      },
      fourFour: {
        pos: { x: startPos.x + 4, y: startPos.y + 4 },
        structureType: STRUCTURE_TOWER,
      },
      fourSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 4 },
        structureType: STRUCTURE_SPAWN,
      },
      fourEight: {
        pos: { x: startPos.x + 8, y: startPos.y + 4 },
        structureType: STRUCTURE_TOWER,
      },
      fourNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 4 },
        structureType: STRUCTURE_EXTENSION,
      },
      fourTen: {
        pos: { x: startPos.x + 10, y: startPos.y + 4 },
        structureType: STRUCTURE_EXTENSION,
      },
      fourTwelve: {
        pos: { x: startPos.x + 12, y: startPos.y + 4 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 6
      fiveThree: {
        pos: { x: startPos.x + 3, y: startPos.y + 5 },
        structureType: STRUCTURE_FACTORY,
      },
      fiveSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 5 },
        structureType: STRUCTURE_TOWER,
      },
      fiveNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 5 },
        structureType: STRUCTURE_EXTENSION,
      },
      fiveEleven: {
        pos: { x: startPos.x + 11, y: startPos.y + 5 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 7
      sixOne: {
        pos: { x: startPos.x + 1, y: startPos.y + 6 },
        structureType: STRUCTURE_EXTENSION,
      },
      sixTwo: {
        pos: { x: startPos.x + 2, y: startPos.y + 6 },
        structureType: STRUCTURE_EXTENSION,
      },
      sixFour: {
        pos: { x: startPos.x + 4, y: startPos.y + 6 },
        structureType: STRUCTURE_LINK,
      },
      sixSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 6 },
        structureType: STRUCTURE_STORAGE,
      },
      sixEight: {
        pos: { x: startPos.x + 8, y: startPos.y + 6 },
        structureType: STRUCTURE_SPAWN,
      },
      sixTen: {
        pos: { x: startPos.x + 10, y: startPos.y + 6 },
        structureType: STRUCTURE_EXTENSION,
      },
      sixEleven: {
        pos: { x: startPos.x + 11, y: startPos.y + 6 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 8
      sevenOne: {
        pos: { x: startPos.x + 1, y: startPos.y + 7 },
        structureType: STRUCTURE_EXTENSION,
      },
      sevenThree: {
        pos: { x: startPos.x + 3, y: startPos.y + 7 },
        structureType: STRUCTURE_EXTENSION,
      },
      sevenSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 7 },
        structureType: STRUCTURE_TOWER,
      },
      sevenNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 7 },
        structureType: STRUCTURE_EXTENSION,
      },
      sevenEleven: {
        pos: { x: startPos.x + 11, y: startPos.y + 7 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 9
      eightZero: {
        pos: { x: startPos.x, y: startPos.y + 8 },
        structureType: STRUCTURE_EXTENSION,
      },
      eightTwo: {
        pos: { x: startPos.x + 2, y: startPos.y + 8 },
        structureType: STRUCTURE_EXTENSION,
      },
      eightThree: {
        pos: { x: startPos.x + 3, y: startPos.y + 8 },
        structureType: STRUCTURE_EXTENSION,
      },
      eightFour: {
        pos: { x: startPos.x + 4, y: startPos.y + 8 },
        structureType: STRUCTURE_TOWER,
      },
      eightSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 8 },
        structureType: STRUCTURE_SPAWN,
      },
      eightEight: {
        pos: { x: startPos.x + 8, y: startPos.y + 8 },
        structureType: STRUCTURE_TOWER,
      },
      eightNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 8 },
        structureType: STRUCTURE_EXTENSION,
      },
      eightTen: {
        pos: { x: startPos.x + 10, y: startPos.y + 8 },
        structureType: STRUCTURE_EXTENSION,
      },
      eightTwelve: {
        pos: { x: startPos.x + 12, y: startPos.y + 8 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 10
      nineZero: {
        pos: { x: startPos.x, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineTwo: {
        pos: { x: startPos.x + 2, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineThree: {
        pos: { x: startPos.x + 3, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineFour: {
        pos: { x: startPos.x + 4, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineFive: {
        pos: { x: startPos.x + 5, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineSeven: {
        pos: { x: startPos.x + 7, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineEight: {
        pos: { x: startPos.x + 8, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineTen: {
        pos: { x: startPos.x + 10, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      nineTwelve: {
        pos: { x: startPos.x + 12, y: startPos.y + 9 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 11
      tenOne: {
        pos: { x: startPos.x + 1, y: startPos.y + 10 },
        structureType: STRUCTURE_EXTENSION,
      },
      tenThree: {
        pos: { x: startPos.x + 3, y: startPos.y + 10 },
        structureType: STRUCTURE_EXTENSION,
      },
      tenFour: {
        pos: { x: startPos.x + 4, y: startPos.y + 10 },
        structureType: STRUCTURE_EXTENSION,
      },
      tenSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 10 },
        structureType: STRUCTURE_POWER_SPAWN,
      },
      tenEight: {
        pos: { x: startPos.x + 8, y: startPos.y + 10 },
        structureType: STRUCTURE_EXTENSION,
      },
      tenNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 10 },
        structureType: STRUCTURE_EXTENSION,
      },
      tenEleven: {
        pos: { x: startPos.x + 11, y: startPos.y + 10 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 12
      elevenOne: {
        pos: { x: startPos.x + 1, y: startPos.y + 11 },
        structureType: STRUCTURE_EXTENSION,
      },
      elevenTwo: {
        pos: { x: startPos.x + 2, y: startPos.y + 11 },
        structureType: STRUCTURE_EXTENSION,
      },
      elevenFive: {
        pos: { x: startPos.x + 5, y: startPos.y + 11 },
        structureType: STRUCTURE_EXTENSION,
      },
      elevenSix: {
        pos: { x: startPos.x + 6, y: startPos.y + 11 },
        structureType: STRUCTURE_EXTENSION,
      },
      elevenSeven: {
        pos: { x: startPos.x + 7, y: startPos.y + 11 },
        structureType: STRUCTURE_EXTENSION,
      },
      elevenTen: {
        pos: { x: startPos.x + 10, y: startPos.y + 11 },
        structureType: STRUCTURE_EXTENSION,
      },
      elevenEleven: {
        pos: { x: startPos.x + 11, y: startPos.y + 11 },
        structureType: STRUCTURE_EXTENSION,
      },
      // Row 13
      twelveThree: {
        pos: { x: startPos.x + 3, y: startPos.y + 12 },
        structureType: STRUCTURE_EXTENSION,
      },
      twelveFour: {
        pos: { x: startPos.x + 4, y: startPos.y + 12 },
        structureType: STRUCTURE_EXTENSION,
      },
      twelveEight: {
        pos: { x: startPos.x + 8, y: startPos.y + 12 },
        structureType: STRUCTURE_EXTENSION,
      },
      twelveNine: {
        pos: { x: startPos.x + 9, y: startPos.y + 12 },
        structureType: STRUCTURE_EXTENSION,
      },
    };
    return structureLayout;
  },

  bunkerRoadLayout: function (x, y) {
    const startPos = { x: x, y: y };
    const bunkerRoadLayout = [
      // Row 1
      { x: startPos.x + 2, y: startPos.y },
      { x: startPos.x + 3, y: startPos.y },
      { x: startPos.x + 4, y: startPos.y },
      { x: startPos.x + 10, y: startPos.y },
      { x: startPos.x + 11, y: startPos.y },
      // Row 2
      { x: startPos.x + 1, y: startPos.y + 1 },
      { x: startPos.x + 5, y: startPos.y + 1 },
      { x: startPos.x + 8, y: startPos.y + 1 },
      { x: startPos.x + 9, y: startPos.y + 1 },
      { x: startPos.x + 12, y: startPos.y + 1 },
      // Row 3
      { x: startPos.x, y: startPos.y + 2 },
      { x: startPos.x + 2, y: startPos.y + 2 },
      { x: startPos.x + 5, y: startPos.y + 2 },
      { x: startPos.x + 7, y: startPos.y + 2 },
      { x: startPos.x + 10, y: startPos.y + 2 },
      { x: startPos.x + 12, y: startPos.y + 2 },
      // Row 4
      { x: startPos.x, y: startPos.y + 3 },
      { x: startPos.x + 3, y: startPos.y + 3 },
      { x: startPos.x + 4, y: startPos.y + 3 },
      { x: startPos.x + 6, y: startPos.y + 3 },
      { x: startPos.x + 11, y: startPos.y + 3 },
      // Row 5
      { x: startPos.x, y: startPos.y + 4 },
      { x: startPos.x + 3, y: startPos.y + 4 },
      { x: startPos.x + 5, y: startPos.y + 4 },
      { x: startPos.x + 7, y: startPos.y + 4 },
      { x: startPos.x + 11, y: startPos.y + 4 },
      // Row 6
      { x: startPos.x + 1, y: startPos.y + 5 },
      { x: startPos.x + 2, y: startPos.y + 5 },
      { x: startPos.x + 4, y: startPos.y + 5 },
      { x: startPos.x + 5, y: startPos.y + 5 },
      { x: startPos.x + 7, y: startPos.y + 5 },
      { x: startPos.x + 8, y: startPos.y + 5 },
      { x: startPos.x + 10, y: startPos.y + 5 },
      { x: startPos.x + 12, y: startPos.y + 5 },
      // Row 7
      { x: startPos.x, y: startPos.y + 6 },
      { x: startPos.x + 3, y: startPos.y + 6 },
      { x: startPos.x + 5, y: startPos.y + 6 },
      { x: startPos.x + 7, y: startPos.y + 6 },
      { x: startPos.x + 9, y: startPos.y + 6 },
      { x: startPos.x + 12, y: startPos.y + 6 },
      // Row 8
      { x: startPos.x, y: startPos.y + 7 },
      { x: startPos.x + 2, y: startPos.y + 7 },
      { x: startPos.x + 4, y: startPos.y + 7 },
      { x: startPos.x + 5, y: startPos.y + 7 },
      { x: startPos.x + 7, y: startPos.y + 7 },
      { x: startPos.x + 8, y: startPos.y + 7 },
      { x: startPos.x + 10, y: startPos.y + 7 },
      { x: startPos.x + 12, y: startPos.y + 7 },
      // Row 9
      { x: startPos.x + 1, y: startPos.y + 8 },
      { x: startPos.x + 5, y: startPos.y + 8 },
      { x: startPos.x + 7, y: startPos.y + 8 },
      { x: startPos.x + 11, y: startPos.y + 8 },
      // Row 10
      { x: startPos.x + 1, y: startPos.y + 9 },
      { x: startPos.x + 6, y: startPos.y + 9 },
      { x: startPos.x + 11, y: startPos.y + 9 },
      // Row 11
      { x: startPos.x, y: startPos.y + 10 },
      { x: startPos.x + 2, y: startPos.y + 10 },
      { x: startPos.x + 5, y: startPos.y + 10 },
      { x: startPos.x + 7, y: startPos.y + 10 },
      { x: startPos.x + 10, y: startPos.y + 10 },
      { x: startPos.x + 12, y: startPos.y + 10 },
      // Row 12
      { x: startPos.x, y: startPos.y + 11 },
      { x: startPos.x + 3, y: startPos.y + 11 },
      { x: startPos.x + 4, y: startPos.y + 11 },
      { x: startPos.x + 8, y: startPos.y + 11 },
      { x: startPos.x + 9, y: startPos.y + 11 },
      { x: startPos.x + 12, y: startPos.y + 11 },
      // Row 13
      { x: startPos.x + 1, y: startPos.y + 12 },
      { x: startPos.x + 2, y: startPos.y + 12 },
      { x: startPos.x + 5, y: startPos.y + 12 },
      { x: startPos.x + 6, y: startPos.y + 12 },
      { x: startPos.x + 7, y: startPos.y + 12 },
      { x: startPos.x + 10, y: startPos.y + 12 },
      { x: startPos.x + 11, y: startPos.y + 12 },
    ];
    return bunkerRoadLayout;
  },
};

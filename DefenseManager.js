require('./TowerPrototypes');

module.exports = {

    safeMode: function(room) {
        const chargedTowers = _.filter(Game.structures, (t) => t.structureType == STRUCTURE_TOWER && t.store[RESOURCE_ENERGY] > 0);
        if (room.find(FIND_HOSTILE_CREEPS).length > 0 && chargedTowers.length == 0) {
            room.controller.activateSafeMode();
        }
    },

    towerDefense: function() {
        const towers = _.filter(Game.structures, (t) => t.structureType == STRUCTURE_TOWER);
        for (tower of towers) {
            tower.defend();
        }
    }
}
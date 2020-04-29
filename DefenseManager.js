require('./TowerPrototypes');

module.exports = {

    safeMode: function(room) {
        const chargedTowers = _.filter(Game.structures, (t) => t.structureType == STRUCTURE_TOWER && t.store[RESOURCE_ENERGY] > 0);
        if (room.find(FIND_HOSTILE_CREEPS).length > 0 && chargedTowers.length == 0) {
            room.controller.activateSafeMode();
        }
    },

    runTowers: function() {
        const towers = _.filter(Game.structures, (t) => t.structureType == STRUCTURE_TOWER);
        for (tower of towers) {
            let operations = [];
            if (tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) * 0.525) {
                operations = [
                    function() { return tower.defend() },
                    function() { return tower.healCreep() },
                    function() { return tower.repairRoad({ percent: 75 }) },
                    function() { return tower.repairContainer({ percent: 90 }) },
                    function() { return tower.repairMyMostDamaged({ percent: 50 }) },
                    function() { return tower.repairWall() }
                ];
            } else {
                operations = [
                    function() { return tower.defend() },
                    function() { return tower.healCreep() }
                ];
            }
            for (key = 0; key < operations.length; key++) {
                if (operations[key]() == OK) {
                    break;
                }
            }
        }
    }
}
require('./TowerPrototypes');

module.exports = {

    towerDefense: function() {
        const towers = _.filter(Game.structures, (t) => t.structureType == STRUCTURE_TOWER);
        for (tower of towers) {
            tower.defend();
        }
    }
}
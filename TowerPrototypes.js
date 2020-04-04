// Tower Defend
StructureTower.prototype.defend = function() {
    const target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    switch (target) {
        case null:
            return ERR_NOT_FOUND

        default:
            this.attack(target);
            return OK;
    }
};

// Tower Heal
StructureTower.prototype.healCreep = function() {
    const target = this.room.find(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
    switch (target.length) {
        case 0:
            return ERR_NOT_FOUND

        default:
            this.heal(target);
            return OK;
    }
}

// Tower Repair Roads
StructureTower.prototype.repairRoad = function() {
    const damagedRoads = this.pos.findClosestByRange(
        FIND_STRUCTURES, {
            filter: s =>
                s.hits < s.hitsMax / 1.3 && s.structureType === STRUCTURE_ROAD
        });
    switch (damagedRoads) {
        case null:
            return ERR_NOT_FOUND;

        default:
            this.repair(damagedRoads);
            return OK;
    }
}

// Repair Most Damaged
StructureTower.prototype.repairMostDamaged = function() {
    const damagedBuildings = this.room.find(FIND_MY_STRUCTURES, { filter: s => s.hits < s.hitsMax });
    if (damagedBuildings.length > 0) {
        var mostDamagedBuilding = null;

        for (let percentage = 0.0005; percentage <= 1; percentage = percentage + 0.0005) {
            // find building with less than percentage hits
            for (let building of damagedBuildings) {
                if (building.hits / building.hitsMax < percentage) {
                    mostDamagedBuilding = building;

                    break;
                }
            }
            if (mostDamagedBuilding != null) { break; }
        }
        // if there is a match
        switch (mostDamagedBuilding) {
            case null:
                return ERR_NOT_FOUND;

            default:
                this.repair(mostDamagedBuilding)
                return OK;
        }

    } else {
        return ERR_NOT_FOUND;
    }
}

// Tower Repair containers
StructureTower.prototype.repairContainer = function() {
    const damagedContainer = this.pos.findClosestByRange(
        FIND_STRUCTURES, {
            filter: s =>
                s.structureType === STRUCTURE_CONTAINER &&
                s.hits < s.hitsMax
        });
    switch (damagedContainer) {
        case null:
            return ERR_NOT_FOUND;

        default:
            this.repair(damagedContainer);
            return OK;
    }
}
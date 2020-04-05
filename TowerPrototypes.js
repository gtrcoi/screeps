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
    const targets = this.room.find(FIND_MY_CREEPS, { filter: c => c.hits < c.hitsMax });
    if (targets.length > 0) {
        var target = null;

        for (let percentage = 0.0005; percentage <= 1; percentage = percentage + 0.0005) {
            // find building with less than percentage hits
            for (let creep of targets) {
                if (creep.hits / creep.hitsMax < percentage) {
                    target = creep;

                    break;
                }
            }
            if (target != null) { break; }
        }
        switch (target) {
            case null:
                return ERR_NOT_FOUND

            default:
                this.heal(target);
                return OK;
        }
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

// Repair My Most Damaged
StructureTower.prototype.repairMyMostDamaged = function(percent) {
    let targetPercent = undefined;
    if (percent === undefined) { targetPercent = 1; } else { targetPercent = percent / 100; }
    const damagedBuildings = this.room.find(FIND_MY_STRUCTURES, { filter: s => s.hits < s.hitsMax });
    if (damagedBuildings.length > 0) {
        var mostDamagedBuilding = null;

        for (let percentage = 0.0005; percentage <= targetPercent; percentage = percentage + 0.0005) {
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

// Repair Most Damaged
StructureTower.prototype.repairMostDamaged = function(percent) {
    let targetPercent = undefined;
    if (percent === undefined) { targetPercent = 1; } else { targetPercent = percent / 100; }
    const damagedBuildings = this.room.find(FIND_STRUCTURES, { filter: s => s.hits < s.hitsMax });
    if (damagedBuildings.length > 0) {
        var mostDamagedBuilding = null;

        for (let percentage = 0.0005; percentage <= targetPercent; percentage = percentage + 0.0005) {
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
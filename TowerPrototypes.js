// Tower Defend
StructureTower.prototype.defend = function() {
    // Find targets
    const targets = this.room.find(FIND_HOSTILE_CREEPS);

    // Sort targets by most heal parts
    let targetArray = []
    let target = null

    for (let creep of targets) {
        let healParts = 0
        for (let part of creep.body) {
            if (part.type === HEAL) {
                healParts++
            }
        }
        targetArray.push({ creep: creep, healParts: healParts })
    }

    targetArray.sort((a, b) => (a.healParts > b.healParts) ? -1 : 1)
    if (targetArray.length > 0) {
        target = targetArray[0].creep
    }

    switch (target) {
        case null:
            return ERR_NOT_FOUND

        default:
            this.attack(target);
            return OK;
    }
};

// Tower Heal
StructureTower.prototype.healCreep = function(opts) {
    opts = opts || {}
    if (_.isUndefined(opts.percent)) {
        opts.percent = 100
    }
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
StructureTower.prototype.repairRoad = function(opts) {
    opts = opts || {};
    if (_.isUndefined(opts.percent)) {
        opts.percent = 100
    }

    const targetID = this.room.memory.structures.repairs.mostDamagedRoad.id;
    const target = Game.getObjectById(targetID);
    const targetPercent = target.hits / target.hitsMax

    if (!_.isNull(target) && targetPercent < opts.percent / 100) {
        this.repair(target);
        return OK;
    } else {
        return ERR_NOT_FOUND
    }
}

// Repair My Most Damaged
StructureTower.prototype.repairMyMostDamaged = function(opts) {
    opts = opts || {};
    if (_.isUndefined(opts.percent)) {
        opts.percent = 100
    }
    const targetID = this.room.memory.structures.repairs.mostDamagedStructure.id;
    const target = Game.getObjectById(targetID);
    const targetPercent = (!_.isNull(target)) ? target.hits / target.hitsMax : 1

    if (!_.isNull(target) && targetPercent < opts.percent / 100) {
        this.repair(target);
        return OK;
    } else {
        return ERR_NOT_FOUND
    }
}

// Repair Most Damaged
StructureTower.prototype.repairWall = function(opts) {
    opts = opts || {};
    if (_.isUndefined(opts.percent)) {
        opts.percent = 100
    }
    const targetID = this.room.memory.structures.repairs.mostDamagedWall.id;
    const target = Game.getObjectById(targetID);
    const targetPercent = target.hits / target.hitsMax

    if (!_.isNull(target) && targetPercent < opts.percent / 100) {
        this.repair(target);
        return OK;
    } else {
        return ERR_NOT_FOUND
    }
}

// Tower Repair containers
StructureTower.prototype.repairContainer = function(opts) {
    opts = opts || {};
    if (_.isUndefined(opts.percent)) {
        opts.percent = 100
    }
    const targetID = this.room.memory.structures.repairs.mostDamagedContainer.id;
    const target = Game.getObjectById(targetID);
    const targetPercent = target.hits / target.hitsMax

    if (!_.isNull(target) && targetPercent < opts.percent / 100) {
        this.repair(target);
        return OK;
    } else {
        return ERR_NOT_FOUND
    }
}

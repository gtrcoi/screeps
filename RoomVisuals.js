module.exports = {
    paintLayoutScan: function(room) {
        const x = room.memory.layoutScan.pos.x;
        const y = room.memory.layoutScan.pos.y;

        for (let i = 0; i <= 13; i++) {
            room.visual.line(x + i - 0.5, y - 0.5, x + i - 0.5, y + 13 - 0.5, {
                opacity: 0.1
            });
            room.visual.line(x - 0.5, y + i - 0.5, x + 13 - 0.5, y + i - 0.5, {
                opacity: 0.1
            });
            if (i < 13) {
                room.visual.text(`${i}`, x + i, y - 0.8, {
                    font: 0.5,
                    opacity: 0.3
                })
                room.visual.text(`${i}`, x - 1, y + i + 0.2, {
                    font: 0.5,
                    opacity: 0.3
                })
            }
        }
    },

    paintMisc: function(room) {
        if (room.memory.structures.repairs) {
            let yPos = 1;
            let xPos = 6;
            let i = 0
            Object.values(room.memory.structures.repairs).forEach(element => {
                if (!_.isUndefined(element.id)) {
                    const structure = Game.getObjectById(element.id)
                    room.visual.text(`${structure.structureType}: `, xPos, yPos, { align: 'right', opacity: 0.5 })
                    room.visual.text(` ${structure.hits} hp    ${(structure.hits / structure.hitsMax *100).toFixed(2)}%`, xPos + 9, yPos, { font: 0.5, align: 'right', opacity: 0.5 })
                    room.visual.line(xPos + 13 - i, yPos + 0.1, structure.pos.x, structure.pos.y, { width: 0.05 })
                    room.visual.line(xPos - 0.29, yPos + 0.1, xPos + 13 - i, yPos + 0.1, { width: 0.05 })
                    yPos++
                    i++
                    room.visual.circle(structure.pos, { fill: 'transparent', radius: 0.5, stroke: 'red' })
                }
            });
        }
    }
}
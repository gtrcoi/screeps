module.exports = {
    paintLayoutScan: function(room) {
        const x = room.memory.layoutScan.pos.x;
        const y = room.memory.layoutScan.pos.y;

        room.visual.circle(x, y)
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
    }
}
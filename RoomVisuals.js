module.exports = {
    paintLayoutScan: function(room) {
        const layoutScanPos = room.memory.layoutScan.pos;

        for (let point = 0; point <= 13; point++) {
            room.visual.line(layoutScanPos.x + point - 0.5, layoutScanPos.y - 0.5, layoutScanPos.x + point - 0.5, layoutScanPos.y + 13 - 0.5, {
                opacity: 0.1
            });
            room.visual.line(layoutScanPos.x - 0.5, layoutScanPos.y + point - 0.5, layoutScanPos.x + 13 - 0.5, layoutScanPos.y + point - 0.5, {
                opacity: 0.1
            });
            if (point < 13) {
                room.visual.text(`${point}`, layoutScanPos.x + point, layoutScanPos.y - 0.8, {
                    font: 0.5,
                    opacity: 0.3
                })
                room.visual.text(`${point}`, layoutScanPos.x - 1, layoutScanPos.y + point + 0.2, {
                    font: 0.5,
                    opacity: 0.3
                })
            }
        }
    }
}
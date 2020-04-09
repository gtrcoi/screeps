module.exports = {
    paintLayoutScan: function(room) {
        const layoutScanPos = room.memory.layoutScan.pos;

        for (let point = 0; point <= 12; point++) {
            room.visual.line(layoutScanPos.x + point, layoutScanPos.y, layoutScanPos.x + point, layoutScanPos.y + 12, {
                opacity: 0.1
            });
            room.visual.line(layoutScanPos.x, layoutScanPos.y + point, layoutScanPos.x + 12, layoutScanPos.y + point, {
                opacity: 0.1
            });
            room.visual.text(`${point}`, layoutScanPos.x + point, layoutScanPos.y - 1, {
                font: 0.5,
                opacity: 0.3
            })
            room.visual.text(`${point}`, layoutScanPos.x - 1, layoutScanPos.y + point, {
                font: 0.5,
                opacity: 0.3
            })
        }
    }
}
module.exports = {
    paintLayoutScan: function(room) {
        const layoutScanPos = room.memory.layoutScan.pos;
        const verticalPoints = [
            { x: 0, y: 12 },
            { x: 1, y: 12 },
            { x: 2, y: 12 },
            { x: 3, y: 12 },
            { x: 4, y: 12 },
            { x: 5, y: 12 },
            { x: 6, y: 12 },
            { x: 7, y: 12 },
            { x: 8, y: 12 },
            { x: 9, y: 12 },
            { x: 10, y: 12 },
            { x: 11, y: 12 },
            { x: 12, y: 12 }
        ]
        const horizontalPoints = [
            { x: 12, y: 0 },
            { x: 12, y: 1 },
            { x: 12, y: 2 },
            { x: 12, y: 3 },
            { x: 12, y: 4 },
            { x: 12, y: 5 },
            { x: 12, y: 6 },
            { x: 12, y: 7 },
            { x: 12, y: 8 },
            { x: 12, y: 9 },
            { x: 12, y: 10 },
            { x: 12, y: 11 },
            { x: 12, y: 12 },
        ]
        for (const key in verticalPoints) {
            const point = verticalPoints[key];
            room.visual.line(layoutScanPos.x + point.x, layoutScanPos.y, layoutScanPos.x + point.x, layoutScanPos.y + point.y);
            room.visual.text(`${point.x}`, layoutScanPos.x + point.x, layoutScanPos.y - 1, {
                font: 0.5,
                opacity: 0.7
            })
        }
        for (const key in horizontalPoints) {
            const point = horizontalPoints[key];
            room.visual.line(layoutScanPos.x, layoutScanPos.y + point.y, layoutScanPos.x + point.x, layoutScanPos.y + point.y);
            room.visual.text(`${point.y}`, layoutScanPos.x - 1, layoutScanPos.y + point.y, {
                font: 0.5,
                opacity: 0.7
            })
        }

    }
}
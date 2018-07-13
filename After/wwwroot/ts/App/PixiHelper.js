export const PixiHelper = new class {
    GetDistanceBetween(point1, point2) {
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) +
            Math.pow(point1.y - point2.y, 2));
    }
    GetAngle(centerPoint, targetPoint) {
        var dx = centerPoint.x - targetPoint.x;
        var dy = centerPoint.y - targetPoint.y;
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
};
//# sourceMappingURL=PixiHelper.js.map
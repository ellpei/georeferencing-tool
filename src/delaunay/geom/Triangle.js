var Point = require('./Point');
var matrixTrans = require('transformation-matrix');

function Triangle (point1, point2, point3) {
    this.p1 = point1 || new Point({});
    this.p2 = point2 || new Point({});
    this.p3 = point3 || new Point({});

    this.mid0 = new Point({
        x:this.p1.x + (this.p2.x - this.p1.x)/2,
        y:this.p1.y + (this.p2.y - this.p1.y)/2});

    this.mid1 = new Point({
        x:this.p2.x + (this.p3.x - this.p2.x)/2,
        y:this.p2.y + (this.p3.y - this.p2.y)/2});

    this.mid2 = new Point({
        x:this.p3.x + (this.p1.x - this.p3.x)/2,
        y:this.p3.y + (this.p1.y - this.p3.y)/2});

    this.matrixGeoToMap = matrixTrans.fromTriangles(this.getGeoCoords(), this.getPisteMapCoords());
    this.matrixMapToGeo = matrixTrans.fromTriangles(this.getPisteMapCoords(), this.getGeoCoords());
}

Triangle.prototype.constructor = Triangle;
module.exports = Triangle;

Triangle.prototype.getCenter = function() {
    return new Point({x:(this.p1.x + this.p2.x + this.p3.x )/3,
                       y:(this.p1.y + this.p2.y + this.p3.y )/3});
}

function area(x1, y1, x2, y2, x3, y3) {
    return Math.abs((x1*(y2-y3) + x2*(y3-y1)+ x3*(y1-y2))/2.0);
}

Triangle.prototype.getPisteMapCoords = function() {
    return [
        {x: this.p1.x, y: this.p1.y},
        {x: this.p2.x, y: this.p2.y},
        {x: this.p3.x, y: this.p3.y}
    ];
}

Triangle.prototype.getGeoCoords = function() {
    return [
        {x: this.p1.lat, y: this.p1.lng},
        {x: this.p2.lat, y: this.p2.lng},
        {x: this.p3.lat, y: this.p3.lng}
    ];
}

Triangle.prototype.transformGeoCoords = function(point) {
    return matrixTrans.applyToPoint(this.matrixGeoToMap, {x: point.lat, y: point.lng});
}

Triangle.prototype.transformMapCoords = function(point) {
    return matrixTrans.applyToPoint(this.matrixMapToGeo, {x: point.x, y: point.y});
}

Triangle.prototype.enclosesGeoCoords = function(point) {
    let x = point.lat;
    let y = point.lng;
    let x1 = this.p1.lat;
    let y1 = this.p1.lng;
    let x2 = this.p2.lat;
    let y2 = this.p2.lng;
    let x3 = this.p3.lat;
    let y3 = this.p3.lng;

    /* Calculate area of triangle ABC */
    let A = area (x1, y1, x2, y2, x3, y3);
    /* Calculate area of triangle PBC */
    let A1 = area (x, y, x2, y2, x3, y3);
    /* Calculate area of triangle PAC */
    let A2 = area (x1, y1, x, y, x3, y3);
    /* Calculate area of triangle PAB */
    let A3 = area (x1, y1, x2, y2, x, y);
    /* Check if sum of A1, A2 and A3 is same as A */
    return (A === A1 + A2 + A3);
}

Triangle.prototype.enclosesMapCoords = function(point) {
    let x = point.x;
    let y = point.y;
    let x1 = this.p1.x;
    let y1 = this.p1.y;
    let x2 = this.p2.x;
    let y2 = this.p2.y;
    let x3 = this.p3.x;
    let y3 = this.p3.y;

    /* Calculate area of triangle ABC */
    let A = area (x1, y1, x2, y2, x3, y3);
    /* Calculate area of triangle PBC */
    let A1 = area (x, y, x2, y2, x3, y3);
    /* Calculate area of triangle PAC */
    let A2 = area (x1, y1, x, y, x3, y3);
    /* Calculate area of triangle PAB */
    let A3 = area (x1, y1, x2, y2, x, y);
    /* Check if sum of A1, A2 and A3 is same as A */
    return (A === A1 + A2 + A3);
};

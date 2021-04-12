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

    this.toJSON = function() {
        return [this.p1, this.p2, this.p3];
    }
}

Triangle.prototype.constructor = Triangle;
module.exports = Triangle;

Triangle.prototype.getCenter = function() {
    return new Point({x:(this.p1.x + this.p2.x + this.p3.x )/3,
                       y:(this.p1.y + this.p2.y + this.p3.y )/3});
}

Triangle.prototype.getGeoCenter = function() {
    return [(this.p1.lat + this.p2.lat + this.p3.lat )/3, (this.p1.lng + this.p2.lng + this.p3.lng )/3];
}

Triangle.prototype.geoDistanceToPoint = function(point) {
    let center = this.getGeoCenter();
    let p = [point.lat, point.lng];
    return Math.sqrt(((p[0] - center[0])*(p[0] - center[0])) + ((p[1] - center[1])*(p[1] - center[1])));
}

Triangle.prototype.mapDistanceToPoint = function(point) {
    let center = this.getCenter();
    return Math.sqrt(((point.x - center.x)*(point.x - center.x)) + ((point.y - center.y)*(point.x - center.y)));
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
    var cross = (a, b) => a[1] * b[0] - a[0] * b[1];
    var sub = (a, b) => [a[0] - b[0], a[1] - b[1]];

    let p = [point.lat, point.lng];
    let g1 = [this.p1.lat, this.p1.lng];
    let g2 = [this.p2.lat, this.p2.lng];
    let g3 = [this.p3.lat, this.p3.lng];

    // (p - g1) x (g2 - g1)
    let pg1g2 = cross(sub(p, g1), sub(g2, p));
    // (p - g2) x (g3 - g2)
    let pg2g3 = cross(sub(p, g2), sub(g3, g2));

    if(Math.sign(pg1g2) !== Math.sign(pg2g3)) return false;
    // (p - g3) x (g1 - g3)
    let pg3g1 = cross(sub(p, g3), sub(g1, g3));

    return Math.sign(pg1g2) === Math.sign(pg3g1);
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

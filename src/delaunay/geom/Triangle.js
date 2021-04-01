var Point = require('./Point');

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
}

Triangle.prototype.constructor = Triangle;
module.exports = Triangle;

Triangle.prototype.getCenter = function() {
    return new Point({x:(this.p1.x + this.p2.x + this.p3.x )/3,
                       y:(this.p1.y + this.p2.y + this.p3.y )/3});
}


/*function Point(x, y, lat, lng) {
    this.x = x || 0;
    this.y = y || 0;
    this.lat = lat || 0;
    this.lng = lng || 0;
}*/
function Point({x, y, lat, lng, note, parentType, parent}) {
    this.x = x || 0;
    this.y = y || 0;
    this.lat = lat || 0;
    this.lng = lng || 0;
    this.note = note || "";
    this.parentType = parentType || "";
    this.parent = parent || [];
}

Point.prototype.constructor = Point;
module.exports = Point;

Point.prototype.distance = function(otherpoint) {
	return Math.sqrt(((otherpoint.x - this.x)*(otherpoint.x - this.x)) + ((otherpoint.y - this.y)*(otherpoint.y - this.y)));
};

Point.prototype.equals = function(otherpoint) {
	return (this.x === otherpoint.x && this.y === otherpoint.y);
};

Point.prototype.copy = function(p) {
    this.set(p);
};

Point.prototype.set = function({x, y, lat, lng, note, parentType, parent}) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.lat = lat || this.lat;
    this.lng = lng || this.lng;
    this.note = note || this.note;
    this.parentType = parentType || this.parentType;
    this.parent = parent || this.parent;
};
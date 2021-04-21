function Point({x, y, lat, lng, note, parentType, parent}) {
    this.x = x || 0;
    this.y = y || 0;
    this.lat = lat || 0;
    this.lng = lng || 0;
    this.note = note || "";
    this.parentType = parentType || "";
    this.parent = parent || [];

    this.toJSON = function() {
        return {
            x: this.x,
            y: this.y,
            lat: this.lat,
            lng: this.lng,
            parentType: this.parentType,
            parent: this.parent,
            note: this.note
        };
    }
}

Point.prototype.constructor = Point;
module.exports = Point;

Point.prototype.distance = function(otherpoint) {
	return Math.sqrt((otherpoint.x - this.x)**2 + (otherpoint.y - this.y)**2);
};

Point.prototype.equals = function(otherpoint) {
	return (this.x === otherpoint.x && this.y === otherpoint.y);
};

Point.prototype.sub = function(other) {
    return new Point(this.x - other.x, this.y - other.y);
}

Point.prototype.cross = function(other) {
    return this.y * other.x - this.x * other.y;
}

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

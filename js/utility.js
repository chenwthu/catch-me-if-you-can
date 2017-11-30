/*
 *  Take in gridShape and the grid's x-index and y-index coordinates in the map.
 *  Return pixel coordinates of its center.
 *
 *  rtype: json
 *         {x, y, direction} for triangle grid
 *         {x, y} for square and hexagon
 */
function id2px(gridShape, x, y) {
    var a = gridShape.a;

    switch (gridShape.shape) {
        case '0': // triangle
            return {
                x: x * a / 2,
                y: (y+.5) * (a*Math.sqrt(3)/2),
                direction: ((x+y)&1) * 2 - 1
            };

        case '1': // square
            return {
                x: (x+.5) * a,
                y: (y+.5) * a
            };

        case '2': // hexagon
            return {
                x: (y&1) ? (x*1.5*a) : ((x*1.5+.75)*a),
                y: y * (a*Math.sqrt(3)/4)
            };
    }
}

/*
 *  Take in gridShape and pixel coordinates. Return x-index and y-index
 *  coordinates of the grid that has the pixel inside.
 *
 *  rtype: json {x, y}
 */
function px2id(gridShape, x, y) {
    var a = gridShape.a;

    switch (gridShape.shape) {
        case '0': // triangle
            var h = a * Math.sqrt(3) / 2;
            var u = Math.floor(x/a*2);
            var v = Math.floor(y/h);
            return {
                x: u + Number(((u+v)&1)
                    ? (x*Math.sqrt(3) > y + (u-v)*h)
                    : (x*Math.sqrt(3) > (u+v+1)*h - y)),
                y: v
            };

        case '1': // square
            return {
                x: Math.floor(x/a),
                y: Math.floor(y/a)
            };

        case '2': // hexagon
            var h = a * Math.sqrt(3) / 2;
            var u = Math.floor(x/a/1.5);
            var v = Math.floor(y/h);
            return {
                x: u + Number(x*Math.sqrt(3) - (u*3+2)*h > Math.abs(y-(v+.5)*h)),
                y: (x*Math.sqrt(3) - (u*3+2)*h > Math.abs(y-(v+.5)*h)
                        || (u*3+1)*h - x*Math.sqrt(3) > Math.abs(y-(v+.5)*h))
                    ? (v*2+1) : ((y>(v+.5)*h) ? (v*2+2) : (v*2))
            };
    }
}

/*
 *  Take in canvas and gridShape. Return a map of corresponding size with all 0.
 *
 *  rtype: Array of Array
 */
function getMap(canvas, gridShape) {
    var map = [];

    for (var y = 0; id2px(gridShape,0,y).y < canvas.height()+gridShape.a/2; ++y) {
        map.push([]);
        for (var x = 0; id2px(gridShape,x,0).x < canvas.width()+gridShape.a/2; ++x)
            map[y].push(0);
    }

    return map;
}

/*
 *  Take in a map. Randomly generate positions of src and dst. It is guaranteed
 *  that src and dst are located in empty grids not too close to the boundary,
 *  and Chebyshev distance between them is less than or equal to 20.
 *  Note that map is modified in this function.
 *
 *  rtype: 2-element Array of json {x, y}
 */
function newSrcDst(map) {
    var src, dst;

    do {
        src = {
            x: Math.floor(Math.random()*(map[0].length-5))+2,
            y: Math.floor(Math.random()*(map.length-5))+2
        };
    } while (map[src.y][src.x]);
    map[src.y][src.x] = 1;

    do {
        dst = {
            x: Math.floor(Math.random()*(map[0].length-5))+2,
            y: Math.floor(Math.random()*(map.length-5))+2
        };
    } while (map[dst.y][dst.x] || Math.abs(src.x-dst.x)>20 || Math.abs(src.y-dst.y)>20);
    map[dst.y][dst.x] = 2;
    
    return [src, dst];
}

/*
 *  CLASS first-in-first-out queue
 */
function Queue() {
    var self = this;

    self.data = [];
    self.size = function() { return self.data.length; };
    self.empty = function() { return self.size() == 0; };
    self.push = function(val) { self.data.push(val); };
    self.front = function() { return self.empty() ? undefined : self.data[0]; };
    self.pop = function() { return self.data.shift(); };
}

/*
 *  CLASS priority queue
 *  Element with least priority ranks top. Between two elements with equal
 *  priority, the newer ranks the other.
 */
function PriorityQueue() {
    var self = this;
    
    self.data = [];
    self.size = function() { return self.data.length; };
    self.empty = function() { return self.size() == 0; };
    self.push = function(val) {
        if (self.empty() || val.priority>self.data[self.size()-1].priority)
            self.data.push(val);
        else
            for (var i = 0; i < self.size(); ++i)
                if (val.priority <= self.data[i].priority) {
                    self.data.splice(i, 0, val);
                    break;
                }
    };
    self.top = function() { return self.empty() ? undefined : self.data[0]; };
    self.pop = function() { return self.data.shift(); };
}

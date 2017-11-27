function id2px(gridShape, x, y) {
    var a = gridShape.a;

    switch (gridShape.shape) {
        case '0':
            return {
                x: x * a / 2,
                y: (y+.5) * (a*Math.sqrt(3)/2),
                direction: ((x+y)&1) * 2 - 1
            };

        case '1':
            return {
                x: (x+.5) * a,
                y: (y+.5) * a
            };

        case '2':
            return {
                x: (y&1) ? (x*1.5*a) : ((x*1.5+.75)*a),
                y: y * (a*Math.sqrt(3)/4)
            };
    }
}

function px2id(gridShape, x, y) {
    var a = gridShape.a;

    switch (gridShape.shape) {
        case '0':
            var h = a * Math.sqrt(3) / 2;
            var u = Math.floor(x/a*2);
            var v = Math.floor(y/h);
            return {
                x: u + Number(((u+v)&1)
                    ? (x*Math.sqrt(3) > y + (u-v)*h)
                    : (x*Math.sqrt(3) > (u+v+1)*h - y)),
                y: v
            };

        case '1':
            return {
                x: Math.floor(x/a),
                y: Math.floor(y/a)
            };

        case '2':
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

function getMap(canvas, gridShape) {
    var map = [];

    for (var y = 0; id2px(gridShape,0,y).y < canvas.height()+gridShape.a/2; ++y) {
        map.push([]);
        for (var x = 0; id2px(gridShape,x,0).x < canvas.width()+gridShape.a/2; ++x)
            map[y].push(0);
    }

    return map;
}

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
    } while (map[dst.y][dst.x]);
    map[dst.y][dst.x] = 2;
    
    return [src, dst];
}

function Queue() {
    this.data = [];
    this.size = function() { return this.data.length; };
    this.empty = function() { return this.size() == 0; };
    this.push = function(val) { this.data.push(val); };
    this.front = function() { return this.empty() ? undefined : this.data[0]; };
    this.pop = function() { return this.data.shift(); };
}

function PriorityQueue() {
    var self = this;

    var siftUp = function(id) {
        if (!id || id>=self.size()) return;
        var parentId = Math.floor((id-1) / 2);
        if (self.data[id].priority < self.data[parentId].priority) {
            var temp = self.data[id];
            self.data[id] = self.data[parentId];
            self.data[parentId] = temp;
            siftUp(parentId);
        }
    };

    var siftDown = function(id) {
        var lId = id*2+1, rId = id*2+2, minId = id;
        if (rId >= self.size())
            if (lId >= self.size()) return;
            else minId = lId;
        else
            minId = (self.data[lId].priority<self.data[rId].priority) ? lId : rId;
        if (self.data[id].priority > self.data[minId].priority) {
            var temp = self.data[id];
            self.data[id] = self.data[minId];
            self.data[minId] = temp;
            siftDown(minId);
        }
    };

    this.data = [];
    this.size = function() { return this.data.length; };
    this.empty = function() { return this.size() == 0; };
    this.push = function(val) { this.data.push(val); siftUp(this.size()-1); };
    this.top = function() { return this.empty() ? undefined : this.data[0]; };
    this.pop = function() {
        if (this.empty()) return undefined;
        var top = this.top();
        this.data[0] = this.data[this.size()-1];
        this.data.pop();
        siftDown(0);
        return top;
    };
}

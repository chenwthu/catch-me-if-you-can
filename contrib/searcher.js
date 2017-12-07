/*
 *  CLASS searcher
 *  constructor
 */
function Searcher(algorithm) {
    this.algorithm = algorithm;
}

/*
 *  PROTOTYPE FUNCTION search
 *  Take in gridShape, map and positions of src and dst. Find a path
 *  from src to/toward dst and return the solution.
 *
 *  rtype: Array of json {x, y}
 */
Searcher.prototype.search = function(gridShape, map, src, dst) {
    /*
     *  Take in position of a grid. Check whether the map contains this grid.
     *
     *  rtype: boolean
     */
    var valid = function(pos) {
        return 0<=pos.x && pos.x<map[0].length && 0<=pos.y && pos.y<map.length;
    };

    /*
     *  Take in position of a grid. Return its neighbors.
     *
     *  rtype: Array of json {x, y}
     */
    var getNeighbor = function(pos) {
        switch (gridShape.shape) {
            case '0': // triangle
                return [
                    {x: -1, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: id2px(gridShape, pos.x, pos.y).direction}
                ];

            case '1': // square
                return [
                    {x: -1, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: -1},
                    {x: 0, y: 1}
                ];

            case '2': // hexagon
                return [
                    {x: -(pos.y&1), y: -1},
                    {x: -(pos.y&1), y: 1},
                    {x: 1-(pos.y&1), y: -1},
                    {x: 1-(pos.y&1), y: 1},
                    {x: 0, y: -2},
                    {x: 0, y: 2}
                ];
        }
    };

    /*
     *  dijkstra optimized with binary heap
     */
    var dijkstra = function(src, dst) {
        if (src.x==dst.x && src.y==dst.y) return [src];

        var cost = [];
        for (var i = 0; i < map.length; ++i) {
            cost.push([]);
            for (var j = 0; j < map[0].length; ++j)
                cost[i].push(Infinity);
        }
        cost[src.y][src.x] = 0;

        var prev = [];
        for (var i = 0; i < map.length; ++i)
            prev.push(new Array(map[0].length));

        // binary heap
        var q = new function() {
            var self = this;

            var parent = function(id) { return Math.floor((id-1)/2); };
            var left = function(id) { return id * 2 + 1; };
            var right = function(id) { return id * 2 + 2; };
            var swap = function(id1, id2) {
                var tmp = self.data[id1];
                self.data[id1] = self.data[id2];
                self.data[id2] = tmp;
                self.loc[self.data[id1].y][self.data[id1].x] = id1;
                self.loc[self.data[id2].y][self.data[id2].x] = id2;
            };
            var siftUp = function(id) {
                while (id>0 && self.data[id].val<self.data[parent(id)].val) {
                    swap(id, parent(id));
                    id = parent(id);
                }
            };
            var siftDown = function(id) {
                while (id < self.size()) {
                    var minId = id;
                    if (left(id) < self.size())
                        if (self.data[left(id)].val < self.data[minId].val) minId = left(id);
                    if (right(id) < self.size())
                        if (self.data[right(id)].val < self.data[minId].val) minId = right(id);
                    if (minId == id) return;
                    swap(id, minId);
                    id = minId;
                }
            };

            self.data = [];
            self.loc = [];
            for (var i = 0; i < map.length; ++i)
                self.loc.push(new Array(map[0].length));

            self.size = function() { return self.data.length; };
            self.empty = function() { return self.size() == 0; };
            self.insert = function(x, y, val) {
                self.data.push({x: x, y: y, val: val});
                self.loc[y][x] = self.size() - 1;
                siftUp(self.loc[y][x]);
            };
            self.extract = function() {
                var top = self.data[0];
                self.loc[top.y][top.x] = -1;
                self.data[0] = self.data[self.size()-1];
                self.loc[self.data[0].y][self.data[0].x] = 0;
                self.data.pop();
                siftDown(0);
                return top;
            };
            self.has = function(x, y) { return self.loc[y][x] >= 0; };
            self.decrease = function(x, y, val) {
                if (!self.has(x, y)) return;
                if (self.data[self.loc[y][x]] <= val) return;
                self.data[self.loc[y][x]] = val;
                siftUp(self.loc[y][x]);
            };
        };

        for (q.insert(src.x, src.y, 0); !q.empty(); ) {
            var current = q.extract();
            if (current.x==dst.x && current.y==dst.y) {
                var track = [dst];
                while (prev[track[0].y][track[0].x])
                    track.unshift(prev[track[0].y][track[0].x]);
                return track;
            }

            var neighbor = getNeighbor(current);
            for (var i = 0; i < neighbor.length; ++i) {
                var x = current.x + neighbor[i].x;
                var y = current.y + neighbor[i].y;
                if (valid({x: x, y: y})) {
                    var dist = cost[current.y][current.x] + map[y][x] / 5;
                    if (dist < cost[y][x]) {
                        cost[y][x] = dist;
                        prev[y][x] = current;
                        if (q.has(x, y)) q.decrease(x, y, dist);
                        else q.insert(x, y, dist);
                    }
                }
            }
        }

        return [];
    };

    /*
     *  shortest path fast algorithm (spfa) w/o optimization
     */
    var spfa = function(src, dst) {
        if (src.x==dst.x && src.y==dst.y) return [src];

        var visited = [];
        for (var i = 0; i < map.length; ++i) {
            visited.push([]);
            for (var j = 0; j < map[0].length; ++j)
                visited[i].push(0);
        }
        visited[src.y][src.x] = 1;

        var cost = [];
        for (var i = 0; i < map.length; ++i) {
            cost.push([]);
            for (var j = 0; j < map[0].length; ++j)
                cost[i].push(Infinity);
        }
        cost[src.y][src.x] = 0;

        var prev = [];
        for (var i = 0; i < map.length; ++i)
            prev.push(new Array(map[0].length));

        var q = new Queue();
        for (q.push(src); !q.empty(); ) {
            var current = q.pop();
            var neighbor = getNeighbor(current);
            for (var i = 0; i < neighbor.length; ++i) {
                var x = current.x + neighbor[i].x;
                var y = current.y + neighbor[i].y;
                if (valid({x: x, y: y})) {
                    var dist = cost[current.y][current.x] + map[y][x] / 5;
                    if (dist < cost[y][x]) {
                        cost[y][x] = dist;
                        prev[y][x] = current;
                        if (!visited[y][x]) {
                            visited[y][x] = 1;
                            q.push({x: x, y: y});
                        }
                    }
                }
            }
            visited[current.y][current.x] = 0;
        }

        var track = [dst];
        while (prev[track[0].y][track[0].x])
            track.unshift(prev[track[0].y][track[0].x]);
        return track;
    };

    switch (this.algorithm) {
        case '0': return dijkstra(src, dst);
        case '1': return spfa(src, dst);
    }
};

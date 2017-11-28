function Searcher(algorithm) {
    this.algorithm = algorithm;
}

Searcher.prototype.search = function(gridShape, map, src, dst) {
    var valid = function(pos) {
        return 0<=pos.x && pos.x<map[0].length && 0<=pos.y && pos.y<map.length;
    };

    var getNeighbor = function(pos) {
        switch (gridShape.shape) {
            case '0':
                return [
                    {x: -1, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: id2px(gridShape, pos.x, pos.y).direction}
                ];

            case '1':
                return [
                    {x: -1, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: -1},
                    {x: 0, y: 1}
                ];

            case '2':
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

    var bfs = function(src, dst) {
        if (src.x==dst.x && src.y==dst.y) return {
            animationList: new Queue(),
            track: [src]
        };
        else {
            var visited = [];
            for (var i = 0; i < map.length; ++i) {
                visited.push([]);
                for (var j = 0; j < map[0].length; ++j)
                    visited[i].push(0);
            }
            visited[src.y][src.x] = 1;

            var prev = [];
            for (var i = 0; i < map.length; ++i)
                prev.push(new Array(map[0].length));

            var q = new Queue();
            var animationList = new Queue();
            for (q.push(src), animationList.push(src); !q.empty(); ) {
                var current = q.pop();

                var neighbor = getNeighbor(current);
                for (var i = 0; i < neighbor.length; ++i) {
                    var x = current.x + neighbor[i].x;
                    var y = current.y + neighbor[i].y;
                    if (valid({x: x, y: y}) && map[y][x]!=3 && !visited[y][x]) {
                        visited[y][x] = 1;
                        prev[y][x] = current;
                        q.push({x: x, y: y});
                        animationList.push({x: x, y: y});
                        if (x==dst.x && y==dst.y) {
                            var track = [dst];
                            while (prev[track[0].y][track[0].x])
                                track.unshift(prev[track[0].y][track[0].x]);
                            return {
                                animationList: animationList,
                                track: track
                            };
                        }
                    }
                }
            }

            return {
                animationList: animationList,
                track: []
            };
        }
    };

    var bibfs = function(src, dst) {
        if (src.x==dst.x && src.y==dst.y) return {
            animationList: new Queue(),
            track: [src]
        };
        else {
            var visited = [[], []];
            for (var k = 0; k < 2; ++k)
                for (var i = 0; i < map.length; ++i) {
                    visited[k].push([]);
                    for (var j = 0; j < map[0].length; ++j)
                        visited[k][i].push(0);
                }
            visited[0][src.y][src.x] = 1;
            visited[1][dst.y][dst.x] = 1;

            var prev = [];
            for (var i = 0; i < map.length; ++i)
                prev.push(new Array(map[0].length));

            var q = [new Queue(), new Queue()];
            var animationList = new Queue();
            for (q[0].push(src), q[1].push(dst), animationList.push(src), animationList.push(dst);
                    !q[0].empty() && !q[1].empty(); q[k].pop()) {
                var current = [q[0].front(), q[1].front()];

                var neighbor = [getNeighbor(current[0]), getNeighbor(current[1])];
                var k = q[0].size() <= q[1].size() ? 0 : 1;
                for (var i = 0; i < neighbor[k].length; ++i) {
                    var x = current[k].x + neighbor[k][i].x;
                    var y = current[k].y + neighbor[k][i].y;
                    if (valid({x: x, y: y}) && map[y][x]!=3 && !visited[k][y][x]) {
                        if (visited[k^1][y][x]) {
                            var track = [k ? current[k] : {x: x, y: y}];
                            while (prev[track[0].y][track[0].x])
                                track.unshift(prev[track[0].y][track[0].x]);
                            track.reverse();
                            track.unshift(k ? {x: x, y: y} : current[k]);
                            while (prev[track[0].y][track[0].x])
                                track.unshift(prev[track[0].y][track[0].x]);
                            return {
                                animationList: animationList,
                                track: track
                            };
                        }
                        visited[k][y][x] = 1;
                        prev[y][x] = current[k];
                        q[k].push({x: x, y: y});
                        animationList.push({x: x, y: y});
                    }
                }
            }

            return {
                animationList: animationList,
                track: []
            };
        }
    };

    var ids = function(src, dst) {
        if (src.x==dst.x && src.y==dst.y) return {
            animationList: new Queue(),
            track: [src]
        };
        else {
            var visited = [];
            for (var i = 0; i < map.length; ++i) {
                visited.push([]);
                for (var j = 0; j < map[0].length; ++j)
                    visited[i].push(Infinity);
            }
            visited[src.y][src.x] = 0;

            var prev = [];
            for (var i = 0; i < map.length; ++i)
                prev.push(new Array(map[0].length));

            // return 1 if find answer
            // return 0 if reach depth limit
            // return -1 if no answer
            var dfs = function(current, depth, depthLimit) {
                if (current.x==dst.x && current.y==dst.y) return 1;

                var reachDepthLimit = (depth==depthLimit) ? 1 : 0;
                if (depth < depthLimit) {
                    var neighbor = getNeighbor(current);
                    for (var i = 0; i < neighbor.length; ++i) {
                        var x = current.x + neighbor[i].x;
                        var y = current.y + neighbor[i].y;
                        if (valid({x: x, y: y}) && map[y][x]!=3 && depth+1<visited[y][x]) {
                            visited[y][x] = depth + 1;
                            prev[y][x] = current;
                            animationList.push({x: x, y: y});
                            var result = dfs({x: x, y: y}, depth+1, depthLimit);
                            if (result == 1) return 1;
                            if (result == 0) reachDepthLimit = 1;
                        }
                    }
                }

                return reachDepthLimit ? 0 : -1;
            };

            var animationList = new Queue();
            var depthLimit = 1;
            while (true) {
                animationList.push(src);

                var result = dfs(src, 0, depthLimit++);
                if (result == 1) {
                    var track = [dst];
                    while (prev[track[0].y][track[0].x])
                        track.unshift(prev[track[0].y][track[0].x]);
                    return {
                        animationList: animationList,
                        track: track
                    };
                }
                if (result == -1) return {
                    animationList: animationList,
                    track: []
                };

                for (var i = 0; i < map.length; ++i)
                    for (var j = 0; j < map[0].length; ++j)
                        visited[i][j] = Infinity;
                visited[src.y][src.x] = 0;

                animationList.push({x: -1, y: -1});
            }
        }
    };

    var gbfs = function(src, dst) {
        if (src.x==dst.x && src.y==dst.y) return {
            animationList: new Queue(),
            track: [src]
        };
        else {
            var visited = [];
            for (var i = 0; i < map.length; ++i) {
                visited.push([]);
                for (var j = 0; j < map[0].length; ++j)
                    visited[i].push(0);
            }
            visited[src.y][src.x] = 1;

            var prev = [];
            for (var i = 0; i < map.length; ++i)
                prev.push(new Array(map[0].length));

            var h = function(pos) {
                switch (gridShape.shape) {
                    case '0':
                    case '1':
                        return Math.abs(pos.x-dst.x) + Math.abs(pos.y-dst.y);
                    case '2':
                        var x = dst.x - pos.x + (pos.y&1);
                        var y = Math.abs(pos.y - dst.y);
                        return (y&1)
                            ? Math.abs(x*2-1) + Math.max(0, (y+1)/2 - Math.abs(x - ((x>0)?0:1)))
                            : Math.abs(x)*2 + Math.max(0, y/2 - Math.abs(x));
                }
            };

            var q = new PriorityQueue();
            var animationList = new Queue();
            for (q.push({x: src.x, y: src.y, priority: 0}), animationList.push(src); !q.empty(); ) {
                var current = q.pop();

                var neighbor = getNeighbor(current);
                for (var i = 0; i < neighbor.length; ++i) {
                    var x = current.x + neighbor[i].x;
                    var y = current.y + neighbor[i].y;
                    if (valid({x: x, y: y}) && map[y][x]!=3 && !visited[y][x]) {
                        visited[y][x] = 1;
                        prev[y][x] = current;
                        q.push({x: x, y: y, priority: h({x: x, y: y})});
                        animationList.push({x: x, y: y});
                        if (x==dst.x && y==dst.y) {
                            var track = [dst];
                            while (prev[track[0].y][track[0].x])
                                track.unshift(prev[track[0].y][track[0].x]);
                            return {
                                animationList: animationList,
                                track: track
                            };
                        }
                    }
                }
            }

            return {
                animationList: animationList,
                track: []
            };
        }
    };

    var astar = function(src, dst) {
        if (src.x==dst.x && src.y==dst.y) return {
            animationList: new Queue(),
            track: [src]
        };
        else {
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

            var g = function(pos) { return cost[pos.y][pos.x]; };
            var h = function(pos) {
                switch (gridShape.shape) {
                    case '0':
                    case '1':
                        return Math.abs(pos.x-dst.x) + Math.abs(pos.y-dst.y);
                    case '2':
                        var x = dst.x - pos.x + (pos.y&1);
                        var y = Math.abs(pos.y - dst.y);
                        return (y&1)
                            ? Math.abs(x*2-1) + Math.max(0, (y+1)/2 - Math.abs(x - ((x>0)?0:1)))
                            : Math.abs(x)*2 + Math.max(0, y/2 - Math.abs(x));
                }
            };

            var q = new PriorityQueue();
            var animationList = new Queue();
            for (q.push({x: src.x, y: src.y, priority: 0}), animationList.push(src); !q.empty(); ) {
                var current = q.pop();

                var neighbor = getNeighbor(current);
                for (var i = 0; i < neighbor.length; ++i) {
                    var x = current.x + neighbor[i].x;
                    var y = current.y + neighbor[i].y;
                    if (valid({x: x, y: y}) && map[y][x]!=3 && g(current)+1<cost[y][x]) {
                        cost[y][x] = g(current) + 1;
                        prev[y][x] = current;
                        q.push({x: x, y: y, priority: cost[y][x]+h({x: x, y: y})});
                        animationList.push({x: x, y: y});
                        if (x==dst.x && y==dst.y) {
                            var track = [dst];
                            while (prev[track[0].y][track[0].x])
                                track.unshift(prev[track[0].y][track[0].x]);
                            return {
                                animationList: animationList,
                                track: track
                            };
                        }
                    }
                }
            }

            return {
                animationList: animationList,
                track: []
            };
        }
    };

    switch (this.algorithm) {
        case '0': return bfs(src, dst);
        case '1': return bibfs(src, dst);
        case '2': return ids(src, dst);
        case '3': return gbfs(src, dst);
        case '4': return astar(src, dst);
        case '5':
    }
};

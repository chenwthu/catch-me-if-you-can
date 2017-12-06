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
    var dijkstra = function(src, dst) {};

    /*
     *  shortest path fast algorithm (spfa) w/o optimization
     */
    var spfa = function(src, dst) {
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

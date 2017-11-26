function Searcher(algorithm) {
    this.algorithm = algorithm;
}

Searcher.prototype.search = function(gridShape, map, src, dst, animation, painter) {
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
            prev: [],
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
            for (q.push(src), animationList.push(src); !q.empty(); q.pop()) {
                var current = q.front();

                var neighbor = getNeighbor(current);
                for (var i = 0; i < neighbor.length; ++i) {
                    var x = current.x + neighbor[i].x;
                    var y = current.y + neighbor[i].y;
                    if (valid({x: x, y: y}) && map[y][x]!=3 && !visited[y][x]) {
                        visited[y][x] = 1;
                        prev[y][x] = current;
                        q.push({x: x, y: y});
                        animationList.push({x: x, y: y});
                        if (animation && !(x==dst.x && y==dst.y)) map[y][x] = 4;
                        if (x==dst.x && y==dst.y) {
                            var track = [dst];
                            while (prev[track[0].y][track[0].x])
                                track.unshift(prev[track[0].y][track[0].x]);
                            return {
                                animationList: animationList,
                                prev: prev,
                                track: track
                            };
                        }
                    }
                }
            }
        }
        return {
            animationList: animationList,
            prev: prev,
            track: []
        };
    };

    /* main */
    switch (this.algorithm) {
        case '0': result = bfs(src, dst); break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
    }

    var showTrack = function() {
        $.each(result.track, function(id, val) {
            painter.paint(gridShape, 'fill', val.x, val.y, 'red');
            if (!(val.x==src.x && val.y==src.y) && !(val.x==dst.x && val.y==dst.y))
                map[val.y][val.x] = 5;
        });
    };

    if (animation) {
        var int = setInterval(function() {
            var current = result.animationList.front();
            painter.paint(gridShape, 'fill', current.x, current.y, 'cyan');
            result.animationList.pop();

            if (result.animationList.empty()) {
                showTrack();
                clearInterval(int);
            }
        }, 200);
    }
    else showTrack();
};

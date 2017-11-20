function id2px(gridShape, x, y) {
	var a = gridShape.a;
	switch (gridShape.shape) {
		case '0': return {x: x*a/2, y: (y+.5)*a*Math.sqrt(3)/2, direction: ((x+y)&1)*2-1};
		case '1': return {x: (x+.5)*a, y: (y+.5)*a};
		case '2': return {x: (y&1)?(x*1.5*a):((x*1.5+.75)*a), y: y*a*Math.sqrt(3)/4};
	}
}

function px2id(gridShape, x, y) {}

function getMap(canvas, gridShape) {
	var map = [];
	for (var y = 0; id2px(gridShape,0,y).y < canvas.height(); ++y) {
		map.push([]);
		for (var x = 0; id2px(gridShape,x,0).x < canvas.width(); ++x) map[y].push(0);
	}
	return map;
}

function newSrcDst(map) {
	var src, dst;

	do {
		src = {x: Math.floor(Math.random()*map[0].length), y: Math.floor(Math.random()*map.length)};
	} while (map[src.y][src.x]);
	do {
		dst = {x: Math.floor(Math.random()*map[0].length), y: Math.floor(Math.random()*map.length)};
	} while (map[dst.y][dst.x]);
	
	return [src, dst];
};

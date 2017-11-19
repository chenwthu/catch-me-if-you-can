function Searcher(algorithm) {
	this.algorithm = algorithm;

	this.getMap = function(canvas, shape) {
		var map = [];
		var a = 40;
		switch (shape) {
			case '0':
				var h = a * Math.sqrt(3) / 2;
				for (var y = 0; (y+0.5)*h < canvas.height(); ++y) {
					map.push([]);
					for (var x = 0; x*a/2 < canvas.width(); ++x) map[y].push(0);
				}
				break;

			case '1':
				for (var y = 0; (y+0.5)*a < canvas.height(); ++y) {
					map.push([]);
					for (var x = 0; (x+0.5)*a < canvas.width(); ++x) map[y].push(0);
				}
				break;

			case '2':
				var h = a * Math.sqrt(3) / 2;
				for (var y = 0; y*h/2 < canvas.height(); ++y) {
					map.push([]);
					for (var x = 0; (x*1.5+0.75)*a < canvas.width(); ++x) map[y].push(0);
				}
				break;
		}
		return map;
	};
}

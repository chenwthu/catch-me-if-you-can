function Painter(canvas, shape) {
	this.canvas = canvas;
	this.shape = shape;
}

Painter.prototype.paint = function() {
	var ctx = this.canvas[0].getContext('2d');
	this.shape = arguments[0];
	var method = arguments[1];
	if (arguments.length > 2) {
		var x = arguments[2];
		var y = arguments[3];
	}

	var triangle = function(x, y, direction, a) {
		var h = a * Math.sqrt(3) / 2;
		ctx.beginPath();
		ctx.moveTo(x, y-h*direction/2);
		ctx.lineTo(x-a/2, y+h*direction/2);
		ctx.lineTo(x+a/2, y+h*direction/2);
		if (method == 'contour') {
			ctx.closePath();
			ctx.stroke();
		}
		else if (method == 'fill') {
			ctx.fill();
		}
	};

	var square = function(x, y, a) {
		ctx.beginPath();
		ctx.moveTo(x-a/2, y-a/2);
		ctx.lineTo(x+a/2, y-a/2);
		ctx.lineTo(x+a/2, y+a/2);
		ctx.lineTo(x-a/2, y+a/2);
		if (method == 'contour') {
			ctx.closePath();
			ctx.stroke();
		}
		else if (method == 'fill') {
			ctx.fill();
		}
	};

	var hexagon = function(x, y, a) {
		var h = a * Math.sqrt(3) / 2;
		ctx.beginPath();
		ctx.moveTo(x-a/4, y-h/2);
		ctx.lineTo(x+a/4, y-h/2);
		ctx.lineTo(x+a/2, y);
		ctx.lineTo(x+a/4, y+h/2);
		ctx.lineTo(x-a/4, y+h/2);
		ctx.lineTo(x-a/2, y);
		if (method == 'contour') {
			ctx.closePath();
			ctx.stroke();
		}
		else if (method == 'fill') {
			ctx.fill();
		}
	};

	var a = 40;
	switch (this.shape) {
		case '0':
			var h = a * Math.sqrt(3) / 2;
			if (arguments.length > 2)
				triangle(x*a/2, (y+0.5)*h, ((x+y)&1)*2-1, a);
			else
				for (var y = 0; (y+0.5)*h < this.canvas.height(); ++y)
					for (var x = 0; x*a/2 < this.canvas.width(); ++x)
						triangle(x*a/2, (y+0.5)*h, ((x+y)&1)*2-1, a);
			break;

		case '1':
			if (arguments.length > 2)
				square((x+0.5)*a, (y+0.5)*a, a);
			else
				for (var y = 0; (y+0.5)*a < this.canvas.height(); ++y)
					for (var x = 0; (x+0.5)*a < this.canvas.width(); ++x)
						square((x+0.5)*a, (y+0.5)*a, a);
			break;

		case '2':
			var h = a * Math.sqrt(3) / 2;
			if (arguments.length > 2)
				if (y & 1) hexagon(x*1.5*a, y*h/2, a);
				else hexagon((x*1.5+0.75)*a, y*h/2, a);
			else
				for (var y = 0; y*h/2 < this.canvas.height(); ++y)
					for (var x = 0; (x*1.5+0.75)*a < this.canvas.width(); ++x)
						if (y & 1) hexagon(x*1.5*a, y*h/2, a);
						else hexagon((x*1.5+0.75)*a, y*h/2, a);
			break;
	}
};

Painter.prototype.clear = function() {
	this.canvas[0].getContext('2d').clearRect(0, 0, this.canvas.width(), this.canvas.height());
}

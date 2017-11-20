function Painter(canvas) {
	this.canvas = canvas;
}

/*
 * paint(gridShape, 'contour')
 * paint(gridShape, 'fill', x, y, fillStyle)
 * paint(gridShape, 'image', x, y, src)
 */
Painter.prototype.paint = function() {
	var ctx = this.canvas[0].getContext('2d');
	var args = arguments;

	var paintGrid = function(grid) {
		var x = grid.x, y = grid.y, a = args[0].a;
		if (args[0].shape == '0') var direction = grid.direction;

		ctx.beginPath();
		switch (args[0].shape) {
			case '0':
				var h = a * Math.sqrt(3) / 2;
				ctx.moveTo(x, y-h*direction/2);
				ctx.lineTo(x-a/2, y+h*direction/2);
				ctx.lineTo(x+a/2, y+h*direction/2);
				break;
			case '1':
				ctx.moveTo(x-a/2, y-a/2);
				ctx.lineTo(x+a/2, y-a/2);
				ctx.lineTo(x+a/2, y+a/2);
				ctx.lineTo(x-a/2, y+a/2);
				break;
			case '2':
				var h = a * Math.sqrt(3) / 2;
				ctx.moveTo(x-a/4, y-h/2);
				ctx.lineTo(x+a/4, y-h/2);
				ctx.lineTo(x+a/2, y);
				ctx.lineTo(x+a/4, y+h/2);
				ctx.lineTo(x-a/4, y+h/2);
				ctx.lineTo(x-a/2, y);
		}
		switch (args[1]) {
			case 'contour':
				ctx.closePath();
				ctx.strokeStyle = '#888';
				ctx.stroke();
				break;
			case 'fill':
				ctx.fillStyle = args[4];
				ctx.fill();
				break;
			case 'image':
				var img = new Image();
				img.src = args[4];
				img.onload = function() { ctx.drawImage(img, x-16, y-16); }
		}
	};

	if (args.length > 2) paintGrid(id2px(args[0], args[2], args[3]));
	else
		for (var y = 0; id2px(args[0],0,y).y <= this.canvas.height(); ++y)
			for (var x = 0; id2px(args[0],x,0).x <= this.canvas.width(); ++x)
				paintGrid(id2px(args[0], x, y));
};

Painter.prototype.clear = function() {
	this.canvas[0].getContext('2d').clearRect(0, 0, this.canvas.width(), this.canvas.height());
}

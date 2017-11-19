$(function() {
	$('#map-container').width($(this).height());

	var shape = $('input[name=grid-shape]:checked').val();

	var gridPainter = new Painter($('#grid-layer'), shape);
	var obstaclePainter = new Painter($('#obstacle-layer'), shape);
	var srcDstPainter = new Painter($('#src-dst-layer'), shape);
	var trackPainter = new Painter($('#track-layer'), shape);

	var searcher = new Searcher($('input[name=algorithm]:checked').val());
	var map = searcher.getMap($('#grid-layer'), shape);

	var src = {x: Math.floor(Math.random()*map[0].length), y: Math.floor(Math.random()*map.length)};
	var dst = {x: Math.floor(Math.random()*map[0].length), y: Math.floor(Math.random()*map.length)};
	map[src.y][src.x] = 1;
	map[dst.y][dst.x] = 2;
	gridPainter.paint(shape, 'contour');
	srcDstPainter.paint(shape, 'fill', src.x, src.y);
	srcDstPainter.paint(shape, 'fill', dst.x, dst.y);

	$('input[name=grid-shape]').on('change', function() {
		gridPainter.clear();
		obstaclePainter.clear();
		srcDstPainter.clear();
		trackPainter.clear();

		var shape = $('input[name=grid-shape]:checked').val()
		map = searcher.getMap($('#grid-layer'), shape);

		var src = {x: Math.floor(Math.random()*map[0].length), y: Math.floor(Math.random()*map.length)};
		var dst = {x: Math.floor(Math.random()*map[0].length), y: Math.floor(Math.random()*map.length)};
		map[src.y][src.x] = 1;
		map[dst.y][dst.x] = 2;
		gridPainter.paint(shape, 'contour');
		srcDstPainter.paint(shape, 'fill', src.x, src.y);
		srcDstPainter.paint(shape, 'fill', dst.x, dst.y);
	});
	$('input[name=algorithm]').on('change', function() {
		searcher.algorithm = $('input[name=algorithm]:checked').val();
	});
	$('#catch-me').on('click', function() { searcher.search(); });
	$('#clear-obstacles').on('click', function() { obstaclePainter.clear(); });
	$('#clear-tracks').on('click', function() { trackPainter.clear(); });
});

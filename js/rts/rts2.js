$(function() {
    // initialize instances
    var terrainPainter = new Painter($('#terrain-layer'));
    var srcDstPainter = new Painter($('#src-dst-layer'));
    var trackPainter = new Painter($('#track-layer'));

    // shape and side length (triangle and square) or diameter (hexagon) of a grid
    var gridShape = {shape: $('input[name=grid-shape]:checked').val(), a: 32};
    var map, src, dst;

    var srcImage = 'data:image/png;base64,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';
    var dstImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH3AIXFCsL5Ktl/wAACrRJREFUWMPNln1wVNXdx7+/e+++797dzQt5TyDZJCaRJKQQqhQFRK2pzKjVQkvFzEjtq+hMdRSnrU87rQ9MFbUd+hJbxdpXKH0bQyuWFkHbMCjyTrIJCQshkN00ye7du3tfzj3n+SOa5+lA5rF/tb+ZM/fOnLnnfM7v+/t9zwX+zSH/qx9UVlYinU7jwIED6OxcioqKCsiyjPnz58NxHOi6/i+tpwDAo/d2gXOBFR3X4NxYCi21lVj1xS1YfG0DOOdoa4ph9FIKN3TdidWrV+Ps8DBOnz7t6+jwRVLJlBGPx9OHDh3iU1NT6OnpwYoVK7Bp06YPDjB8MQUBRORjg1WD8Xj//sEpu6GxEafPJ6GnJ0FEihCCEZFcXl5eHo1GV/11//6POY5TKsuy6Xa5xvr7+/cdOXLktd27d4/fv3EjPvPAA3ihp+f/BSAA+PaX7gHnom11Z8u2xGT+J4+/sOcP8TMn8wCc733lc00LKsvWysGCC97qtsqS0tK73G53DUB+IoIQAi5FgcfjyadSqb6hocFnt2zd+ue1a9fmv799OyoqK7Fv3765AdasWYNFZV5wZrfe/Ym1O8PVTRHHHToejoTzdj7rXHjrdzWcsw5/KOKEGj4scSVAnDsQMwEhQLIsiWgkQrIsQ8tqqUQi8dO+vkPbHn3ky6NEhJqaGiQSiatLMDY2hp++sg+9vb0VcsXCCAXUkpDPe7Pf70cmM4HR8RSODl0SK5e0SCHHIdkjCyLAtm3YNoMQApLkhs2YEBDwen3FtbW1D/n9geYf9vQ89O7RowOL2tvnzIB074YNeGzz5pUNjdc8GQgES4aHh3Hq5CloGQ3kDUJTosgbBjlqOYWKyxEKBSkUCpGqqhQMBikUCiLg9xMAYjYjxhiISCouLrq1ri72he4N97mffvqZudswGi0I3v3xux+vr6+/3XGY6HmhhwYG4qK1rRWhcASMMcqZjiiva0HxvHnkOI7gnIMAyIoMWZLI4VxIRJBlGY7jEGNcACC3210djRYcrIvFRvP5PPr7+68EeGrLlq82t7TcF/D7vZIsoaioiGKxGKqrqkCSBCG5KGs6iMXq4Ha7iDscXAgIwcGYA9OySCKC4lIgyRKYzYg5DJxzSJIUcrvdua7bPrpXVhSRSiavBHj4/vW/j3jlsFeNChAhFFIpEomCpJkKn5qeJo/Hi+KiIgghyHE4HMcB5xy6rsOybHK5FITDYciyjKyu0/vzAMiyLJfL7X69vr5h6tChviuL8Mzxdy74lY7mQEkN5fQcNE2DLMskSQRN06BndUSjUXIcB0QKIEC2bcNxHGiahkAggFAoRCQRdE2HbdvgXBAgZopMkso7OzsrJEk6e9UuiKeMJyos73pndGypaZqFAPmDwQDy+Tx0XUdhYQF5vV4hSRJcLheZpiksy4ZpmuBcIBAIEHOYYFmGXD4Pxhi916Hv+Qz5I5FoQJLo6kV44I3XB667fvneysrKA7Ki/DGZSnkt02rKZrNgjCMQCJAkSRBCgHNOpmnCtExktSwUlwK/z0eMMdi2DcMwwZhDQnBwLiCEINM08tPT6Z2c87O/3rXzygyQ5EV3d3e6tKzsb4riwsDA8Vxtbd0yVVXnKbItMpkMVDUEIQBJIjDmIJvNwjANSLIMwzAAEITgs77w/iAiGIaZSybH85IkzX0X7NixAzt27MBtXV0w8saZ0tKyQY/HM88QgiRJgqIoREQgotksMJvBNE0Yhjlr6YLzmc0Bel8D0zS1kZERTVGUuQEAoPvOm3EpP1PhPq9HEMSMprYdZ8zWg8Fgq6IoshBCEAgAwTQM5N0eUhRZgAiYOTnNPAQAkG0zKz2dNjl3EAoGkDNN+DweZLMz1/bs/8Daznm46fZ1WNx+bUtbfdVGEk54+MKlE2eHhj4fjw/8vaq6eo3DhceyLMiyRC6Xi7JZ/b2OkfG+7pxzchw2+26apq1lM3uff/65cx5HR2FhAdRgEEIILKipwqww/Wk/7un+LJZU+dtqVaec6VOvn0+cf+ChB790gAQ/75GEBcfC+Pjl1ycmJl7S9exl7tjEOQdzGBibGTazYZgmMcbAHAav11PmkcQT933ijs39Q8PdQog7OBdLcvm8qqrq/0rQUF2GhY113peefGCJYdlHD75zZtPShfX9R/+8E3VFnsprC4VnKJl9d+z8yDOpxMCJaHGpyWXPxgUNzYOVVVUNEkmS4zgwTWNaCIDJzAdAcRxH+NzKyrLSecsNy+YAUXVleaogGnnjUjK1dRZgZXsMnbHSgEdxLRq9lNr3jS3PDG646za8vHsP+n/z7EeRncgNDF3af9eN7Vu0sVDunaGLrr7TQ7sTY8kfd3V1Pe3z+Vozmrbv7cOHv8mYTfNKSlpVNVwwmRq3LicG7anJyWQ2b+gF0Wi71+e9K+oK38scR8wCCJcPiamJsKeQlElL3rd/14vO6NAJbH1wXcXdKxcvnkiO/2VwNPXiLUv427qs1LkUmdcV+89Papo3fvxtbgl5MJs3vnLHHXf2DQz0w+v1/lVxuRDw+yAMDW5FhkfL4pWdv9u15tabekvmFb8cDatrZu3p4Y3rcX5sPNpUV9NWXqj2/SOTM944Nuz95E2L/qs04l9/YmT8STlY+OKZsfSCro+0fXNhqbdZT45OnxqdFGcuTktjU/r2l1/52a5oQQEqKipw8sSJf2q3grCKrlXLoBs2JqfT4YZY7e9JktpmM7C4sQYeSUwtaqjez4SM+MVJlBUEXYnxqYvnxicfO3Z27KAbw9j96mvnagsf+fr05UDxm4ePTiSnsk7etMz9Bw6OLr/hBoRCKvb0vnpFvz/7tU3Ye/Aw/rT/TeX+dXduCKtqx+WJf/TOAnz60aeu5hMagO1CCP6D725DbiqF3a++JgDEZQnx1rpyGKYFEgLbPnMLAgrhzWNxROylODk8Br/Pg+UdLehoqUcmq+HkwHDwkY2f+lwoFNyczubP6HrumavbE4Dm5iaYloWA18ubGusxOHwOpYURAMD6VQvx8q5ef3V5cYwrcg0EZ2dGRkfnF0cuH4mfz/187yFDCOEQEQwmvOGwGjVs58Nf+NSatSB51URae2s8lfrGL37b+zbNBdAYq8XA0DBW37gMK67vxEc62xHyudFx6zpsf/LBxpWLW54oiQZXZzKZKds0DNXrKhAOMy6npk5lDXNQkpWkZtge3eLXqGpoKSe5YiKtJxKXJr7/t3dP/eqWG5dNbt7yXcwJULegBmdHErRq+XXlsQXVVQ0LqiNFkWCwtWF+a2k0+DFum+5kMvVSfCTx92Rq0rzu2tpKzuwlfrfcWaQGYorLreYZlzSD2aMT6ZGLE5newQvjv32q55envnjvx7HnjT60N8UwpwRulwtEEsmy7FvY1DB/5fVLPhTwKNWCWSV5yzp+oO/Yc92PbTmWeO5xCAg0L6g4Erjh/t6nH7wnsLK9wTt4MaWm0jl3YUTVNcPKfPZbP0r/98PdnIhw8/UdOHdhDOcujOEDSdDR2oyt3+nBwmtianlJcfDw8f7JX257wuj9y1t4/usPoWbZPUhNa1h3cyduv24h2moroLhcyFoMhi0QH03i1Tffxc/3HEQo4IOm52f3mRPg/0ZJcSH0XB6LWhpRVBBBOpPFopZGvLTrD5icznyQJf5z438AvohrcO3uLYIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMTEtMTJUMTI6NDE6MzcrMDg6MDCB92myAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDEyLTAyLTIzVDIwOjQzOjExKzA4OjAwud0j3gAAAE10RVh0c29mdHdhcmUASW1hZ2VNYWdpY2sgNy4wLjEtNiBRMTYgeDg2XzY0IDIwMTYtMDktMTcgaHR0cDovL3d3dy5pbWFnZW1hZ2ljay5vcmfd2aVOAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA0OIdghy0AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANDh/z0egAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADEzMzAwMDA5OTFvA42fAAAAEnRFWHRUaHVtYjo6U2l6ZQAzLjU4S0KrPVtmAAAAXXRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL3NyYy81ODQ2LzU4NDYwMi5wbme0Iw8AAAAAAElFTkSuQmCC';

    // refresh positions of src and dst, and repaint map
    var setup = function() {
        map = getMap($('#terrain-layer'), gridShape);
        var srcDst = newSrcDst(map);
        src = srcDst[0];
        dst = srcDst[1];

        var colormap = [
            '#0000ff', '#0004fd', '#0008fb', '#000cf9', '#0010f7', '#0014f5', '#0018f3', '#001cf1',
            '#0020ef', '#0024ed', '#0028eb', '#002de9', '#0031e7', '#0035e5', '#0039e3', '#003de1',
            '#0041df', '#0045dd', '#0049db', '#004dd9', '#0051d7', '#0055d5', '#0059d2', '#005dd0',
            '#0061ce', '#0065cc', '#0069ca', '#006dc8', '#0071c6', '#0075c4', '#0079c2', '#007dc0',
            '#0082be', '#0086bc', '#008aba', '#008eb8', '#0092b6', '#0096b4', '#009ab2', '#009eb0',
            '#00a2ae', '#00a6ac', '#00aaaa', '#00aea8', '#00b2a6', '#00b6a4', '#00baa2', '#00bea0',
            '#00c29e', '#00c69c', '#00ca9a', '#00ce98', '#00d296', '#00d794', '#00db92', '#00df90',
            '#00e38e', '#00e78c', '#00eb8a', '#00ef88', '#00f386', '#00f784', '#00fb82', '#00ff80'];
        for (var y = 0; y < map.length; ++y)
            for (var x = 0; x < map[0].length; ++x) {
                map[y][x] = parseInt(Math.random() * 100) % 64;
                terrainPainter.paint(gridShape, 'fill', x, y, colormap[63-map[y][x]]);
            }

        srcDstPainter.paint(gridShape, 'image', src.x, src.y, srcImage);
        srcDstPainter.paint(gridShape, 'image', dst.x, dst.y, dstImage);
        $('#map-container').scrollLeft(
            id2px(gridShape, (src.x+dst.x)/2, (src.y+dst.y)/2).x - $('#map-container').width()/2);
        $('#map-container').scrollTop(
            id2px(gridShape, (src.x+dst.x)/2, (src.y+dst.y)/2).y - $('#map-container').height()/2);
    };
    setup();

    var catching = 0;

    /*
     *  mouse event on panel
     */
    $('#grid-shape button').on('click', function() {
        $('#grid-shape label').slideToggle();
    });

    $('input[name=grid-shape]').on('change', function() {
        if (catching) $('#catch-me').click();

        terrainPainter.clear();
        srcDstPainter.clear();
        trackPainter.clear();

        gridShape.shape = $('input[name=grid-shape]:checked').val();
        setup();
    });

    $('#catch-me').on('click', function() {
        var valid = function(pos) {
            return 0<=pos.x && pos.x<map[0].length && 0<=pos.y && pos.y<map.length;
        };

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

        var h = function(pos) {
            switch (gridShape.shape) {
                case '0': // triangle
                case '1': // square
                    return Math.abs(pos[0].x-pos[1].x) + Math.abs(pos[0].y-pos[1].y);
                case '2': // hexagon
                    var y = Math.abs(pos[0].y - pos[1].y);
                    var x = pos[1].x - pos[0].x + (y&pos[0].y&1);
                    return (y&1)
                        ? Math.abs(x*2-1) + Math.max(0, (y+1)/2 - Math.abs(x - ((x>0)?0:1)))
                        : Math.abs(x)*2 + Math.max(0, y/2 - Math.abs(x));
            }
        };

        var escape = function() {
            if (!catching) return;

            var neighbor = getNeighbor(dst);
            var k = 0, maxDist = -Infinity;
            for (var i = 0; i < neighbor.length; ++i) {
                var x = dst.x + neighbor[i].x;
                var y = dst.y + neighbor[i].y;
                if (valid({x: x, y: y})) {
                    var dist = Math.log(1+h([src, {x: x, y: y}]))*1e4 + map[y][x]/1e4;
                    if (dist > maxDist) { k = i; maxDist = dist; }
                }
            }

            dst.x += neighbor[k].x;
            dst.y += neighbor[k].y;
            srcDstPainter.clear();
            srcDstPainter.paint(gridShape, 'image', src.x, src.y, srcImage);
            srcDstPainter.paint(gridShape, 'image', dst.x, dst.y, dstImage);

            setTimeout(function() { escape(); }, 200);
        };

        var chase = function() {
            if (!catching) return;
            trackPainter.clear();

            var track = (function() { // spfa
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
                track.shift();
                return track;
            })();

            $.each(track, function(id, val) {
                trackPainter.paint(gridShape, 'fill', val.x, val.y, '#f05654');
            });

            if (track[0].x==dst.x && track[0].y==dst.y) {
                catching = 0;
                $('#catch-me').html('CATCH ME!');
                return;
            }

            var timeout = Math.max(parseInt(map[track[0].y][track[0].x]*5), 150);
            src = track[0];
            srcDstPainter.clear();
            srcDstPainter.paint(gridShape, 'image', src.x, src.y, srcImage);
            srcDstPainter.paint(gridShape, 'image', dst.x, dst.y, dstImage);

            setTimeout(function() { chase(); }, timeout);
        };

        if (catching) {
            catching = 0;
            $('#catch-me').html('CATCH ME!');
        }
        else {
            catching = 1;
            $('#catch-me').html('STOP!');
            escape();
            chase();
        }
    });
});

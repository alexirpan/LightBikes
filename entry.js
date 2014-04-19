Bot.register('TwitchPlaysLightCycle', function(game_state, player_state, move) {
    function oneD(c) {
        return c.x + 30 * c.y;
    }

    function twoD(n) {
        return {x: n % 30, y: Math.floor(n / 30)};
    }

    function generateGraph(game_state) {
        // vertices = positions
        // generate graph from current positions, ignore if full
        // vertices have attribute neighbors
        var board = game_state.board;
        var graph = {};
        var to_add = [oneD(game_state.me)];
        while (to_add.length > 0) {
            var n = to_add.pop();
            var coord = twoD(n);
            if (!(n in graph)) {
                graph[n] = {neighbors: []};
                var hex = board.get_hex_at(coord);
                if (!(hex === null) && !board.get_hex_at(coord).wall) {
                    var next = board.safe_surrounding_tiles(coord);
                    for (var i = 0; i < next.length; i++) {
                        if (next[i].x < 0 || next[i].x >= 30) {
                            continue;
                        }
                        if (next[i].y < 0 || next[i].y >= 15) {
                            continue;
                        }
                        var c2 = oneD(next[i]);
                        graph[n].neighbors.push(c2);
                        if (!(c2 in graph)) {
                            to_add.push(c2);
                        }
                    }
                }
            }
        }
        return graph;
    }

  // choose move that minimizes decrease in edge count
  var graph = generateGraph(game_state);
  var next = graph[oneD(game_state.me)].neighbors;
  // choose move such that neighbor has most walls.
  var best = -1;
  var n = 10;
  for (var i = 0; i < next.length; i++) {
    if (graph[next[i]].neighbors.length < n) {
        best = next[i];
        n = graph[next[i]].neighbors.length;
    }
  }
  for (var i = 0; i < 6; i++) {
    var next = game_state.board.new_coords_from_dir(game_state.me, i);
    if (oneD(next) === best) {
        move(i);
        break;
    }
  }
  console.log("Did a move?");
})
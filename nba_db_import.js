var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'mydb',
    password : '',
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ');
});

connection.query('SELECT * FROM nba_player_stats ORDER BY points_per_game DESC', function (error, players, fields) {
    if (error)
        throw error;

	data = [];
	for (let i = 0; i < players.length; ++i) {
		data.push({
			playerName: players[i].player_name,
			team: players[i].team,
			fieldGoalPercentage: players[i].field_goal_percentage,
			threesPercentage: players[i].threes_percentage,
			twosPercentage: players[i].twos_percentage, 
			freeThrowPercentage: players[i].free_throw_percentage,
			pointsPerGame: players[i].points_per_game
		});
	}

	module.exports = data;
  
	console.log(data);


});

connection.end();

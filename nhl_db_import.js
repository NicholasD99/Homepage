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

connection.query('SELECT * FROM nhl_goalie_stats ORDER BY goals_against_average', function (error, players, fields) {
    if (error)
        throw error;

	data = [];
	for (let i = 0; i < players.length; ++i) {
		data.push({
			playerName: players[i].player_name,
			team: players[i].team,
			wins: players[i].wins,
			savePercentage: players[i].save_percentage,
			goalsAgainstAverage: players[i].goals_against_average, 
			qualityStartPercentage: players[i].quality_start_percentage
		});
	}
			
	
module.exports = data;
  
console.log(data);
   
   	
        
});

connection.end();


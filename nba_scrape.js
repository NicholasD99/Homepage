const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const Promise = require("bluebird");
// the connect to mysql stuff
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

let URL = 'https://www.basketball-reference.com/leagues/NBA_2020_per_game.html';
const nightmare = new Nightmare({ show: true, height: 900, width: 1300});

let getData = (html, callback) => {
	data = [];
	const $ = cheerio.load(html);
	$('.stats_table tbody > tr').each((i, elem) => {
		if(i < 75){
			data.push({
				playerName: $(elem).find('td:nth-child(2)').text(),
				team: $(elem).find('td:nth-child(5)').text(),
				fieldGoalPercentage: $(elem).find('td:nth-child(11)').text() == '' ? 0 : $(elem).find('td:nth-child(11)').text(),
				threesPercentage: $(elem).find('td:nth-child(14)').text() == '' ? 0 : $(elem).find('td:nth-child(14)').text(),
				twosPercentage: $(elem).find('td:nth-child(17)').text() == '' ? 0 : $(elem).find('td:nth-child(17)').text(),
				freeThrowPercentage: $(elem).find('td:nth-child(21)').text() == '' ? 0 : $(elem).find('td:nth-child(21)').text(),
				pointsPerGame: $(elem).find('td:nth-child(30)').text() == '' ? 0 : $(elem).find('td:nth-child(30)').text()
			});

	

		}
	});
	con.connect(function(err) {
		if (err) throw err;
		let truncate = 'DELETE FROM nba_player_stats';
		con.query(truncate, function (err, result) {
			if (err) throw err;
				console.log("Connected!");
				let inserts = [];
				for(let i = 0; i < data.length; ++i){
					let insert = new Promise(function (res , rej){
			  		let query = `INSERT INTO nba_player_stats  (player_name, team, field_goal_percentage, threes_percentage, twos_percentage, free_throw_percentage, points_per_game) VALUES ("${data[i].playerName}", "${data[i].team}", ${data[i].fieldGoalPercentage}, ${data[i].threesPercentage}, ${data[i].twosPercentage}, ${data[i].freeThrowPercentage}, ${data[i].pointsPerGame})`;
			  		con.query(query, function (err, result) {
						if (err) throw err;
					    res();
					});
			  	});
			  	inserts.push(insert);
			}
			Promise.all(inserts).then(callback());
		});
	});


	return data;

};

function updateNBA(){
	return nightmare
      	.goto(URL)
      	.wait('.stats_table')
      	.click('#per_game_stats > thead > tr > th:nth-child(30)')
      	.evaluate(() => 
      		document.body.innerHTML
		)
      	.end()
      	.then(response => {
      		console.log(getData(response, () => {
      			console.log('done');
      		}));
      	})
    	.catch(err => {
    		console.log(err);
    	});
}

updateNBA();

module.exports = {
	updateNBA: updateNBA,
};

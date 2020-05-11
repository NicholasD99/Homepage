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

let URL = 'https://www.hockey-reference.com/leagues/NHL_2020_goalies.html';
const nightmare = new Nightmare({ show: true, height: 900, width: 1300});

let getData = (html, callback) => {
	data = [];
	const $ = cheerio.load(html);
	$('.stats_table tbody > tr').each((i, elem) => {
		if(i < 75){
			data.push({
				playerName: $(elem).find('td:nth-child(2) > a').text(),
				team: $(elem).find('td:nth-child(4)').text(),
				wins: $(elem).find('td:nth-child(7)').text(),
				savePercentage: $(elem).find('td:nth-child(13)').text(),
				goalsAgainstAverage: $(elem).find('td:nth-child(14)').text(), 
				qualityStartPercentage: $(elem).find('td:nth-child(19)').text() == '' ? 0 : $(elem).find('td:nth-child(19)').text()
			});
		}
	});
	con.connect(function(err) {
		if (err) throw err;
		let truncate = 'DELETE FROM nhl_goalie_stats';
		con.query(truncate, function (err, result) {
			if (err) throw err;
				console.log("Connected!");
				let inserts = [];
				for(let i = 0; i < data.length; ++i){
					let insert = new Promise(function (res , rej){
			  		let query = `INSERT INTO nhl_goalie_stats (player_name, team, wins, save_percentage, goals_against_average, quality_start_percentage) VALUES ("${data[i].playerName}", "${data[i].team}", ${data[i].wins}, ${data[i].savePercentage}, ${data[i].goalsAgainstAverage}, ${data[i].qualityStartPercentage})`;
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

function updateNHL(){
	return nightmare
      	.goto(URL)
      	.wait('.stats_table')
      	.click('#stats > thead > tr:nth-child(2) > th:nth-child(14)')
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

updateNHL();

module.exports = {
	updateNHL: updateNHL,
};





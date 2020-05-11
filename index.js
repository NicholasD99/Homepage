const express = require('express');
const request = require('request');
const app = express();
const port = 3000;
const apiKey = '';
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const handlebars = require('express-handlebars');

var nhlDataIn = require('./nhl_db_import.js');
var nbaDataIn = require('./nba_db_import.js');

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
	layoutsDir: __dirname + '/views/layouts',
	extname: 'hbs',
	helpers: require("./helpers/handlebars.js").helpers,
	partialsDir: __dirname + '/views/partials/',
	handlebars: allowInsecurePrototypeAccess(Handlebars)
}));


getNHL = () => {
	var nhlDataIn = require('./nhl_db_import.js');
    return nhlDataIn;
}
getNBA = () => {
	var nbaDataIn = require('./nba_db_import.js');
    return nbaDataIn;
}


app.use(express.static('public'));

app.get('/', function (req, res) {
	let city = 'toronto';
	let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
	request(url, function (err, response, body) {
		if(err){
			res.render('index', {weather: null, error: 'Error, please try again'});
	    } else {
			let weathers = JSON.parse(body)
			weathers.weatherDescription = weathers.weather[0].description;
			weathers.celsius = Math.round((weathers.main.temp - 32) * 5/9);
			weathers.visibilityRound = (Math.round(weathers.visibility/1000 * 100)/100);
			weathers.windsKM = weathers.wind.speed * 1.6;
			res.render('main_nhl_nba', {layout: 'index', weathers, goalieList: getNHL(), nbaPlayerList: getNBA(), listExists: true, error: null});
		}
	});
})


app.listen(port, () => console.log(`App listening to port ${port}`));
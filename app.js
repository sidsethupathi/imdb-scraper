var express = require('express'),
    http = require('http'),
    app = express(),
    events = require('events'),
	eventEmitter = new events.EventEmitter();


app.get('/', function(req, res) {
	var movies = ['tt0111161', 'tt0068646', 'tt0071562', 'tt0468569', 'tt0110912', 'tt0050083', 'tt0108052'];

	for(var m in movies) {
		var movies_out = [];

		console.log(movies[m]);
		http.get('http://www.omdbapi.com/?i=' + movies[m] + '&r=json', (function(id) {
			
			return function(response) {
				var body = '';
				response.on('data', function(d) {
					body += d;
				});

				response.on('end', function() {
					var movie_raw = JSON.parse(body);
					var movie_clean = {};

					movie_clean.rank = parseInt(id, 10) + 1; // array indexed by 0, so we want pretty type
					movie_clean.title = movie_raw.Title;
					movie_clean.year = movie_raw.year;
					movie_clean.rated = movie_raw.Rated;
					movie_clean.released = movie_raw.Released;
					movie_clean.runtime = movie_raw.Runtime;

					//special
					movie_clean.genre = movie_raw.Genre.split(', ');
					
					movie_clean.director = movie_raw.Director.split(', ');
					movie_clean.actors = movie_raw.Actors.split(', ');
					movie_clean.plot = movie_raw.Plot;
					movie_clean.language = movie_raw.Language;
					movie_clean.country = movie_raw.Country;
					movie_clean.awards = movie_raw.Awards;
					movie_clean.poster = movie_raw.Poster;
					movie_clean.metascore = movie_raw.Metascore;
					movie_clean.imdbRating = movie_raw.imdbRating;
					movie_clean.imdbVotes = movie_raw.imdbVotes;
					movie_clean.type = movie_raw.Type;
					movie_clean.imdbId = movie_raw.imdbId;

					movies_out.push(movie_clean);

					eventEmitter.emit('sendJson', res, movies_out, movies);
				});
			};

			
		})(m));
	}

	

});

eventEmitter.on('sendJson', function(res, m_out, m_in) {
	if(m_out.length === m_in.length) {
		res.json(m_out);
	}
});

console.log("listening on 3000");
app.listen(3000);

/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

const TEST_TEMPERATURES = [13, 18, 21, 19, 26, 25,16];


// Part 1 - DOM

whenDocumentLoaded(() => {
	// Part 1.1: Find the button + on click event

	var button1 = document.getElementById("btn-part1");

    button1.addEventListener('click', function() { console.log("Button has been clicked.") }, false);

    // Part 1.2: Write temperatures
	showTemperatures(document.getElementById("weather-part1"), TEST_TEMPERATURES);

});

function showTemperatures(container_element, temperature_array) {

	container_element.innerHTML = "";

    var class_;

	temperature_array.map(function(t) {
        class_ = "";
        if (t > 23) {
            class_ = 'warm';
        } else if (t < 17) {
            class_ = 'cold';
        }

		var newP = document.createElement("p");
        newP.className = class_;
        var newContent = document.createTextNode(t);
        newP.appendChild(newContent);

        container_element.appendChild(newP);

    });
}

// Part 2 - class

class Forecast {

	constructor(container_div) {
		this.container_div = document.getElementById(container_div);

		this.container_div.innerHTML = "";
		this.temperatures = [1,2,3,4,5,6,7];
	}

	toString() {
        var class_;
        var str_ = "";

        this.temperatures.map(function(t) {
            class_ = "";
            if (t > 23) {
                class_ = 'warm';
            } else if (t < 17) {
                class_ = 'cold';
            }

            str_ = str_ + '<p class="' + class_ + '">' + t + '</p>'
        });

		return str_;
	}

	print() {
		console.log(this.toString());
	}

	showTemperatures() {
		this.container_div.innerHTML = this.toString();
	}

	reload() {
		this.temperatures = TEST_TEMPERATURES;

		this.showTemperatures();
	}

	changeTemperatures(temp) {
		this.temperatures = temp;
	}

}

var obj = new Forecast("weather-part2");

obj.showTemperatures();

whenDocumentLoaded(() => {

    var button1 = document.getElementById("btn-part1");

    button1.addEventListener('click', function() { obj.reload() }, false);

});


// Part 3 - fetch

const QUERY_LAUSANNE = 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="Lausanne") and u="c"';

var JSON_LAUSANNE;

function yahooToTemperatures(data) {

	var forecast = data['query']['results']['channel']['item']['forecast'];

	let array_temp =  forecast.map(t => (parseInt(t['high'],10) + parseInt(t['low'], 10))/2);

	return array_temp;
}

class ForecastOnline extends Forecast {

    reload() {

    	var promise1 = new Promise((resolve, reject)  => {
            return fetch(QUERY_LAUSANNE) // Call the fetch function passing the url of the API as a parameter
				.then((resp) => resp.json())
                .then(function (data) {

                    // Your code for handling the data you get from the API
                    JSON_LAUSANNE = data;
                    resolve(yahooToTemperatures(JSON_LAUSANNE));

                })
        });

		promise1.then((temp) => {
			this.changeTemperatures(temp);
			this.showTemperatures()
        });
    }

}

var obj_online = new ForecastOnline("weather-part3");

obj_online.showTemperatures();

whenDocumentLoaded(() => {

    var button1 = document.getElementById("btn-part1");

    button1.addEventListener('click', function() { obj_online.reload() }, false);

});

// Part 4 - interactive

class ForecastOnlineCity extends ForecastOnline {

	dummyFunc() {
		this.container_div.innerHTML = "Please, search for a city!";
	}

	setCity() {
		var cityName = document.getElementById("query-city").value;

		console.log(cityName);

		this.city = cityName;

	}

	doStuff() {
		this.setCity();

        this.URL = 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + this.city + '") and u="c"';

        console.log(this.URL);

        this.reload()
	}

    reload() {

        var promise1 = new Promise((resolve, reject)  => {
            return fetch(this.URL) // Call the fetch function passing the url of the API as a parameter
                .then((resp) => resp.json())
                .then(function (data) {

                	console.log(data);

                    // Your code for handling the data you get from the API
                    resolve(yahooToTemperatures(data));

                })
				.catch(err => {
					console.log(err);
					reject(this.showError())
                });
        });

        promise1.then((temp) => {
        	console.log(temp);
            this.changeTemperatures(temp);
            this.showTemperatures()
        });
    }

    showTemperatures() {

		var city = '<h4>' + this.city + '</h4>: ';

		this.container_div.innerHTML = city + this.toString();

	}

	showError() {
		this.container_div.innerHTML = 'The city "' + this.city + '" does not seem to exist. Please check the spelling.';
	}


}

var objOnlineCity = new ForecastOnlineCity("weather-city");

objOnlineCity.dummyFunc();

whenDocumentLoaded(() => {

    var button1 = document.getElementById("btn-city");

    button1.addEventListener('click', function() { objOnlineCity.doStuff() }, false);

});



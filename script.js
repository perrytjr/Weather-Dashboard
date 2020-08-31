
//my api key from the openweathermap.org
let APIKey = "4f8564279b0a48b567bd6ba7e52a8a22";
//let cityList = document.getElementById("list-of-cities");
//empty array for cities
let cities = [];
let yourcity = "";
searchCities();
cityButton();
saveCities();

function getCities() {
    let cityStorage = JSON.parse(localStorage.getItem("cities"));
    if (cityStorage === null || cityStorage === undefined) {
        return;
    }
    makecitybuttons();
}
//localstorage for user city search
function saveCities() {
    localStorage.setItem("cities", JSON.stringify(cities));

}


function makecitybuttons() {
    $("#list-of-cities").innerHTML = "";
    if (cities === null) {
        return;
    }
    $("#list-of-cities").empty();
    let specificCities = [...new Set(cities)];
    for (var i = 0; i < specificCities.length; i++) {
        let newcityName = specificCities[i];
        let buttonElement = document.createElement("button");
        buttonElement.textContent = newcityName;
        buttonElement.setAttribute("class", "listbutton btn btn-outline-secondary btn-block");
        $("#list-of-cities").append(buttonElement);
        cityButton();

    }
}

function cityButton() {
    $(".listbutton").on("click", function (event) {
        console.log(".listbutton")
        event.preventDefault();
        yourcity = $(this).text().trim();
        getcurrentWeather();
        fivedayForcast();
        
    })

}

function searchCities() {
    $("#search-button").on("click", function (event) {
        console.log("#search-button");
        event.preventDefault();
        yourcity = $("#city-name").val();
        console.log("#city-name");
        cities.push(yourcity);

        //we only want 5 cities saved so .shift will remove the first saved city allow for a new one to be displayed 
        if (cities.length > 5) {
            cities.shift()
        }
        if (yourcity == "") {
            return;
        }
        saveCities();
        makecitybuttons();
        getcurrentWeather();
        fivedayForcast();
        
    })
}


function getcurrentWeather() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + yourcity + "&appid=" + APIKey + "&units=imperial";

    $.ajax({
        url: queryURL,
        method: "GET"
    })

        .then(function (response) {
            console.log(queryURL);
            console.log(response);

            //var currentDate = moment();
            var iconCode = response.weather[0].icon;
            var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
            console.log(response.weather[0].icon);

            $(".city-name").html("<h2>" + response.name + " " + moment().format("MM/DD/YYYY") + "</h2>");
            $("#icon").attr("src", iconURL);
            $(".today-temp").html("<p>" + "Temperature " + response.main.temp + " °F" + "</p>");
            $(".today-humidity").html("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            $(".today-wind-speed").html("<p>" + "Wind Speed: " + response.wind.speed + "mph" + "</p>");
            //$(".uv-index").html("<p>" + "UV-Index: " + response.uvIndex + "</p>");
            var lat = response.coord.lat;
            var long = response.coord.lon;
            uvIndex(lat, long);
        })

        
}


function  uvIndex(lat, long) {
    var coordURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + long + '&appid=' + APIKey;
        $.ajax({
            url: coordURL,
            method: 'GET'
        }).then(function(response) {
            var uv = parseFloat(response.value);
            $('.uv-index').removeClass('moderate high extreme');
            if (uv < 6) {
                $('.uv-index').addClass('low');
            } else if (uv < 10) {
                $('.uv-index').addClass('high');
            } else {
                $('.uv-index').addClass('dangerous');
            }
            $('.uv-index').empty();
            $('.uv-index').append('UV Index: ' + response.value);
        })

}


function fivedayForcast() {

    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + yourcity + "&appid=" + APIKey + "&units=imperial";

    $.ajax({
        url: queryURL2,
        method: "GET"
    })

        .then(function (forecast) {
            console.log(queryURL2);
            console.log(forecast);
            var currentDate = moment();
            
            for (var i = 6; i < forecast.list.length; i += 8) {
               
                var dateForecast = $("<h5>");
                var dailyPosition = (i + 2) / 8;

                //console.log("dateForecast" + "dailyPosition");
                
                $('#date' + dailyPosition).empty();
                $('#date' + dailyPosition).append(
                    dateForecast.text(currentDate.add(1, "days").format("M/D/YYYY"))
                );
                var iconCode = forecast.list[i].weather[0].icon;
                var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
                $("#icon" + dailyPosition).attr("src", iconURL);
                console.log(forecast.list[i].weather[0].icon);


                $("#temp" + dailyPosition).text("Temp: " + forecast.list[i].main.temp + " °F");

                $("#humidity" + dailyPosition).text("Humidity: " + forecast.list[i].main.humidity + "%");

                $(".forecast").attr("style", "background-color:blue; color:white");
            }

        })
}
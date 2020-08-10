
//my api key from the openweathermap.org
let APIKey = "4f8564279b0a48b567bd6ba7e52a8a22";
//let cityList = document.getElementById("list-of-cities");
//empty array for cities
let cities = [];
let yourcity= "";
searchCities();
cityButton();
saveCities();

function getCities () {
    let cityStorage = JSON.parse(localStorage.getItem("cities"));
    if (cityStorage === null || cityStorage === undefined){
        return;
    }
    makecitybuttons();
}
//localstorage for user city search
function saveCities () {
    localStorage.setItem("cities", JSON.stringify(cities));
   
}

 
function makecitybuttons() {
    $("#list-of-cities").innerHTML ="";
    if(cities === null){
        return;
    }
    $("#list-of-cities").empty();
    let specificCities = [...new Set (cities)];
    for (var i = 0; i < specificCities.length; i++){
        let newcityName = specificCities[i];

        let buttonElement = document.createElement("button");
        buttonElement.textContent = newcityName;
        buttonElement.setAttribute("class", "listbutton btn btn-outline-secondary btn-block");
        $("#list-of-cities").append(buttonElement);
        cityButton();
    }
}

function cityButton () {
    $("listbutton").on("click", function (event){
        event.preventDefault();
        cityList = $("#city-name").text();
    })
}

function searchCities(){
    $("#search-button").on("click", function(event){
        console.log("#search-button");
        event.preventDefault();
        yourcity = $("#city-name").val();
        cities.push(yourcity);

        //we only want 5 cities saved so .shift will remove the first saved city allow for a new one to be displayed 
        if(cities.length > 5) {
            cities.shift()
        }
        if (yourcity == "") {
        return;
        }
        saveCities();
        makecitybuttons();
    })
}








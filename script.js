const card = document.querySelector(".card"),
inputSection = document.querySelector(".input-section"),
infoError = inputSection.querySelector(".info-error"),
inputField = inputSection.querySelector("input"),
locationBtn = inputSection.querySelector("button"),
weatherSection = card.querySelector(".weather-section"),
wIcon = weatherSection.querySelector("img");

let api;

inputField.addEventListener("keyup", e =>{
    // si champs pas vide
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
        card.querySelector(".weather-section").style.display = "block";
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess);
    }else{
        alert("Erreur géolocalisation");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=0129ee49cedb77e90a1323848236df98`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords; // getting lat and lon of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=0129ee49cedb77e90a1323848236df98`;
    fetchData();
}

function fetchData(){
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoError.innerText = "Erreur";
    });
}

function weatherDetails(info){
    //console.log(info)
    if(info.cod == "404"){ // Si ville inconnue
        infoError.innerText = `${inputField.value} n'existe pas`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, humidity, feels_like, temp_min, temp_max} = info.main;
        const wind = info.wind.speed;

        // Adapter les pictos météo à la météo https://openweathermap.org/weather-conditions
        if(id == 800){
            wIcon.src = "./style/icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "./style/icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "./style/icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "./style/icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "./style/icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "./style/icons/rain.svg";
        }
        
        weatherSection.querySelector(".temperature .numb").innerText = Math.floor(temp);
        weatherSection.querySelector(".weather").innerText = description;
        weatherSection.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherSection.querySelector(".humidity span").innerText = `${humidity}%`;
        weatherSection.querySelector(".wind span").innerText = `${wind}Km/h`;
        weatherSection.querySelector(".feels span").innerText = `${feels_like}°C`;
        weatherSection.querySelector(".min span").innerText = `${temp_min}`;
        weatherSection.querySelector(".max span").innerText = `${temp_max}`;
        infoError.classList.remove("pending", "error");
        infoError.innerText = "";
        inputField.value = "";
    }
}

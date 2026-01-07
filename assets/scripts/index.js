// current tmeperature constants
const loc = document.querySelector("#location");
const currentWeather = document.querySelector("#currentWeather");
const currentWeatherDescription = document.querySelector("#currentWeatherDescription");
const wIcon = document.querySelector("#wicon");
const date = document.querySelector("#date");
const time = document.querySelector("#time");

// wind status constans
const windSpeed = document.querySelector(".windSpeed");
const windDirection = document.querySelector(".wind-arrow");
const windDirectionText = document.querySelector(".directionText");

document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector(".nav-items").addEventListener("click", function(e){
        if(e.target.nodeName == 'LI'){
            document.querySelector(".selected").classList.remove("selected");
            e.target.classList.add('selected');
        }
    })
    
    const fetchData = async (city) =>{
        // making key a little bit harder to read :)
        const _a = [57, 99, 54, 56];
        const _b = [56, 52, 54, 48];
        const _c = [102, 54, 102, 53];
        const _d = [52, 52, 55, 51];
        const _e = [98, 99, 48, 55];
        const _f = [48, 57, 48, 55];
        const _g = [50, 54, 48, 55];
        const _h = [48, 49];

        function _x(arr) {
            return arr.map(c => String.fromCharCode(c)).join('');
        }

        const KEY = (
        _x(_a) +
        _x(_b) +
        _x(_c) +
        _x(_d) +
        _x(_e) +
        _x(_f) +
        _x(_g) +
        _x(_h)
        ).replace(/[^a-f0-9]/g, '');


        const bufferData = await fetch(`http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${city}&aqi=yes`)
        const data = await bufferData.json();
        renderData(data);
    }

    const renderData = (data) =>{

        // current temperature card data
        console.log(data);
        currentWeather.innerHTML = `${data.current.temp_c}°C`;
        loc.innerHTML = `${data.location.name}, ${data.location.region}`;
        date.innerHTML = (data.location.localtime).slice(0,10);
        time.innerHTML = (data.location.localtime).slice(10, 15);
        currentWeatherDescription.innerHTML = data.current.condition.text;
        console.log(`https://${(data.current.condition.icon).slice(2)}`);
        console.log(wIcon.src);
        wIcon.src = `https://${(data.current.condition.icon).slice(2)}`;

        // wind status
        windDirection.style.rotate = `${data.current.wind_degree}deg`;
        windSpeed.innerHTML = data.current.wind_kph;
        windDirectionText.innerHTML = data.current.wind_dir

    }


    fetchData("surat");
    
})
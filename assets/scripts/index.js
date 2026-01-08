// current tmeperature constants
const loc = document.querySelector("#location");
const currentWeather = document.querySelector("#currentWeather");
const currentWeatherDescription = document.querySelector("#currentWeatherDescription");
const wIcon = document.querySelector("#wicon");
const date = document.querySelector("#date");
const time = document.querySelector("#time");

// wind status constants
const windSpeed = document.querySelector(".windSpeed");
const windDirection = document.querySelector(".wind-arrow");
const windDirectionText = document.querySelector(".directionText");

// uv status constants
const uv = document.querySelector(".uv");
const uvBar = document.querySelector(".uv-bar");

// humidity status constants
const humidity = document.querySelector(".humidity");
const dewPoint = document.querySelector(".dew-point");

// visibility status constants
const visibility = document.querySelector(".visibility");

// feels like status constants
const feel = document.querySelector(".feel");

// air quality status constants
const co = document.querySelector(".co");
// const gb_defra_index = document.querySelector(".gb-defra-index");
const no2 = document.querySelector(".no2");
const o3 = document.querySelector(".o3");
const pm2_5 = document.querySelector(".pm2_5");
const pm10 = document.querySelector(".pm10");
const so2 = document.querySelector(".so2");
// const us_epa_index = document.querySelector(".us-epa-index");

const form = document.querySelector("form");

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


        const bufferData = await fetch(`https://api.weatherapi.com/v1/current.json?key=${KEY}&q=${city}&aqi=yes`)
        const data = await bufferData.json();
        renderData(data);
    }

    const renderData = (data) =>{

        // current temperature card data
        currentWeather.innerHTML = `${data.current.temp_c}°C`;
        loc.innerHTML = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
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

        // uv status
        uv.innerHTML = data.current.uv;
        uvBar.style.width = ((data.current.uv) / 17) * 100 + '%';

        // humidity status
        humidity.innerHTML = data.current.humidity;
        dewPoint.innerHTML = data.current.dewpoint_c;

        // visibility status
        visibility.innerHTML = data.current.vis_km;

        // feels like status
        feel.innerHTML = data.current.feelslike_c;

        // air quality status
        co.innerHTML = data.current.air_quality.co;
        // gb_defra_index.innerHTML = data.current.air_quality.gb-defra-index;
        no2.innerHTML = data.current.air_quality.no2;
        o3.innerHTML = data.current.air_quality.o3;
        pm2_5.innerHTML = data.current.air_quality.pm2_5;
        pm10.innerHTML = data.current.air_quality.pm10;
        so2.innerHTML = data.current.air_quality.so2;
        // us_epa_index.innerHTML = data.current.air_quality.us-epa-index;

    }

    fetchData('surat');


    form.addEventListener("submit", (e)=>{
        e.preventDefault();
        const city = document.querySelector(".search-input").value;
        console.log(city);
        fetchData(city);
        document.querySelector(".search-input").value = '';
    })
    
})
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
const loadingText = document.querySelector(".loading-text");

document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector(".nav-items").addEventListener("click", function(e){
        if(e.target.nodeName == 'LI'){
            document.querySelector(".selected").classList.remove("selected");
            e.target.classList.add('selected');
        }
    })
    
    const fetchData = async (city) =>{
        loadingText.classList.remove("opacity-0");
        
        try {
            const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
            const geocodeResponse = await fetch(geocodeUrl);
            const geocodeData = await geocodeResponse.json();
            
            if (!geocodeData.results || geocodeData.results.length === 0) {
                throw new Error('City not found');
            }
            
            const location = geocodeData.results[0];
            const latitude = location.latitude;
            const longitude = location.longitude;

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index,visibility,dewpoint_2m&timezone=auto`;
            const weatherResponse = await fetch(weatherUrl);
            const weatherData = await weatherResponse.json();

            const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=carbon_monoxide,nitrogen_dioxide,ozone,pm2_5,pm10,sulphur_dioxide`;
            const airQualityResponse = await fetch(airQualityUrl);
            const airQualityData = await airQualityResponse.json();

            const transformedData = transformOpenMeteoData(location, weatherData, airQualityData);
            renderData(transformedData);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            loadingText.innerHTML = 'Error: ' + error.message;
            loadingText.classList.remove("opacity-0");
        }
    }
    
    const transformOpenMeteoData = (location, weatherData, airQualityData) => {
        const current = weatherData.current;
        const aq = airQualityData.current;

        const weatherDescriptions = {
            0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Foggy', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
            56: 'Light freezing drizzle', 57: 'Dense freezing drizzle', 61: 'Slight rain',
            63: 'Moderate rain', 65: 'Heavy rain', 66: 'Light freezing rain', 67: 'Heavy freezing rain',
            71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall', 77: 'Snow grains',
            80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
            85: 'Slight snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm',
            96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
        };
        
        const weatherCode = current.weather_code;
        const weatherText = weatherDescriptions[weatherCode] || 'Unknown';
        

        const iconCode = current.weather_code;
        const isDay = new Date().getHours() >= 6 && new Date().getHours() < 20;
        const iconPath = isDay ? 'day' : 'night';

        const iconUrl = `https://openweathermap.org/img/wn/${getWeatherIcon(iconCode, isDay)}@2x.png`;
        

        const windDir = getWindDirection(current.wind_direction_10m);
        

        const now = new Date();
        const dateTime = new Intl.DateTimeFormat('en-US', {
            timeZone: weatherData.timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).formatToParts(now);
        
        const year = dateTime.find(part => part.type === 'year').value;
        const month = dateTime.find(part => part.type === 'month').value;
        const day = dateTime.find(part => part.type === 'day').value;
        const hour = dateTime.find(part => part.type === 'hour').value;
        const minute = dateTime.find(part => part.type === 'minute').value;
        const localTime = `${year}-${month}-${day} ${hour}:${minute}`;
        
        return {
            location: {
                name: location.name,
                region: location.admin1 || location.country || '',
                country: location.country || '',
                localtime: localTime
            },
            current: {
                temp_c: Math.round(current.temperature_2m),
                condition: {
                    text: weatherText,
                    icon: iconUrl
                },
                wind_degree: current.wind_direction_10m,
                wind_kph: Math.round(current.wind_speed_10m * 3.6), // Convert m/s to km/h
                wind_dir: windDir,
                uv: Math.round(current.uv_index * 10) / 10,
                humidity: current.relative_humidity_2m,
                dewpoint_c: Math.round(current.dewpoint_2m),
                vis_km: (current.visibility / 1000).toFixed(1),
                feelslike_c: Math.round(current.apparent_temperature),
                air_quality: {
                    co: (aq.carbon_monoxide / 1000).toFixed(2),
                    no2: (aq.nitrogen_dioxide / 1000).toFixed(2),
                    o3: (aq.ozone / 1000).toFixed(2),
                    pm2_5: (aq.pm2_5 / 1000).toFixed(2),
                    pm10: (aq.pm10 / 1000).toFixed(2),
                    so2: (aq.sulphur_dioxide / 1000).toFixed(2)
                }
            }
        };
    }
    
    const getWindDirection = (degree) => {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        return directions[Math.round(degree / 22.5) % 16];
    }
    
    const getWeatherIcon = (code, isDay) => {
        
        const iconMap = {
            0: isDay ? '01d' : '01n', // Clear sky
            1: isDay ? '02d' : '02n', // Mainly clear
            2: isDay ? '03d' : '03n', // Partly cloudy
            3: '04d', // Overcast
            45: '50d', // Foggy
            48: '50d', // Depositing rime fog
            51: '09d', // Light drizzle
            53: '09d', // Moderate drizzle
            61: '10d', // Slight rain
            63: '10d', // Moderate rain
            65: '10d', // Heavy rain
            71: '13d', // Slight snow
            73: '13d', // Moderate snow
            75: '13d', // Heavy snow
            80: '09d', // Slight rain showers
            81: '09d', // Moderate rain showers
            82: '09d', // Violent rain showers
            85: '13d', // Slight snow showers
            86: '13d', // Heavy snow showers
            95: '11d', // Thunderstorm
            96: '11d', // Thunderstorm with slight hail
            99: '11d'  // Thunderstorm with heavy hail
        };
        return iconMap[code] || '01d';
    }

    const renderData = (data) =>{
        // current temperature card data
        currentWeather.innerHTML = `${data.current.temp_c}°C`;
        loc.innerHTML = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        date.innerHTML = (data.location.localtime).slice(0,10);
        time.innerHTML = (data.location.localtime).slice(10, 15);
        currentWeatherDescription.innerHTML = data.current.condition.text;
        wIcon.src = data.current.condition.icon;

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
        loadingText.classList.add("opacity-0");
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
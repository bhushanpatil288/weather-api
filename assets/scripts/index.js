// current tmeperature constants
const loc = document.querySelector("#location");
const currentWeather = document.querySelector("#currentWeather");
const currentWeatherDescription = document.querySelector("#currentWeatherDescription");
const wIcon = document.querySelector("#wicon");
const date = document.querySelector("#date");
const time = document.querySelector("#time");

document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector(".nav-items").addEventListener("click", function(e){
        if(e.target.nodeName == 'LI'){
            document.querySelector(".selected").classList.remove("selected");
            e.target.classList.add('selected');
        }
    })
    
    const fetchData = async (city) =>{
        const KEY = '9c688460f6f54473bc070907260701';

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

    }


    fetchData("surat");
    
})
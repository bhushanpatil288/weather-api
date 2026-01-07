document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelector(".nav-items").addEventListener("click", function(e){
        if(e.target.nodeName == 'LI'){
            document.querySelector(".selected").classList.remove("selected");
            e.target.classList.add('selected');
        }
    })
    
//     const fetchData = async (city) =>{
//         const KEY = '9c688460f6f54473bc070907260701';

//         const bufferData = await fetch(`http://api.weatherapi.com/v1/current.json?key=${KEY}&q=${city}&aqi=yes`)
//         const data = await data.json();
//         return data;
//     }

//     fetchData('surat');

    
})
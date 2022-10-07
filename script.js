const he1 = document.querySelector('h1')

async function getLocationKey(locationInput) {
    try {
        let promise = 
            await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=3gDsGAEp75BGo46eDPbNWjDL6zlFGslw&q=berlin`);
        let obj = await promise.json();
        he1.textContent = obj[0]['Key'];
    } catch (err) {
        console.log('something went wrong with location key')
    }    
}

console.log(getLocationKey())

function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
  
    return false;
  }



// let wether;
// fetch('http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/178087?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true&metric=true', {mode: 'cors'})
//     .then((w) => {
//         return w.json();
//     }).then((e) => {
//         wether = e;
//         console.log(wether)
//     })
//     .catch((err) => {console.log(err)});

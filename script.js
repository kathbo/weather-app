const he1 = document.querySelector('h1.what') // ????????
const textInput = document.getElementById('textInput');
const submitInput = document.getElementById('submitInput');
const btn = document.querySelector('button');
const currentTemeratureHeading = document.getElementById('currentTemperature')
const cityAndCountry = document.getElementById('cityAndCountry');
const currentDate = document.getElementById('currentDate');




let userInput;



btn.addEventListener('click', () => {
    userInput = getUserInput();
    //console.log(userInput)
    he1.textContent = userInput;
    console.log(getLocationKey(userInput))
})


let getUserInput = () => {
    return transformUserInput(textInput.value);
}

function transformUserInput(input) {
    if (typeof input === 'string') {
        return input.replace(/[0-9\s\W]/ig, '')
    } else {
        return 'user input is not a string. fix up your shit hoe'
    }
}

//GET A LOCATION KEY
let locationKey;
async function getLocationKey(input) {
    try {
        let promise = 
            await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=3gDsGAEp75BGo46eDPbNWjDL6zlFGslw&q=${input}`);
        let obj = await promise.json();
        let firstLocationObj = obj[0]
        he1.textContent = firstLocationObj['Key']; /// ???
        cityAndCountry.textContent = firstLocationObj['EnglishName'].concat(', ', firstLocationObj['Country']['EnglishName'])
        locationKey = firstLocationObj['Key'];
        console.log(locationKey); // ?????
    } catch (err) {
        console.log('something went wrong with location key')
    }    
}


//GET WEATHER DETAILS
async function getForcast(locationKey) {
    let forcastPromise = 
        await fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true&metric=true`)
    let obj = await forcastPromise.json();
    currentTemeratureHeading.textContent = obj[0]['Temperature']['Value'] + '°';
    console.log(obj[0]['Temperature']['Value'])
}

console.log(getForcast(274663))



// PROMISE CHECKER
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

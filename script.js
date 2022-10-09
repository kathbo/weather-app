const he1 = document.querySelector('h1.what') // ????????
const textInput = document.getElementById('textInput');
const submitInput = document.getElementById('submitInput');
const btn = document.querySelector('button');
const currentTemeratureHeading = document.getElementById('currentTemperature')
const cityAndCountry = document.getElementById('cityAndCountry');
const currentDate = document.getElementById('currentDate');




let transformedUserInput;
//let locationKey;





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
let locationKey = 'not working hoe';
async function getLocationKey(input) {
    try {
        let promise = 
            await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=3gDsGAEp75BGo46eDPbNWjDL6zlFGslw&q=${input}`);
        let obj = await promise.json();
        let firstLocationObj = obj[0]
        he1.textContent = firstLocationObj['Key']; /// ???
        cityAndCountry.textContent = firstLocationObj['EnglishName'].concat(', ', firstLocationObj['Country']['EnglishName'])
        locationKey = firstLocationObj['Key'];
        //return locationKey
        //console.log(locationKey); // ?????
    } catch (err) {
        console.log('something went wrong with location key')
    }    
}
console.log(locationKey)

//GET WEATHER DETAILS
// const getForcast = new Promise((resolve, reject) => {
//     resolve(fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/348735?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true&metric=true`));
//     reject('somebody fucked up')
    

// })
//     .then((obj) => {return obj.json()})
//     .then((arr) => {console.log(arr)})

// async function getForcast(locationKey) {
//     let forcastPromise = 
//         await fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true&metric=true`)
//     let obj = await forcastPromise.json();
//     currentTemeratureHeading.textContent = obj[0]['Temperature']['Value'] + '°';
//     console.log(obj[0]['Temperature']['Value'])
//     return obj;
// }
// getForcast(348735).then((obj) => {return obj})
// //getForcast().then((obj) => {return obj})
//console.log(getForcast)



let eightHoursDiv = document.querySelector('div.eightHours');

for (let x = 1; x < 9; x++) {
    let outerDiv = document.createElement('div');
    let para = document.createElement('p');
    para.textContent = x;
    if (x === 1) para.textContent = 'Now'
    outerDiv.appendChild(para);
    eightHoursDiv.appendChild(outerDiv);
}

function createAndFillClickableDivs(promise) {

}


btn.addEventListener('click', () => {
    transformedUserInput = getUserInput();
    console.log('user input: ' + transformedUserInput) // ?????
    
    he1.textContent = transformedUserInput;
    //createAndFillClickableDivs(getForcast())
    getLocationKey(transformedUserInput)
        .then(() => {
            console.log('location key: ' + locationKey); // ??
            getForcast(locationKey);
        })
        .catch(() => {
            console.error('getForcast() func not working babe')
        });
    
     // ?????
})

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

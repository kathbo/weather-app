const he1 = document.querySelector('h1.what') // ????????
const textInput = document.getElementById('textInput');
const submitInput = document.getElementById('submitInput');
const btn = document.querySelector('button');
const currentTemeratureHeading = document.getElementById('currentTemperature')
const cityAndCountry = document.getElementById('cityAndCountry');
const currentDate = document.getElementById('currentDate');

btn.addEventListener('click', () => {
    transformedUserInput = getUserInput();
    console.log('user input: ' + transformedUserInput); // ??????
    he1.textContent = transformedUserInput; // ????
    getLocationKey(transformedUserInput)
        .then(() => {
            getForcast(locationKey)
            .then(() => {
                createAndFillClickableDivs(forecastArray);
            })
        })
        .catch(() => {
            console.error('getForcast() func not working babe')
        });
    
})

let transformedUserInput;


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
let locationKey = 'location key not working hoe';
async function getLocationKey(input) {
    try {
        let promise = 
            await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=3gDsGAEp75BGo46eDPbNWjDL6zlFGslw&q=${input}`);
        let obj = await promise.json();
        let firstLocationObj = obj[0];
        he1.textContent = firstLocationObj['Key']; /// ???
        cityAndCountry.textContent = firstLocationObj['EnglishName'].concat(', ', firstLocationObj['Country']['EnglishName'])
        locationKey = firstLocationObj['Key'];
    } catch (err) {
        console.log('something went wrong with location key')
    }    
}

//GET WEATHER DETAILS
let forecastArray = [];
async function getForcast(locationKey) {
    let forcastPromise = 
        await fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=%203gDsGAEp75BGo46eDPbNWjDL6zlFGslw&details=true&metric=true`)
    let obj = await forcastPromise.json();
    currentTemeratureHeading.textContent = obj[0]['Temperature']['Value'] + '°';
    if (forecastArray.length != 0) forecastArray = [];
    for (let x of obj) {
        forecastArray.push(x)
    }
}



let eightHoursDiv = document.querySelector('div.eightHours');



function createAndFillClickableDivs(arr) {
    // current date
    let dateNow = new Date(arr[0]['DateTime']);
    console.log('date ' + dateNow)
    let convertedDate = dateNow.toDateString();
    console.log('convertedDate ' + convertedDate)
    currentDate.textContent = convertedDate.slice(0,11);
    console.log('slice ' + convertedDate.slice(0,11));

    let displayedTime = 0; // == current time
    eightHoursDiv.textContent = '';
    // create divs
    for (let x = 0; x < 8; x++) {
        // p that displays hours
        let outerDiv = document.createElement('div');
        outerDiv.classList.add('eightHoursChildDivs');
        let paraTime = document.createElement('p');
        paraTime.textContent = arr[x]['DateTime'].substr(11,5);
        if (x === 0) paraTime.textContent = 'Now';
        outerDiv.appendChild(paraTime);
        // outer outer div with an icon and temperature
        let insideOuterDiv = document.createElement('div');
        insideOuterDiv.classList.add('insideOuterDiv');
        let paraTemp = document.createElement('p');
        paraTemp.textContent = arr[x]['Temperature']['Value'] + '°';
        insideOuterDiv.appendChild(paraTemp);
        outerDiv.appendChild(insideOuterDiv);
        eightHoursDiv.appendChild(outerDiv);
    }

}

// PROMISE CHECKER
function isPromise(p) {
    if (typeof p === 'object' && typeof p.then === 'function') {
      return true;
    }
    return false;
  }